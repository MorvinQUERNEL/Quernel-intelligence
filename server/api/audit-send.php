<?php
/**
 * Audit IA flash — reçoit le formulaire /audit, enregistre la demande,
 * génère un rapport PDF des gains estimés et l'envoie par email.
 *
 * Secrets : lus depuis ../data/smtp-config.php (hors git, hors public_html).
 */
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: https://quernel-intelligence.com');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo json_encode(['error'=>'Method not allowed']); exit; }

$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data || empty($data['email']) || empty($data['entreprise']) || empty($data['taches'])) {
    http_response_code(400);
    echo json_encode(['error'=>'Missing required fields']);
    exit;
}

// ===== CONFIG =====
define('QI_NAME', 'Quernel Intelligence');
define('QI_EMAIL', 'contact@quernel-intelligence.com');
define('QI_SITE', 'https://quernel-intelligence.com');
define('QI_SIRET', '995 184 876 00010');

$smtpConfig = dirname(dirname(__DIR__)) . '/data/smtp-config.php';
if (!file_exists($smtpConfig)) {
    http_response_code(500);
    echo json_encode(['error'=>'Configuration manquante']);
    exit;
}
require_once $smtpConfig; // définit SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM

// ===== SANITIZE =====
function clean($v) { return htmlspecialchars(strip_tags(trim($v ?? '')), ENT_QUOTES, 'UTF-8'); }

$entreprise = clean($data['entreprise']);
$email = filter_var(trim($data['email']), FILTER_VALIDATE_EMAIL);
$secteur = clean($data['secteur'] ?? 'autre');
$taille = clean($data['taille'] ?? '');
$objectif = clean($data['objectif'] ?? '');
$taches = clean($data['taches']);
$outils = clean($data['outils'] ?? '');

if (!$email) { http_response_code(400); echo json_encode(['error'=>'Invalid email']); exit; }
if (mb_strlen($taches) > 4000 || mb_strlen($entreprise) > 200) {
    http_response_code(400); echo json_encode(['error'=>'Input too long']); exit;
}

// Rate limiting : 1/min par IP
$rateLimitFile = sys_get_temp_dir() . '/audit_send_' . md5($_SERVER['REMOTE_ADDR']);
if (file_exists($rateLimitFile) && (time() - (int)file_get_contents($rateLimitFile)) < 60) {
    http_response_code(429);
    echo json_encode(['error'=>'Veuillez patienter 1 minute entre chaque envoi.']);
    exit;
}
file_put_contents($rateLimitFile, time());

// ===== DATABASE =====
$dbPath = dirname(dirname(__DIR__)) . '/data/quernel_devis.sqlite';
$db = new SQLite3($dbPath);
$db->busyTimeout(5000);
$db->exec('PRAGMA journal_mode=WAL');
$db->exec("CREATE TABLE IF NOT EXISTS audits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    reference TEXT NOT NULL UNIQUE,
    entreprise TEXT NOT NULL,
    email TEXT NOT NULL,
    secteur TEXT DEFAULT '',
    taille TEXT DEFAULT '',
    objectif TEXT DEFAULT '',
    taches TEXT DEFAULT '',
    outils TEXT DEFAULT '',
    statut TEXT DEFAULT 'flash',
    created_at TEXT DEFAULT (datetime('now'))
)");
$db->exec("CREATE TABLE IF NOT EXISTS audit_sequence (year INTEGER PRIMARY KEY, last_number INTEGER DEFAULT 0)");

$year = (int)date('Y');
$seq = $db->prepare("INSERT INTO audit_sequence (year, last_number) VALUES (:y, 1) ON CONFLICT(year) DO UPDATE SET last_number = last_number + 1");
$seq->bindValue(':y', $year, SQLITE3_INTEGER);
$seq->execute();
$numStmt = $db->prepare("SELECT last_number FROM audit_sequence WHERE year = :y");
$numStmt->bindValue(':y', $year, SQLITE3_INTEGER);
$numRow = $numStmt->execute()->fetchArray(SQLITE3_ASSOC);
$auditRef = 'QA-' . $year . '-' . str_pad($numRow['last_number'], 4, '0', STR_PAD_LEFT);

