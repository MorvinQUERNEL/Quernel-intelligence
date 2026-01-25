<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Migration pour créer la table subscription (gestion des abonnements Stripe)
 */
final class Version20260121200100 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Crée la table subscription pour la gestion des abonnements Stripe';
    }

    public function up(Schema $schema): void
    {
        // Création de la table subscription (syntaxe MySQL avec CHAR(36) pour UUID)
        $this->addSql('CREATE TABLE IF NOT EXISTS subscription (
            id CHAR(36) NOT NULL,
            user_id CHAR(36) NOT NULL,
            plan_id CHAR(36) NOT NULL,
            stripe_subscription_id VARCHAR(255) NOT NULL,
            stripe_price_id VARCHAR(255) DEFAULT NULL,
            status VARCHAR(50) NOT NULL,
            billing_interval VARCHAR(20) NOT NULL,
            current_period_start DATETIME DEFAULT NULL,
            current_period_end DATETIME DEFAULT NULL,
            trial_start DATETIME DEFAULT NULL,
            trial_end DATETIME DEFAULT NULL,
            cancel_at_period_end TINYINT(1) NOT NULL DEFAULT 0,
            canceled_at DATETIME DEFAULT NULL,
            ended_at DATETIME DEFAULT NULL,
            amount DECIMAL(10, 2) DEFAULT NULL,
            currency VARCHAR(3) NOT NULL DEFAULT \'eur\',
            created_at DATETIME NOT NULL,
            updated_at DATETIME NOT NULL,
            PRIMARY KEY (id),
            UNIQUE INDEX UNIQ_SUBSCRIPTION_STRIPE (stripe_subscription_id),
            INDEX IDX_SUBSCRIPTION_USER (user_id),
            INDEX IDX_SUBSCRIPTION_PLAN (plan_id),
            INDEX IDX_SUBSCRIPTION_STATUS (status)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');

        // Add foreign keys separately (ignore if they exist)
        $this->addSql('ALTER TABLE subscription ADD CONSTRAINT FK_SUBSCRIPTION_USER FOREIGN KEY IF NOT EXISTS (user_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE subscription ADD CONSTRAINT FK_SUBSCRIPTION_PLAN FOREIGN KEY IF NOT EXISTS (plan_id) REFERENCES plan (id)');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP TABLE IF EXISTS subscription');
    }
}
