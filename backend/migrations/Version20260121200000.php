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
        return 'Ajoute les colonnes google_id, apple_id et auth_provider à la table user pour OAuth';
    }

    public function up(Schema $schema): void
    {
        // Ajout des colonnes OAuth (syntaxe MySQL)
        $this->addSql('ALTER TABLE `user` ADD google_id VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE `user` ADD apple_id VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE `user` ADD auth_provider VARCHAR(50) DEFAULT NULL');

        // Index pour recherche rapide par provider ID
        $this->addSql('CREATE INDEX IDX_USER_GOOGLE ON `user` (google_id)');
        $this->addSql('CREATE INDEX IDX_USER_APPLE ON `user` (apple_id)');
    }

    public function down(Schema $schema): void
    {
        // Suppression des index
        $this->addSql('DROP INDEX IDX_USER_GOOGLE ON `user`');
        $this->addSql('DROP INDEX IDX_USER_APPLE ON `user`');

        // Suppression des colonnes
        $this->addSql('ALTER TABLE `user` DROP COLUMN google_id');
        $this->addSql('ALTER TABLE `user` DROP COLUMN apple_id');
        $this->addSql('ALTER TABLE `user` DROP COLUMN auth_provider');
    }
}