$ins = $db->prepare("INSERT INTO audits (reference, entreprise, email, secteur, taille, objectif, taches, outils) VALUES (:r,:e,:m,:s,:t,:o,:ta,:ou)");
$ins->bindValue(':r', $auditRef, SQLITE3_TEXT);
$ins->bindValue(':e', $entreprise, SQLITE3_TEXT);
$ins->bindValue(':m', $email, SQLITE3_TEXT);
$ins->bindValue(':s', $secteur, SQLITE3_TEXT);
$ins->bindValue(':t', $taille, SQLITE3_TEXT);
$ins->bindValue(':o', $objectif, SQLITE3_TEXT);
$ins->bindValue(':ta', $taches, SQLITE3_TEXT);
$ins->bindValue(':ou', $outils, SQLITE3_TEXT);
$ins->execute();
$db->close();

// ===== ANALYSE DES TÂCHES (règles simples, fourchettes prudentes) =====
$t = mb_strtolower($taches . ' ' . $outils);

$opportunites = [];
$lib = [
    ['kw' => ['devis', 'chiffrage', 'estimation'],
     'titre' => 'Devis assistés',
     'situation' => 'Chaque devis est redige a la main, souvent en dehors des heures ouvrees.',
     'solution' => 'Un agent IA prepare le devis dans votre format a partir de votre grille tarifaire. Vous relisez, vous ajustez, vous envoyez.',
     'gain' => 'De 45 a 15 minutes par devis environ, selon la complexite.',
     'effort' => '2 a 3 jours de mise en place'],
    ['kw' => ['impay', 'relance', 'facture', 'reglement', 'paiement'],
     'titre' => 'Relances d\'impayes graduees',
     'situation' => 'Les relances partent tard ou pas du tout, et les delais de paiement s\'allongent.',
     'solution' => 'Brouillons de relance prepares automatiquement en 3 niveaux (courtoise, ferme, mise en demeure amiable). Vous validez chaque envoi.',
     'gain' => '1 a 2 heures par semaine, et un delai de paiement souvent reduit de plusieurs jours.',
     'effort' => '1 a 2 jours de mise en place'],
    ['kw' => ['email', 'mail', 'courrier', 'boite', 'messagerie', 'question'],
     'titre' => 'Tri de boite de reception et brouillons de reponse',
     'situation' => 'Le tri des messages et les reponses repetitives consomment du temps chaque jour.',
     'solution' => 'Un agent classe les demandes (urgent / commercial / courant), produit une to-do priorisee et prepare les brouillons dans votre ton.',
     'gain' => '30 a 45 minutes par jour selon le volume.',
     'effort' => '1 jour de mise en place'],
    ['kw' => ['prospect', 'client', 'demarch', 'commercial', 'vendre', 'vente'],
     'titre' => 'Prospection assistee',
     'situation' => 'La recherche de nouveaux clients passe apres l\'operationnel, faute de temps.',
     'solution' => 'Un agent identifie des cibles avec un signal d\'achat verifiable et prepare des sequences d\'emails personnalisees.',
     'gain' => '10 a 20 cibles qualifiees et argumentees par session, sans y passer vos soirees.',
     'effort' => '2 a 3 jours de mise en place'],
    ['kw' => ['reseaux', 'linkedin', 'instagram', 'publication', 'contenu', 'communication', 'post'],
     'titre' => 'Contenu regulier',
     'situation' => 'La communication en ligne est irreguliere car elle passe toujours en dernier.',
     'solution' => 'Un agent redige posts et emails dans votre ton, prets a publier apres relecture.',
     'gain' => '2 a 3 publications par semaine pour environ 30 minutes de relecture.',
     'effort' => '1 a 2 jours de mise en place'],
    ['kw' => ['rdv', 'rendez-vous', 'planning', 'agenda', 'reservation'],
     'titre' => 'Prise de rendez-vous et planning',
     'situation' => 'Les allers-retours pour caler un rendez-vous s\'accumulent.',
     'solution' => 'Workflow de reservation en ligne connecte a votre agenda, avec confirmations et rappels automatiques.',
     'gain' => '2 a 4 heures par semaine selon le volume de rendez-vous.',
     'effort' => '1 a 2 jours de mise en place'],
    ['kw' => ['saisie', 'excel', 'tableur', 'rapport', 'export', 'copier'],
     'titre' => 'Fin des ressaisies entre outils',
     'situation' => 'Les memes donnees sont saisies plusieurs fois dans des outils differents.',
     'solution' => 'Workflows qui relient vos outils existants : la donnee saisie une fois circule toute seule.',
     'gain' => '1 a 3 heures par semaine et moins d\'erreurs de saisie.',
     'effort' => '2 a 4 jours selon les outils'],
];

