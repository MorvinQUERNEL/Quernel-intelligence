<?php

namespace App\DataFixtures;

use App\Entity\Agent;
use App\Entity\Plan;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AppFixtures extends Fixture
{
    public function __construct(
        private UserPasswordHasherInterface $passwordHasher
    ) {}

    public function load(ObjectManager $manager): void
    {
        // Create Plans
        $plans = $this->createPlans($manager);

        // Create Admin User
        $admin = $this->createAdmin($manager, $plans['pro']);

        // Create Test User
        $testUser = $this->createTestUser($manager, $plans['free']);

        // Create Default Agents (Les 3 Anges)
        $this->createDefaultAgents($manager, $admin);

        $manager->flush();
    }

    private function createPlans(ObjectManager $manager): array
    {
        // Architecture v7: 2 plans - Essai gratuit + Pro a 50eur/mois
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

        $plans = [];
        foreach ($plansData as $key => $data) {
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

            $manager->persist($plan);
            $plans[$key] = $plan;
        }

        return $plans;
    }

    private function createAdmin(ObjectManager $manager, Plan $plan): User
    {
        $admin = new User();
        $admin->setEmail('admin@quernel-intelligence.com');
        $admin->setFirstName('Admin');
        $admin->setLastName('Quernel');
        $admin->setRoles(['ROLE_ADMIN', 'ROLE_USER']);
        $admin->setEmailVerifiedAt(new \DateTime());
        $admin->setPlan($plan);
        $admin->setIsActive(true);

        $hashedPassword = $this->passwordHasher->hashPassword($admin, 'admin123');
        $admin->setPassword($hashedPassword);

        $manager->persist($admin);

        return $admin;
    }

    private function createTestUser(ObjectManager $manager, Plan $plan): User
    {
        $user = new User();
        $user->setEmail('user@test.com');
        $user->setFirstName('Test');
        $user->setLastName('User');
        $user->setRoles(['ROLE_USER']);
        $user->setEmailVerifiedAt(new \DateTime());
        $user->setPlan($plan);
        $user->setIsActive(true);

        $hashedPassword = $this->passwordHasher->hashPassword($user, 'user123');
        $user->setPassword($hashedPassword);

        $manager->persist($user);

        return $user;
    }

    private function createDefaultAgents(ObjectManager $manager, User $owner): void
    {
        // Les 3 Anges de QUERNEL INTELLIGENCE v7
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

            $manager->persist($agent);
        }
    }
}
