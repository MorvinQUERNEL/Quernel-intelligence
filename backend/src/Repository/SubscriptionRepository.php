<?php

namespace App\Repository;

use App\Entity\Subscription;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Subscription>
 *
 * @method Subscription|null find($id, $lockMode = null, $lockVersion = null)
 * @method Subscription|null findOneBy(array $criteria, array $orderBy = null)
 * @method Subscription[]    findAll()
 * @method Subscription[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class SubscriptionRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Subscription::class);
    }

    /**
     * Find active subscription for a user
     */
    public function findActiveForUser(User $user): ?Subscription
    {
        return $this->createQueryBuilder('s')
            ->andWhere('s.user = :user')
            ->andWhere('s.status IN (:statuses)')
            ->setParameter('user', $user)
            ->setParameter('statuses', [
                Subscription::STATUS_ACTIVE,
                Subscription::STATUS_TRIALING,
            ])
            ->orderBy('s.createdAt', 'DESC')
            ->setMaxResults(1)
            ->getQuery()
            ->getOneOrNullResult();
    }

    /**
     * Find subscription by Stripe ID
     */
    public function findByStripeSubscriptionId(string $stripeSubscriptionId): ?Subscription
    {
        return $this->findOneBy(['stripeSubscriptionId' => $stripeSubscriptionId]);
    }

    /**
     * Find all subscriptions expiring soon
     */
    public function findExpiringSoon(int $daysAhead = 3): array
    {
        $now = new \DateTime();
        $future = (new \DateTime())->modify("+{$daysAhead} days");

        return $this->createQueryBuilder('s')
            ->andWhere('s.status IN (:statuses)')
            ->andWhere('s.currentPeriodEnd BETWEEN :now AND :future')
            ->setParameter('statuses', [Subscription::STATUS_ACTIVE])
            ->setParameter('now', $now)
            ->setParameter('future', $future)
            ->getQuery()
            ->getResult();
    }

    /**
     * Find subscriptions with past due status
     */
    public function findPastDue(): array
    {
        return $this->findBy(['status' => Subscription::STATUS_PAST_DUE]);
    }
}