foreach ($lib as $op) {
    foreach ($op['kw'] as $kw) {
        if (mb_strpos($t, $kw) !== false) { $opportunites[] = $op; break; }
    }
    if (count($opportunites) >= 3) break;
}
// Fallback : toujours au moins 2 pistes générales
if (count($opportunites) === 0) {
    $opportunites[] = $lib[2]; // tri emails
    $opportunites[] = $lib[6]; // ressaisies
}

// ===== PDF =====
require_once(dirname(__DIR__) . '/lib/fpdf/fpdf.php');

function utf8to($str) {
    $out = iconv('UTF-8', 'ISO-8859-1//TRANSLIT//IGNORE', $str);
    return $out !== false ? $out : $str;
}

class AuditPDF extends FPDF {
    function Header() {
        $this->SetFillColor(10, 10, 10);
        $this->Rect(0, 0, 210, 32, 'F');
        $this->SetTextColor(56, 189, 248);
        $this->SetFont('Helvetica', 'B', 16);
        $this->SetXY(15, 9);
        $this->Cell(0, 8, 'QUERNEL INTELLIGENCE', 0, 1);
        $this->SetTextColor(200, 200, 200);
        $this->SetFont('Helvetica', '', 9);
        $this->SetX(15);
        $this->Cell(0, 5, utf8to('Audit IA flash — rapport preliminaire'), 0, 1);
        $this->SetY(40);
        $this->SetTextColor(20, 20, 20);
    }
    function Footer() {
        $this->SetY(-18);
        $this->SetFont('Helvetica', '', 7.5);
        $this->SetTextColor(120, 120, 120);
        $this->Cell(0, 4, utf8to(QI_NAME . ' — SIRET ' . QI_SIRET . ' — ' . QI_EMAIL . ' — ' . QI_SITE), 0, 1, 'C');
        $this->Cell(0, 4, utf8to('Page ' . $this->PageNo()), 0, 0, 'C');
    }
    function SectionTitle($title) {
        $this->Ln(4);
        $this->SetFont('Helvetica', 'B', 12);
        $this->SetTextColor(2, 132, 199);
        $this->Cell(0, 7, utf8to($title), 0, 1);
        $this->SetDrawColor(56, 189, 248);
        $this->SetLineWidth(0.4);
        $this->Line(15, $this->GetY(), 80, $this->GetY());
        $this->Ln(3);
        $this->SetTextColor(20, 20, 20);
    }
    function Para($txt, $style = '', $size = 9.5) {
        $this->SetFont('Helvetica', $style, $size);
        $this->MultiCell(0, 5, utf8to($txt));
        $this->Ln(1);
    }
}

$pdf = new AuditPDF();
$pdf->SetMargins(15, 15, 15);
$pdf->AddPage();

$pdf->SetFont('Helvetica', 'B', 13);
$pdf->Cell(0, 7, utf8to($entreprise), 0, 1);
$pdf->SetFont('Helvetica', '', 9);
$pdf->SetTextColor(100, 100, 100);
$pdf->Cell(0, 5, utf8to('Reference ' . $auditRef . ' — ' . date('d/m/Y')), 0, 1);
$pdf->SetTextColor(20, 20, 20);

$pdf->SectionTitle('Comment lire ce rapport');
$pdf->Para("Ce rapport flash est genere a partir de vos reponses au formulaire. Les gains indiques sont des ordres de grandeur observes sur des entreprises comparables : des fourchettes prudentes, pas des promesses. L'audit complet sert precisement a remplacer ces ordres de grandeur par vos chiffres reels.");

