<?php

namespace App\Repository;

use App\Entity\Agent;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Agent>
 */
class AgentRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Agent::class);
    }

    public function findByUser(User $user): array
    {
        return $this->createQueryBuilder('a')
            ->andWhere('a.user = :user')
            ->setParameter('user', $user)
            ->orderBy('a.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }

    public function findPublicAgents(): array
    {
        return $this->createQueryBuilder('a')
            ->andWhere('a.isPublic = :public')
            ->setParameter('public', true)
            ->orderBy('a.name', 'ASC')
            ->getQuery()
            ->getResult();
    }
}
