<?php

namespace App\Repository;

use App\Entity\Conversation;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Conversation>
 */
class ConversationRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Conversation::class);
    }

    public function findByUser(User $user, int $limit = 50): array
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.user = :user')
            ->andWhere('c.archivedAt IS NULL')
            ->setParameter('user', $user)
            ->orderBy('c.updatedAt', 'DESC')
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }

    public function countTokensThisMonth(User $user): int
    {
        $startOfMonth = new \DateTime('first day of this month midnight');

        $result = $this->createQueryBuilder('c')
            ->select('SUM(c.totalTokens)')
            ->andWhere('c.user = :user')
            ->andWhere('c.createdAt >= :start')
            ->setParameter('user', $user)
            ->setParameter('start', $startOfMonth)
            ->getQuery()
            ->getSingleScalarResult();

        return (int) ($result ?? 0);
    }
}