$pdf->SectionTitle('Ce que vous nous avez decrit');
$pdf->Para('Secteur : ' . ($secteur ?: 'non precise') . '   |   Taille : ' . ($taille ?: 'non precisee') . '   |   Objectif prioritaire : ' . ($objectif ?: 'non precise'), '', 9);
$pdf->Para('Taches decrites : ' . $taches, 'I', 9);
if ($outils) { $pdf->Para('Outils actuels : ' . $outils, 'I', 9); }

$pdf->SectionTitle('Opportunites identifiees');
$i = 1;
foreach ($opportunites as $op) {
    $pdf->SetFont('Helvetica', 'B', 10.5);
    $pdf->Cell(0, 6, utf8to($i . '. ' . $op['titre']), 0, 1);
    $pdf->Para('Situation : ' . $op['situation'], '', 9);
    $pdf->Para('Solution : ' . $op['solution'], '', 9);
    $pdf->SetTextColor(2, 132, 199);
    $pdf->Para('Gain estime : ' . $op['gain'] . '   |   Mise en place : ' . $op['effort'], 'B', 9);
    $pdf->SetTextColor(20, 20, 20);
    $pdf->Ln(1);
    $i++;
}

$pdf->SectionTitle('Les limites de cet exercice');
$pdf->Para("Un formulaire ne remplace pas une conversation. Ce rapport ne voit ni votre organisation reelle, ni vos contraintes, ni ce qui releve d'autre chose que de l'automatisation (organisation, commercial, produit). C'est le role de l'audit complet : une demi-journee avec vous pour chronometrer les vrais processus, chiffrer chaque opportunite avec ses hypotheses, et prioriser.");

$pdf->SectionTitle('Prochaine etape');
$pdf->Para("Audit complet : de 490 a 990 euros selon la taille de l'entreprise, montant deduit si vous lancez un projet avec nous. Reservation par retour d'email ou sur " . QI_SITE . "/devis");
$pdf->Para("Vous pouvez aussi voir nos agents IA travailler en direct (demonstration libre, donnees fictives) : https://agents.quernel-cloud.com");

$pdfContent = $pdf->Output('S');
$pdfFilename = 'Audit_Flash_' . $auditRef . '.pdf';

// ===== EMAILS =====
$bMixed = 'qi_mixed_' . md5(uniqid());
$bAlt = 'qi_alt_' . md5(uniqid());

$subClient = 'Votre audit IA flash — ' . $auditRef;
$txtClient = "Bonjour,\n\nMerci pour votre demande d'audit flash. Vous trouverez en piece jointe le rapport preliminaire pour " . $entreprise . ".\n\nCe rapport donne des ordres de grandeur : pour des chiffres bases sur vos processus reels, l'audit complet (une demi-journee, de 490 a 990 euros selon la taille, deduits si vous lancez un projet) est la suite logique. Repondez simplement a cet email pour en parler.\n\nVous pouvez aussi tester nos agents IA en direct : https://agents.quernel-cloud.com\n\nBien cordialement,\nMorvin Quernel\n" . QI_NAME . "\n" . QI_SITE;

$subQI = '[AUDIT FLASH] ' . $entreprise . ' — ' . $auditRef;
$txtQI = "Nouvelle demande d'audit flash\n\nReference : $auditRef\nEntreprise : $entreprise\nEmail : $email\nSecteur : $secteur\nTaille : $taille\nObjectif : $objectif\n\nTaches decrites :\n$taches\n\nOutils : $outils\n\nOpportunites detectees : " . implode(', ', array_map(fn($o) => $o['titre'], $opportunites));

$rawClient = buildMime(QI_NAME . " <" . SMTP_FROM . ">", $email, $subClient, $txtClient, '', $pdfContent, $pdfFilename, $bMixed, $bAlt, QI_EMAIL);
$rawQI = buildMime("Audit Auto <" . SMTP_FROM . ">", SMTP_FROM, $subQI, $txtQI, '', $pdfContent, $pdfFilename, 'qi_m2_' . md5(uniqid()), 'qi_a2_' . md5(uniqid()), $email);

