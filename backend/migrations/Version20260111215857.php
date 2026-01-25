<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Initial schema - MySQL/MariaDB compatible
 */
final class Version20260111215857 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create initial schema for QUERNEL INTELLIGENCE';
    }

    public function up(Schema $schema): void
    {
        // Plan table
        $this->addSql('CREATE TABLE IF NOT EXISTS plan (
            id CHAR(36) NOT NULL,
            name VARCHAR(100) NOT NULL,
            slug VARCHAR(50) NOT NULL,
            monthly_tokens INT NOT NULL,
            max_agents INT NOT NULL,
            max_documents INT NOT NULL,
            max_team_members INT NOT NULL,
            has_api_access TINYINT(1) NOT NULL,
            has_workflows TINYINT(1) NOT NULL,
            has_priority_support TINYINT(1) NOT NULL,
            price_monthly DECIMAL(10, 2) DEFAULT NULL,
            price_yearly DECIMAL(10, 2) DEFAULT NULL,
            stripe_price_id_monthly VARCHAR(255) DEFAULT NULL,
            stripe_price_id_yearly VARCHAR(255) DEFAULT NULL,
            is_active TINYINT(1) NOT NULL,
            created_at DATETIME NOT NULL,
            PRIMARY KEY (id),
            UNIQUE INDEX UNIQ_DD5A5B7D989D9B62 (slug)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');

        // User table
        $this->addSql('CREATE TABLE IF NOT EXISTS user (
            id CHAR(36) NOT NULL,
            email VARCHAR(180) NOT NULL,
            roles JSON NOT NULL,
            password VARCHAR(255) NOT NULL,
            first_name VARCHAR(100) DEFAULT NULL,
            last_name VARCHAR(100) DEFAULT NULL,
            avatar_url VARCHAR(500) DEFAULT NULL,
            email_verified_at DATETIME DEFAULT NULL,
            is_active TINYINT(1) NOT NULL,
            plan_started_at DATETIME DEFAULT NULL,
            plan_expires_at DATETIME DEFAULT NULL,
            stripe_customer_id VARCHAR(255) DEFAULT NULL,
            auth_provider VARCHAR(50) DEFAULT NULL,
            auth_provider_id VARCHAR(255) DEFAULT NULL,
            created_at DATETIME NOT NULL,
            updated_at DATETIME NOT NULL,
            last_login_at DATETIME DEFAULT NULL,
            plan_id CHAR(36) DEFAULT NULL,
            PRIMARY KEY (id),
            UNIQUE INDEX UNIQ_8D93D649E7927C74 (email),
            INDEX IDX_8D93D649E899029B (plan_id)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');

        // Agent table
        $this->addSql('CREATE TABLE IF NOT EXISTS agent (
            id CHAR(36) NOT NULL,
            name VARCHAR(100) NOT NULL,
            description TEXT DEFAULT NULL,
            avatar_url VARCHAR(500) DEFAULT NULL,
            system_prompt TEXT NOT NULL,
            model VARCHAR(100) NOT NULL,
            temperature DECIMAL(3, 2) NOT NULL DEFAULT 0.7,
            max_tokens INT NOT NULL DEFAULT 2048,
            is_public TINYINT(1) NOT NULL,
            created_at DATETIME NOT NULL,
            updated_at DATETIME NOT NULL,
            user_id CHAR(36) NOT NULL,
            PRIMARY KEY (id),
            INDEX IDX_268B9C9DA76ED395 (user_id)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');

        // API Key table
        $this->addSql('CREATE TABLE IF NOT EXISTS api_key (
            id CHAR(36) NOT NULL,
            name VARCHAR(100) NOT NULL,
            key_hash VARCHAR(255) NOT NULL,
            key_prefix VARCHAR(12) NOT NULL,
            scopes TEXT DEFAULT NULL,
            rate_limit_per_minute INT NOT NULL,
            last_used_at DATETIME DEFAULT NULL,
            total_requests INT NOT NULL DEFAULT 0,
            expires_at DATETIME DEFAULT NULL,
            created_at DATETIME NOT NULL,
            revoked_at DATETIME DEFAULT NULL,
            user_id CHAR(36) NOT NULL,
            PRIMARY KEY (id),
            INDEX IDX_C912ED9DA76ED395 (user_id)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');

        // Conversation table
        $this->addSql('CREATE TABLE IF NOT EXISTS conversation (
            id CHAR(36) NOT NULL,
            title VARCHAR(255) DEFAULT NULL,
            message_count INT NOT NULL DEFAULT 0,
            total_tokens INT NOT NULL DEFAULT 0,
            created_at DATETIME NOT NULL,
            updated_at DATETIME NOT NULL,
            archived_at DATETIME DEFAULT NULL,
            user_id CHAR(36) NOT NULL,
            agent_id CHAR(36) DEFAULT NULL,
            PRIMARY KEY (id),
            INDEX IDX_8A8E26E9A76ED395 (user_id),
            INDEX IDX_8A8E26E93414710B (agent_id)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');

        // Message table
        $this->addSql('CREATE TABLE IF NOT EXISTS message (
            id CHAR(36) NOT NULL,
            role VARCHAR(20) NOT NULL,
            content LONGTEXT NOT NULL,
            prompt_tokens INT NOT NULL DEFAULT 0,
            completion_tokens INT NOT NULL DEFAULT 0,
            created_at DATETIME NOT NULL,
            conversation_id CHAR(36) NOT NULL,
            PRIMARY KEY (id),
            INDEX IDX_B6BD307F9AC0396 (conversation_id)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');

        // Foreign keys (only add if they don't exist)
        $this->addSql('ALTER TABLE user ADD CONSTRAINT FK_8D93D649E899029B FOREIGN KEY IF NOT EXISTS (plan_id) REFERENCES plan (id)');
        $this->addSql('ALTER TABLE agent ADD CONSTRAINT FK_268B9C9DA76ED395 FOREIGN KEY IF NOT EXISTS (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE api_key ADD CONSTRAINT FK_C912ED9DA76ED395 FOREIGN KEY IF NOT EXISTS (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE conversation ADD CONSTRAINT FK_8A8E26E9A76ED395 FOREIGN KEY IF NOT EXISTS (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE conversation ADD CONSTRAINT FK_8A8E26E93414710B FOREIGN KEY IF NOT EXISTS (agent_id) REFERENCES agent (id)');
        $this->addSql('ALTER TABLE message ADD CONSTRAINT FK_B6BD307F9AC0396 FOREIGN KEY IF NOT EXISTS (conversation_id) REFERENCES conversation (id)');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE message DROP FOREIGN KEY FK_B6BD307F9AC0396');
        $this->addSql('ALTER TABLE conversation DROP FOREIGN KEY FK_8A8E26E93414710B');
        $this->addSql('ALTER TABLE conversation DROP FOREIGN KEY FK_8A8E26E9A76ED395');
        $this->addSql('ALTER TABLE api_key DROP FOREIGN KEY FK_C912ED9DA76ED395');
        $this->addSql('ALTER TABLE agent DROP FOREIGN KEY FK_268B9C9DA76ED395');
        $this->addSql('ALTER TABLE user DROP FOREIGN KEY FK_8D93D649E899029B');
        $this->addSql('DROP TABLE message');
        $this->addSql('DROP TABLE conversation');
        $this->addSql('DROP TABLE api_key');
        $this->addSql('DROP TABLE agent');
        $this->addSql('DROP TABLE user');
        $this->addSql('DROP TABLE plan');
    }
}
