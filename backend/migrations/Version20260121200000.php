<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Migration pour ajouter les champs OAuth (Google, Apple) à la table user
 */
final class Version20260121200000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Ajoute les colonnes google_id et apple_id à la table user pour OAuth';
    }

    public function up(Schema $schema): void
    {
        // Check and add columns if they don't exist
        $this->addSql('ALTER TABLE user ADD COLUMN IF NOT EXISTS google_id VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE user ADD COLUMN IF NOT EXISTS apple_id VARCHAR(255) DEFAULT NULL');

        // Index pour recherche rapide par provider ID (ignore if exists)
        $this->addSql('CREATE INDEX IF NOT EXISTS IDX_USER_GOOGLE ON user (google_id)');
        $this->addSql('CREATE INDEX IF NOT EXISTS IDX_USER_APPLE ON user (apple_id)');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP INDEX IF EXISTS IDX_USER_GOOGLE ON user');
        $this->addSql('DROP INDEX IF EXISTS IDX_USER_APPLE ON user');
        $this->addSql('ALTER TABLE user DROP COLUMN IF EXISTS google_id');
        $this->addSql('ALTER TABLE user DROP COLUMN IF EXISTS apple_id');
    }
}
