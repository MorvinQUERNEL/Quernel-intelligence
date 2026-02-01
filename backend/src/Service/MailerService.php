<?php

declare(strict_types=1);

namespace App\Service;

use App\DTO\ContactDTO;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Address;
use Symfony\Component\Mime\Email;

/**
 * Service for sending emails.
 */
final class MailerService
{
    private const RECIPIENT_EMAIL = 'contact@quernel-intelligence.com';
    private const RECIPIENT_NAME = 'Morvin QUERNEL';
    private const SENDER_EMAIL = 'noreply@quernel-intelligence.com';
    private const SENDER_NAME = 'QUERNEL INTELLIGENCE';

    public function __construct(
        private readonly MailerInterface $mailer,
    ) {
    }

    /**
     * Send a contact form notification email.
     */
    public function sendContactNotification(ContactDTO $contact): void
    {
        $email = (new Email())
            ->from(new Address(self::SENDER_EMAIL, self::SENDER_NAME))
            ->to(new Address(self::RECIPIENT_EMAIL, self::RECIPIENT_NAME))
            ->replyTo(new Address($contact->email, $contact->name))
            ->subject(sprintf('Nouveau contact : %s - %s', $contact->name, $contact->getProjectTypeLabel()))
            ->html($this->buildHtmlContent($contact))
            ->text($this->buildTextContent($contact));

        $this->mailer->send($email);
    }

    /**
     * Build HTML email content.
     */
    private function buildHtmlContent(ContactDTO $contact): string
    {
        $html = <<<HTML
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nouveau contact - QUERNEL INTELLIGENCE</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #4F46E5, #7C3AED); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .header h1 { margin: 0; font-size: 24px; }
        .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #4F46E5; display: block; margin-bottom: 5px; }
        .value { background: white; padding: 10px; border-radius: 4px; border: 1px solid #e5e7eb; }
        .message { background: white; padding: 15px; border-radius: 4px; border-left: 4px solid #4F46E5; }
        .footer { background: #374151; color: white; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>📬 Nouveau message de contact</h1>
    </div>
    <div class="content">
        <div class="field">
            <span class="label">👤 Nom</span>
            <div class="value">%s</div>
        </div>
        <div class="field">
            <span class="label">📧 Email</span>
            <div class="value"><a href="mailto:%s">%s</a></div>
        </div>
        <div class="field">
            <span class="label">📱 Téléphone</span>
            <div class="value"><a href="tel:%s">%s</a></div>
        </div>
        <div class="field">
            <span class="label">🎯 Type de projet</span>
            <div class="value">%s</div>
        </div>
        <div class="field">
            <span class="label">💰 Budget</span>
            <div class="value">%s</div>
        </div>
        <div class="field">
            <span class="label">💬 Message</span>
            <div class="message">%s</div>
        </div>
    </div>
    <div class="footer">
        QUERNEL INTELLIGENCE - SASU<br>
        SIRET: 995 184 876 00010 - Vigneux-sur-Seine (91270)
    </div>
</body>
</html>
HTML;

        return sprintf(
            $html,
            htmlspecialchars($contact->name),
            htmlspecialchars($contact->email),
            htmlspecialchars($contact->email),
            htmlspecialchars($contact->phone),
            htmlspecialchars($contact->phone),
            htmlspecialchars($contact->getProjectTypeLabel()),
            htmlspecialchars($contact->getBudgetLabel()),
            nl2br(htmlspecialchars($contact->message))
        );
    }

    /**
     * Build plain text email content.
     */
    private function buildTextContent(ContactDTO $contact): string
    {
        return sprintf(
            <<<TEXT
=== NOUVEAU MESSAGE DE CONTACT ===

Nom: %s
Email: %s
Téléphone: %s
Type de projet: %s
Budget: %s

Message:
%s

---
QUERNEL INTELLIGENCE - SASU
SIRET: 995 184 876 00010 - Vigneux-sur-Seine (91270)
TEXT,
            $contact->name,
            $contact->email,
            $contact->phone,
            $contact->getProjectTypeLabel(),
            $contact->getBudgetLabel(),
            $contact->message
        );
    }
}
