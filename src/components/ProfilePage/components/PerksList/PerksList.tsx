import { InfiniteScroll } from 'src/components/InfiniteScroll/InfiniteScroll';
import { usePerksInfinite } from 'src/hooks/perks/usePerksInfinite';
import { PerksDataAttributes } from 'src/types/strapi';
import { PerksListSkeleton } from './PerksListSkeleton';
import { PerksCard } from './PerksCard';

interface PerksListProps {
  initialPerks: PerksDataAttributes[];
  shouldLoadMore: boolean;
}

export const PerksList = ({ initialPerks }: PerksListProps) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    usePerksInfinite(initialPerks);

  const perks = data?.pages.flatMap((page) => page.data) || initialPerks;

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
