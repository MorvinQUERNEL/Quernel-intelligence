<?php

namespace App\Repository;

use App\Entity\ApiKey;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<ApiKey>
 */
class ApiKeyRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ApiKey::class);
    }

    public function findByUser(User $user): array
    {
        return $this->createQueryBuilder('a')
            ->andWhere('a.user = :user')
            ->andWhere('a.revokedAt IS NULL')
            ->setParameter('user', $user)
            ->orderBy('a.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }

    public function findByKeyPrefix(string $prefix): ?ApiKey
    {
        return $this->createQueryBuilder('a')
            ->andWhere('a.keyPrefix = :prefix')
            ->andWhere('a.revokedAt IS NULL')
            ->setParameter('prefix', $prefix)
            ->getQuery()
            ->getOneOrNullResult();
    }

    public function findValidByHash(string $keyHash): ?ApiKey
    {
        $apiKey = $this->createQueryBuilder('a')
            ->andWhere('a.keyHash = :hash')
            ->andWhere('a.revokedAt IS NULL')
            ->setParameter('hash', $keyHash)
            ->getQuery()
            ->getOneOrNullResult();

        if ($apiKey && $apiKey->isValid()) {
            return $apiKey;
        }

        return null;
    }
}
