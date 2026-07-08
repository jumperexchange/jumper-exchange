'use client';

import { Fragment, type ReactNode, useEffect, useState } from 'react';
import Pagination, {
  PaginationVariant,
} from '@/components/core/Pagination/Pagination';
import { NoDataPlaceholder } from '../../components/NoDataPlaceholder/NoDataPlaceholder';
import { AchievementCardSkeleton } from './AchievementCardSkeleton';
import {
  AchievementsGrid,
  paginationSx,
} from './YourAchievementsSection.styles';
import { useMediaQuery } from '@mui/material';

// 2 rows of 4 cards at the desktop content width.
const PAGE_SIZE = 8;

// One row of placeholder cards while data loads.
const SKELETON_COUNT = 4;

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
  // Per-card loading placeholder. Defaults to the achievement tile skeleton;
  // other grids (e.g. perks) pass a skeleton matching their own card.
  skeleton?: ReactNode;
}

// Shared shell for a single achievements tab: loading skeleton, empty
// placeholder, the paginated card grid. Each tab supplies its own data and
// card renderer, so adding a new tab is just another <AchievementsTabPanel>.
export const AchievementsTabPanel = <T,>({
  items,
  isLoading,
  emptyState,
  renderItem,
  skeleton = <AchievementCardSkeleton />,
}: AchievementsTabPanelProps<T>) => {
  const [page, setPage] = useState(0);
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));

  useEffect(() => {
    setPage(0);
  }, [items]);

  if (isLoading) {
    return (
      <AchievementsGrid>
        {Array.from({ length: SKELETON_COUNT }, (_, i) => (
          <Fragment key={i}>{skeleton}</Fragment>
        ))}
      </AchievementsGrid>
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
          variant={PaginationVariant.WindowedPages}
          maxVisiblePages={isMobile ? 1 : 3}
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