$sentClient = smtpSend(SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, $email, $rawClient);
smtpSend(SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM, $rawQI);

if ($sentClient) {
    echo json_encode(['success' => true, 'auditRef' => $auditRef]);
    // Notification Telegram (non bloquant)
    $tgFile = dirname(dirname(__DIR__)) . '/prospection/telegram-notify.php';
    if (file_exists($tgFile)) {
        require_once $tgFile;
        if (defined('TELEGRAM_BOT_TOKEN') && TELEGRAM_BOT_TOKEN !== '' && function_exists('telegramNotify')) {
            @telegramNotify("🔍 Audit flash demande\n\n" . $entreprise . " (" . $secteur . ", " . $taille . ")\n" . $email . "\nRef : " . $auditRef);
        }
    }
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Echec envoi email']);
}

// ===== FUNCTIONS (mêmes patterns que devis-send.php) =====

function buildMime($from, $to, $sub, $txt, $html, $pdf, $pdfName, $bm, $ba, $reply) {
    $h = "Date: " . date('r') . "\r\nFrom: $from\r\nTo: $to\r\nReply-To: $reply\r\nSubject: $sub\r\n";
    $h .= "Message-ID: <" . uniqid('qi_', true) . "@quernel-intelligence.com>\r\n";
    $h .= "MIME-Version: 1.0\r\nContent-Type: multipart/mixed; boundary=\"$bm\"\r\n\r\n";
    $body = "--$bm\r\nContent-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: 8bit\r\n\r\n$txt\r\n\r\n";
    if ($pdf && $pdfName) {
        $body .= "--$bm\r\nContent-Type: application/pdf; name=\"$pdfName\"\r\nContent-Disposition: attachment; filename=\"$pdfName\"\r\n";
        $body .= "Content-Transfer-Encoding: base64\r\n\r\n" . chunk_split(base64_encode($pdf)) . "\r\n";
    }
    $body .= "--$bm--\r\n";
    return $h . $body;
}

function smtpSend($host, $port, $user, $pass, $to, $raw) {
    $s = @fsockopen($host, $port, $en, $es, 15);
    if (!$s) return false;
    stream_set_timeout($s, 15);
    $r = fgets($s, 512); if (substr($r,0,3)!=='220') { fclose($s); return false; }
    fwrite($s, "EHLO quernel-intelligence.com\r\n");
    while ($l = fgets($s, 512)) { if (substr($l,3,1)===' ') break; }
    fwrite($s, "STARTTLS\r\n");
    $r = fgets($s, 512); if (substr($r,0,3)!=='220') { fclose($s); return false; }
    if (!stream_socket_enable_crypto($s, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) { fclose($s); return false; }
    fwrite($s, "EHLO quernel-intelligence.com\r\n");
    while ($l = fgets($s, 512)) { if (substr($l,3,1)===' ') break; }
    fwrite($s, "AUTH LOGIN\r\n");
    $r = fgets($s, 512); if (substr($r,0,3)!=='334') { fclose($s); return false; }
    fwrite($s, base64_encode($user) . "\r\n");
    $r = fgets($s, 512); if (substr($r,0,3)!=='334') { fclose($s); return false; }
    fwrite($s, base64_encode($pass) . "\r\n");
    $r = fgets($s, 512); if (substr($r,0,3)!=='235') { fclose($s); return false; }
    fwrite($s, "MAIL FROM:<" . SMTP_FROM . ">\r\n");
    $r = fgets($s, 512); if (substr($r,0,3)!=='250') { fclose($s); return false; }
    fwrite($s, "RCPT TO:<$to>\r\n");
    $r = fgets($s, 512); if (substr($r,0,3)!=='250') { fclose($s); return false; }
    fwrite($s, "DATA\r\n");
    $r = fgets($s, 512); if (substr($r,0,3)!=='354') { fclose($s); return false; }
    fwrite($s, str_replace("\n.", "\n..", $raw) . "\r\n.\r\n");
    $r = fgets($s, 512); if (substr($r,0,3)!=='250') { fclose($s); return false; }
    fwrite($s, "QUIT\r\n"); fclose($s); return true;
}
