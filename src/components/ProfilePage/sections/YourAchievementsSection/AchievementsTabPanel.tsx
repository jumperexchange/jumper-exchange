'use client';

import { type ReactNode, useState } from 'react';
import { BaseSurfaceSkeleton } from '@/components/core/skeletons/BaseSurfaceSkeleton/BaseSurfaceSkeleton.style';
import Pagination, {
  PaginationVariant,
} from '@/components/core/Pagination/Pagination';
import { NoDataPlaceholder } from '../../components/NoDataPlaceholder/NoDataPlaceholder';
import {
  AchievementsGrid,
  paginationSx,
} from './YourAchievementsSection.styles';

// 2 rows of 4 cards at the desktop content width.
const PAGE_SIZE = 8;

interface EmptyState {
  heroImage: string;
  description: string;
  caption: string;
  ctaText: string;
  ctaLink: string;
}

interface AchievementsTabPanelProps<T> {
  items: T[];
  isLoading: boolean;
  emptyState: EmptyState;
  renderItem: (item: T) => ReactNode;
}

// Shared shell for a single achievements tab: loading skeleton, empty
// placeholder, the paginated card grid. Each tab supplies its own data and
// card renderer, so adding a new tab is just another <AchievementsTabPanel>.
export const AchievementsTabPanel = <T,>({
  items,
  isLoading,
  emptyState,
  renderItem,
}: AchievementsTabPanelProps<T>) => {
  const [page, setPage] = useState(0);

  if (isLoading) {
    return (
      <BaseSurfaceSkeleton
        variant="rounded"
        sx={(theme) => ({ width: '100%', height: theme.spacing(36) })}
      />
    );
  }

  if (items.length === 0) {
    return (
      <NoDataPlaceholder
        heroImage={emptyState.heroImage}
        description={emptyState.description}
        caption={emptyState.caption}
        ctaText={emptyState.ctaText}
        ctaLink={emptyState.ctaLink}
      />
    );
  }

  const pageCount = Math.ceil(items.length / PAGE_SIZE);
  const pageStart = page * PAGE_SIZE;

  return (
    <>
      <AchievementsGrid>
        {items.slice(pageStart, pageStart + PAGE_SIZE).map(renderItem)}
      </AchievementsGrid>
      {pageCount > 1 && (
        <Pagination
          variant={PaginationVariant.AllPages}
          page={page}
          setPage={setPage}
          pagination={{
            page,
            pageSize: PAGE_SIZE,
            pageCount,
            total: items.length,
          }}
          sx={paginationSx}
        />
      )}
    </>
  );
};
