<?php
/**
 * Formulaire de contact — remplace l'ancien routage Symfony.
 * Reçoit {name, email, phone, projectType, budget, message} en JSON,
 * envoie l'email à contact@ et un accusé au visiteur.
 *
 * Secrets : lus depuis ../data/smtp-config.php (hors git, hors public_html).
 */
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: https://quernel-intelligence.com');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo json_encode(['success'=>false,'error'=>'Method not allowed']); exit; }

$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data || empty($data['email']) || empty($data['name']) || empty($data['message'])) {
    http_response_code(400);
    echo json_encode(['success'=>false,'error'=>'Champs requis manquants (name, email, message)']);
    exit;
}

define('QI_EMAIL', 'contact@quernel-intelligence.com');

$smtpConfig = dirname(dirname(__DIR__)) . '/data/smtp-config.php';
if (!file_exists($smtpConfig)) {
    http_response_code(500);
    echo json_encode(['success'=>false,'error'=>'Configuration manquante']);
    exit;
}
require_once $smtpConfig;

// Supprime aussi CR/LF/TAB : indispensable contre l'injection d'en-têtes email
// (un \r\n dans une valeur reprise en Subject permettrait d'ajouter Bcc/Cc).
function clean($v) {
    $v = str_replace(["\r", "\n", "\t", "%0d", "%0a"], ' ', $v ?? '');
    return htmlspecialchars(strip_tags(trim($v)), ENT_QUOTES, 'UTF-8');
}
// Variante pour le corps du message : conserve les sauts de ligne
// (jamais utilisée dans un en-tête email).
function cleanBody($v) {
    $v = str_replace(["\r", "%0d", "%0a"], '', $v ?? '');
    return htmlspecialchars(strip_tags(trim($v)), ENT_QUOTES, 'UTF-8');
}

$name = clean($data['name']);
$email = filter_var(trim($data['email']), FILTER_VALIDATE_EMAIL);
$phone = clean($data['phone'] ?? '');
$projectType = clean($data['projectType'] ?? '');
$budget = clean($data['budget'] ?? '');
$message = cleanBody($data['message']);

if (!$email) { http_response_code(400); echo json_encode(['success'=>false,'error'=>'Email invalide']); exit; }
if (mb_strlen($message) > 5000 || mb_strlen($name) > 200) {
    http_response_code(400); echo json_encode(['success'=>false,'error'=>'Message trop long']); exit;
}

// Rate limiting : 1/min par IP
$rateLimitFile = sys_get_temp_dir() . '/contact_send_' . md5($_SERVER['REMOTE_ADDR']);
if (file_exists($rateLimitFile) && (time() - (int)file_get_contents($rateLimitFile)) < 60) {
    http_response_code(429);
    echo json_encode(['success'=>false,'error'=>'Veuillez patienter 1 minute entre chaque envoi.']);
    exit;
}
file_put_contents($rateLimitFile, time());

// Email vers QI
$subQI = '[CONTACT] ' . $name . ($projectType ? ' — ' . $projectType : '');
$txtQI = "Nouveau message de contact\n\nNom : $name\nEmail : $email\nTelephone : $phone\nType de projet : $projectType\nBudget : $budget\n\nMessage :\n$message";

// Accusé de réception
$subAck = 'Bien recu — Quernel Intelligence';
$txtAck = "Bonjour $name,\n\nMerci pour votre message, il est bien arrive. Nous revenons vers vous sous 24 h ouvrees.\n\nEn attendant, vous pouvez voir nos agents IA travailler en direct : https://agents.quernel-cloud.com\n\nBien cordialement,\nMorvin Quernel\nQuernel Intelligence\nhttps://quernel-intelligence.com";

$rawQI = buildPlainMime("Site QI <" . SMTP_FROM . ">", SMTP_FROM, $subQI, $txtQI, $email);
$rawAck = buildPlainMime("Quernel Intelligence <" . SMTP_FROM . ">", $email, $subAck, $txtAck, QI_EMAIL);

$sentQI = smtpSend(SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM, $rawQI);
smtpSend(SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, $email, $rawAck);

if ($sentQI) {
    echo json_encode(['success' => true]);
    $tgFile = dirname(dirname(__DIR__)) . '/prospection/telegram-notify.php';
    if (file_exists($tgFile)) {
        require_once $tgFile;
        if (defined('TELEGRAM_BOT_TOKEN') && TELEGRAM_BOT_TOKEN !== '' && function_exists('telegramNotify')) {
            @telegramNotify("✉️ Nouveau contact\n\n" . $name . ($projectType ? " (" . $projectType . ")" : "") . "\n" . $email . ($phone ? "\n" . $phone : ""));
        }
    }
} else {
    http_response_code(500);
    echo json_encode(['success'=>false,'error'=>'Echec envoi email']);
}

function buildPlainMime($from, $to, $sub, $txt, $reply) {
    $h = "Date: " . date('r') . "\r\nFrom: $from\r\nTo: $to\r\nReply-To: $reply\r\nSubject: $sub\r\n";
    $h .= "Message-ID: <" . uniqid('qi_', true) . "@quernel-intelligence.com>\r\n";
    $h .= "MIME-Version: 1.0\r\nContent-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: 8bit\r\n\r\n";
    return $h . $txt . "\r\n";
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
