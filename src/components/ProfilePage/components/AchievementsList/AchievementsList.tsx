import { useContext } from 'react';
import { InfiniteScroll } from 'src/components/InfiniteScroll/InfiniteScroll';
import { ProfileContext } from 'src/providers/ProfileProvider';
import { AchievementsListSkeleton } from './AchievementsListSkeleton';
import { AchievementsCard } from './AchievementsCard';
import { useAchievementsInfinite } from 'src/hooks/achievements/useAchievementsInfinite';
import { NoDataPlaceholder } from '../NoDataPlaceholder/NoDataPlaceholder';
import { useTranslation } from 'react-i18next';

export const AchievementsList = () => {
  const { walletAddress, isLoading: isWalletLoading } =
    useContext(ProfileContext);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useAchievementsInfinite(walletAddress);

  const { t } = useTranslation();

  const pdas = data?.pages.flatMap((page) => page.data) || [];

  if (!pdas.length) {
    const entityTranslation = t(
      'profile_page.achievements',
      'Achievements',
    ).toLowerCase();
    return (
      <NoDataPlaceholder
        description={t('profile_page.noData.description', {
          entity: entityTranslation,
        })}
        caption={t('profile_page.noData.caption', {
          entity: entityTranslation,
        })}
      />
    );
  }

  return (
    <InfiniteScroll
      isLoading={isFetchingNextPage || isWalletLoading}
      hasMore={hasNextPage}
      loadMore={fetchNextPage}
      loader={<AchievementsListSkeleton count={2} />}
      triggerMargin={400}
    >
      {pdas.map((pda) => (
        <AchievementsCard key={pda.id} pda={pda} />
      ))}
    </InfiniteScroll>
  );
};
