import { InfiniteScroll } from 'src/components/InfiniteScroll/InfiniteScroll';
import { usePerksInfinite } from 'src/hooks/perks/usePerksInfinite';
import { PerksDataAttributes } from 'src/types/strapi';
import { PerksListSkeleton } from './PerksListSkeleton';
import { PerksCard } from './PerksCard';
import { NoDataPlaceholder } from '../NoDataPlaceholder/NoDataPlaceholder';
import { useTranslation } from 'react-i18next';

interface PerksListProps {
  initialPerks: PerksDataAttributes[];
  shouldLoadMore: boolean;
}

export const PerksList = ({ initialPerks }: PerksListProps) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    usePerksInfinite(initialPerks);

  const { t } = useTranslation();

  const perks = data?.pages.flatMap((page) => page.data) || initialPerks;

  if (!perks.length) {
    const entityTranslation = t('profile_page.perks', 'Perks').toLowerCase();
    return (
      <NoDataPlaceholder
        imageUrl="/perks-empty-state.png"
        description={t('profile_page.noData.description', {
          entity: entityTranslation,
        })}
        caption={t('profile_page.noData.caption')}
        ctaText={t('profile_page.noData.cta')}
      />
    );
  }

  return (
    <InfiniteScroll
      isLoading={isFetchingNextPage}
      hasMore={hasNextPage}
      loadMore={fetchNextPage}
      loader={<PerksListSkeleton count={2} />}
      triggerMargin={400}
    >
      {perks.map((perk: any) => (
        <PerksCard key={perk.id} perk={perk} />
      ))}
    </InfiniteScroll>
  );
};
