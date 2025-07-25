import { useContext, useMemo, useEffect, useCallback, useState } from 'react';
import { InfiniteScroll } from 'src/components/InfiniteScroll/InfiniteScroll';
import { useLoyaltyPass } from 'src/hooks/useLoyaltyPass';
import { ProfileContext } from 'src/providers/ProfileProvider';
import { AchievementsListSkeleton } from './AchievementsListSkeleton';
import { AchievementsCard } from './AchievementsCard';
import { PDA } from 'src/types/loyaltyPass';

export const AchievementsList = () => {
  const { walletAddress, isLoading: isWalletLoading } =
    useContext(ProfileContext);
  // @TODO: does the backend support pagination? If not, we should implement it
  const { pdas, isLoading } = useLoyaltyPass(walletAddress);

  // Simulate pagination by truncating the existing data
  // @TODO: remove this once we have a proper pagination solution
  const [displayedPdas, setDisplayedPdas] = useState<PDA[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(
    isWalletLoading || isLoading,
  );
  const pageSize = 10;

  const totalPages = useMemo(() => {
    if (!pdas) return 0;
    return Math.ceil(pdas.length / pageSize);
  }, [pdas]);

  const hasNextPage = currentPage < totalPages;

  useEffect(() => {
    setIsFetchingNextPage(isWalletLoading || isLoading);
  }, [isWalletLoading, isLoading]);

  useEffect(() => {
    if (pdas && pdas.length > 0) {
      const initialPdas = pdas.slice(0, pageSize);
      setDisplayedPdas(initialPdas);
      setCurrentPage(1);
    }
  }, [pdas]);

  const fetchNextPage = useCallback(() => {
    if (pdas && hasNextPage) {
      setIsFetchingNextPage(true);
      const timeout = setTimeout(() => {
        const nextPdas = pdas.slice(0, (currentPage + 1) * pageSize);
        setDisplayedPdas(nextPdas);
        setCurrentPage((prev) => prev + 1);
        setIsFetchingNextPage(false);
      }, 250);

      return () => clearTimeout(timeout);
    }
  }, [pdas, currentPage, hasNextPage]);

  return (
    <InfiniteScroll
      isLoading={isFetchingNextPage}
      hasMore={hasNextPage}
      loadMore={fetchNextPage}
      loader={<AchievementsListSkeleton count={2} />}
      triggerMargin={400}
    >
      {displayedPdas.map((pda) => (
        <AchievementsCard key={pda.id} pda={pda} />
      ))}
    </InfiniteScroll>
  );
};
