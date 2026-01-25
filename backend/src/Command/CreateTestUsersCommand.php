<?php

namespace App\Command;

use App\Entity\Plan;
use App\Entity\User;
use App\Entity\Agent;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[AsCommand(
    name: 'app:create-test-users',
    description: 'Create test users (admin and user) if they do not exist',
)]
class CreateTestUsersCommand extends Command
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly UserPasswordHasherInterface $passwordHasher,
    ) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        // Ensure plans exist
        $this->ensurePlansExist($io);

        // Get plans
        $freePlan = $this->entityManager->getRepository(Plan::class)->findOneBy(['slug' => 'free']);
        $proPlan = $this->entityManager->getRepository(Plan::class)->findOneBy(['slug' => 'pro']);

        if (!$freePlan || !$proPlan) {
            $io->error('Plans not found. Please run migrations first.');
            return Command::FAILURE;
        }

        $usersCreated = 0;

        // Create Admin
        $adminEmail = 'admin@quernel-intelligence.com';
        $existingAdmin = $this->entityManager->getRepository(User::class)->findOneBy(['email' => $adminEmail]);

        if (!$existingAdmin) {
            $admin = new User();
            $admin->setEmail($adminEmail);
            $admin->setFirstName('Admin');
            $admin->setLastName('Quernel');
            $admin->setRoles(['ROLE_ADMIN', 'ROLE_USER']);
            $admin->setEmailVerifiedAt(new \DateTime());
            $admin->setPlan($proPlan);
            $admin->setIsActive(true);
            $admin->setPassword($this->passwordHasher->hashPassword($admin, 'admin123'));

            $this->entityManager->persist($admin);
            $io->success("Admin user created: $adminEmail / admin123");
            $usersCreated++;

            // Create default agents for admin
            $this->createDefaultAgents($admin);
        } else {
            $io->note("Admin user already exists: $adminEmail");
        }

        // Create Test User
        $userEmail = 'user@test.com';
        $existingUser = $this->entityManager->getRepository(User::class)->findOneBy(['email' => $userEmail]);

        if (!$existingUser) {
            $user = new User();
            $user->setEmail($userEmail);
            $user->setFirstName('Test');
            $user->setLastName('User');
            $user->setRoles(['ROLE_USER']);
            $user->setEmailVerifiedAt(new \DateTime());
            $user->setPlan($freePlan);
            $user->setIsActive(true);
            $user->setPassword($this->passwordHasher->hashPassword($user, 'user123'));

            $this->entityManager->persist($user);
            $io->success("Test user created: $userEmail / user123");
            $usersCreated++;
        } else {
            $io->note("Test user already exists: $userEmail");
        }

        $this->entityManager->flush();

        if ($usersCreated > 0) {
            $io->success("$usersCreated user(s) created successfully!");
        } else {
            $io->info('All test users already exist.');
        }

        return Command::SUCCESS;
    }

    private function ensurePlansExist(SymfonyStyle $io): void
    {
        $plansData = [
            'free' => [
                'name' => 'Essai Gratuit',
                'slug' => 'free',
                'priceMonthly' => '0',
                'priceYearly' => '0',
                'monthlyTokens' => 100000,
                'maxAgents' => 3,
                'maxDocuments' => 10,
                'maxTeamMembers' => 1,
                'hasApiAccess' => false,
                'hasWorkflows' => false,
                'hasPrioritySupport' => false,
            ],
            'pro' => [
                'name' => 'Pro',
                'slug' => 'pro',
                'priceMonthly' => '50',
                'priceYearly' => '480',
                'monthlyTokens' => 2000000,
                'maxAgents' => 3,
                'maxDocuments' => 100,
                'maxTeamMembers' => 5,
                'hasApiAccess' => true,
                'hasWorkflows' => true,
                'hasPrioritySupport' => true,
            ],
        ];

        foreach ($plansData as $key => $data) {
            $existingPlan = $this->entityManager->getRepository(Plan::class)->findOneBy(['slug' => $data['slug']]);

            if (!$existingPlan) {
                $plan = new Plan();
                $plan->setName($data['name']);
                $plan->setSlug($data['slug']);
                $plan->setPriceMonthly($data['priceMonthly']);
                $plan->setPriceYearly($data['priceYearly']);
                $plan->setMonthlyTokens($data['monthlyTokens']);
                $plan->setMaxAgents($data['maxAgents']);
                $plan->setMaxDocuments($data['maxDocuments']);
                $plan->setMaxTeamMembers($data['maxTeamMembers']);
                $plan->setHasApiAccess($data['hasApiAccess']);
                $plan->setHasWorkflows($data['hasWorkflows']);
                $plan->setHasPrioritySupport($data['hasPrioritySupport']);
                $plan->setIsActive(true);

                $this->entityManager->persist($plan);
                $io->note("Plan created: {$data['name']}");
            }
        }

        $this->entityManager->flush();
    }

    private function createDefaultAgents(User $owner): void
    {
        $agentsData = [
            [
                'name' => 'Raphael',
                'description' => 'Ange guerisseur - Assistant polyvalent pour l\'organisation, la redaction et la productivite.',
                'systemPrompt' => 'Tu es Raphael, l\'ange guerisseur de QUERNEL INTELLIGENCE. Tu es un assistant polyvalent qui aide sur tous les sujets : organisation, redaction, productivite, brainstorming. Tu travailles en synergie avec Gabriel (Marketing) et Michael (Commercial). Tu reponds en francais de maniere claire et bienveillante.',
                'model' => 'hermes-3-llama-8b',
                'isPublic' => true,
            ],
            [
                'name' => 'Gabriel',
                'description' => 'Ange messager - Expert en strategies marketing, SEO, contenu et communication digitale.',
                'systemPrompt' => 'Tu es Gabriel, l\'ange messager de QUERNEL INTELLIGENCE. Tu es l\'expert marketing et communication qui aide les entreprises. Specialites : SEO, contenu, publicite, analyse de performances. Tu travailles en synergie avec Raphael (General) et Michael (Commercial). Tu reponds en francais avec des conseils actionnables et des exemples concrets.',
                'model' => 'hermes-3-llama-8b',
                'isPublic' => true,
            ],
            [
                'name' => 'Michael',
                'description' => 'Ange protecteur - Expert en vente, prospection, negociation et developpement commercial.',
                'systemPrompt' => 'Tu es Michael, l\'ange protecteur de QUERNEL INTELLIGENCE. Tu es l\'expert commercial et vente qui aide les entreprises. Specialites : prospection, negociation, closing, pipeline. Tu travailles en synergie avec Raphael (General) et Gabriel (Marketing). Tu reponds en francais avec energie et des conseils terrain concrets.',
                'model' => 'hermes-3-llama-8b',
                'isPublic' => true,
            ],
        ];

        foreach ($agentsData as $data) {
            $agent = new Agent();
            $agent->setName($data['name']);
            $agent->setDescription($data['description']);
            $agent->setSystemPrompt($data['systemPrompt']);
            $agent->setModel($data['model']);
            $agent->setIsPublic($data['isPublic']);
            $agent->setUser($owner);

            $this->entityManager->persist($agent);
        }
    }
}
