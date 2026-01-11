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

        // Create Default Agents
        $this->createDefaultAgents($manager, $admin);

        $manager->flush();
    }

    private function createPlans(ObjectManager $manager): array
    {
        $plansData = [
            'free' => [
                'name' => 'Gratuit',
                'slug' => 'free',
                'priceMonthly' => '0',
                'priceYearly' => '0',
                'monthlyTokens' => 50000,
                'maxAgents' => 1,
                'maxDocuments' => 5,
                'maxTeamMembers' => 1,
                'hasApiAccess' => false,
                'hasWorkflows' => false,
                'hasPrioritySupport' => false,
            ],
            'pro' => [
                'name' => 'Pro',
                'slug' => 'pro',
                'priceMonthly' => '29',
                'priceYearly' => '290',
                'monthlyTokens' => 500000,
                'maxAgents' => 5,
                'maxDocuments' => 50,
                'maxTeamMembers' => 5,
                'hasApiAccess' => true,
                'hasWorkflows' => true,
                'hasPrioritySupport' => false,
            ],
            'business' => [
                'name' => 'Business',
                'slug' => 'business',
                'priceMonthly' => '99',
                'priceYearly' => '990',
                'monthlyTokens' => 2000000,
                'maxAgents' => 20,
                'maxDocuments' => 200,
                'maxTeamMembers' => 20,
                'hasApiAccess' => true,
                'hasWorkflows' => true,
                'hasPrioritySupport' => true,
            ],
            'enterprise' => [
                'name' => 'Enterprise',
                'slug' => 'enterprise',
                'priceMonthly' => null,
                'priceYearly' => null,
                'monthlyTokens' => 10000000,
                'maxAgents' => 100,
                'maxDocuments' => 1000,
                'maxTeamMembers' => 100,
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
        $agentsData = [
            [
                'name' => 'Assistant General',
                'description' => 'Un assistant polyvalent pour repondre a toutes vos questions.',
                'systemPrompt' => 'Tu es un assistant IA professionnel et bienveillant. Tu aides les utilisateurs avec leurs questions de maniere claire et precise. Tu reponds toujours en francais sauf si on te demande explicitement une autre langue.',
                'model' => 'Qwen/Qwen2.5-32B-Instruct-AWQ',
                'isPublic' => true,
            ],
            [
                'name' => 'Expert Code',
                'description' => 'Specialise dans le developpement logiciel et le debugging.',
                'systemPrompt' => 'Tu es un expert en developpement logiciel. Tu aides les utilisateurs a ecrire, debugger et optimiser leur code. Tu expliques les concepts techniques de maniere accessible. Tu fournis des exemples de code bien commentes.',
                'model' => 'Qwen/Qwen2.5-32B-Instruct-AWQ',
                'isPublic' => true,
            ],
            [
                'name' => 'Redacteur Business',
                'description' => 'Aide a la redaction de documents professionnels.',
                'systemPrompt' => 'Tu es un expert en communication d\'entreprise. Tu aides a rediger des emails professionnels, des rapports, des presentations et autres documents business. Tu adoptes un ton professionnel et adapte au contexte francais.',
                'model' => 'Qwen/Qwen2.5-32B-Instruct-AWQ',
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
