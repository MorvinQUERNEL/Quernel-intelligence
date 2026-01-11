<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260111215857 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE agent (id UUID NOT NULL, name VARCHAR(100) NOT NULL, description TEXT DEFAULT NULL, avatar_url VARCHAR(500) DEFAULT NULL, system_prompt TEXT NOT NULL, model VARCHAR(100) NOT NULL, temperature NUMERIC(3, 2) NOT NULL, max_tokens INT NOT NULL, is_public BOOLEAN NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, user_id UUID NOT NULL, PRIMARY KEY (id))');
        $this->addSql('CREATE INDEX IDX_268B9C9DA76ED395 ON agent (user_id)');
        $this->addSql('CREATE TABLE api_key (id UUID NOT NULL, name VARCHAR(100) NOT NULL, key_hash VARCHAR(255) NOT NULL, key_prefix VARCHAR(12) NOT NULL, scopes TEXT DEFAULT NULL, rate_limit_per_minute INT NOT NULL, last_used_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, total_requests INT NOT NULL, expires_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, revoked_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, user_id UUID NOT NULL, PRIMARY KEY (id))');
        $this->addSql('CREATE INDEX IDX_C912ED9DA76ED395 ON api_key (user_id)');
        $this->addSql('CREATE TABLE conversation (id UUID NOT NULL, title VARCHAR(255) DEFAULT NULL, message_count INT NOT NULL, total_tokens INT NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, archived_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, user_id UUID NOT NULL, agent_id UUID DEFAULT NULL, PRIMARY KEY (id))');
        $this->addSql('CREATE INDEX IDX_8A8E26E9A76ED395 ON conversation (user_id)');
        $this->addSql('CREATE INDEX IDX_8A8E26E93414710B ON conversation (agent_id)');
        $this->addSql('CREATE TABLE message (id UUID NOT NULL, role VARCHAR(20) NOT NULL, content TEXT NOT NULL, prompt_tokens INT NOT NULL, completion_tokens INT NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, conversation_id UUID NOT NULL, PRIMARY KEY (id))');
        $this->addSql('CREATE INDEX IDX_B6BD307F9AC0396 ON message (conversation_id)');
        $this->addSql('CREATE TABLE plan (id UUID NOT NULL, name VARCHAR(100) NOT NULL, slug VARCHAR(50) NOT NULL, monthly_tokens INT NOT NULL, max_agents INT NOT NULL, max_documents INT NOT NULL, max_team_members INT NOT NULL, has_api_access BOOLEAN NOT NULL, has_workflows BOOLEAN NOT NULL, has_priority_support BOOLEAN NOT NULL, price_monthly NUMERIC(10, 2) DEFAULT NULL, price_yearly NUMERIC(10, 2) DEFAULT NULL, stripe_price_id_monthly VARCHAR(255) DEFAULT NULL, stripe_price_id_yearly VARCHAR(255) DEFAULT NULL, is_active BOOLEAN NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY (id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_DD5A5B7D989D9B62 ON plan (slug)');
        $this->addSql('CREATE TABLE "user" (id UUID NOT NULL, email VARCHAR(180) NOT NULL, roles JSON NOT NULL, password VARCHAR(255) NOT NULL, first_name VARCHAR(100) DEFAULT NULL, last_name VARCHAR(100) DEFAULT NULL, avatar_url VARCHAR(500) DEFAULT NULL, email_verified_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, is_active BOOLEAN NOT NULL, plan_started_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, plan_expires_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, stripe_customer_id VARCHAR(255) DEFAULT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, last_login_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, plan_id UUID DEFAULT NULL, PRIMARY KEY (id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_8D93D649E7927C74 ON "user" (email)');
        $this->addSql('CREATE INDEX IDX_8D93D649E899029B ON "user" (plan_id)');
        $this->addSql('ALTER TABLE agent ADD CONSTRAINT FK_268B9C9DA76ED395 FOREIGN KEY (user_id) REFERENCES "user" (id) NOT DEFERRABLE');
        $this->addSql('ALTER TABLE api_key ADD CONSTRAINT FK_C912ED9DA76ED395 FOREIGN KEY (user_id) REFERENCES "user" (id) NOT DEFERRABLE');
        $this->addSql('ALTER TABLE conversation ADD CONSTRAINT FK_8A8E26E9A76ED395 FOREIGN KEY (user_id) REFERENCES "user" (id) NOT DEFERRABLE');
        $this->addSql('ALTER TABLE conversation ADD CONSTRAINT FK_8A8E26E93414710B FOREIGN KEY (agent_id) REFERENCES agent (id)');
        $this->addSql('ALTER TABLE message ADD CONSTRAINT FK_B6BD307F9AC0396 FOREIGN KEY (conversation_id) REFERENCES conversation (id) NOT DEFERRABLE');
        $this->addSql('ALTER TABLE "user" ADD CONSTRAINT FK_8D93D649E899029B FOREIGN KEY (plan_id) REFERENCES plan (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE agent DROP CONSTRAINT FK_268B9C9DA76ED395');
        $this->addSql('ALTER TABLE api_key DROP CONSTRAINT FK_C912ED9DA76ED395');
        $this->addSql('ALTER TABLE conversation DROP CONSTRAINT FK_8A8E26E9A76ED395');
        $this->addSql('ALTER TABLE conversation DROP CONSTRAINT FK_8A8E26E93414710B');
        $this->addSql('ALTER TABLE message DROP CONSTRAINT FK_B6BD307F9AC0396');
        $this->addSql('ALTER TABLE "user" DROP CONSTRAINT FK_8D93D649E899029B');
        $this->addSql('DROP TABLE agent');
        $this->addSql('DROP TABLE api_key');
        $this->addSql('DROP TABLE conversation');
        $this->addSql('DROP TABLE message');
        $this->addSql('DROP TABLE plan');
        $this->addSql('DROP TABLE "user"');
    }
}
