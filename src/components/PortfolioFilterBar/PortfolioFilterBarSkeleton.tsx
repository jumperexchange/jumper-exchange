'use client';

import Stack from '@mui/material/Stack';
import { PortfolioFilterBarContainer } from './PortfolioFilterBar.styles';
import { BaseSurfaceSkeleton } from '@/components/core/skeletons/BaseSurfaceSkeleton/BaseSurfaceSkeleton.style';
import { PortfolioFilterOptionsSkeleton } from './layouts/PortfolioFilterOptionsSkeleton';

export const PortfolioFilterBarSkeleton = () => {
  return (
    <PortfolioFilterBarContainer>
      <Stack direction="row" sx={(theme) => ({ gap: theme.spacing(1) })}>
        {Array.from({ length: 2 }).map((_, index) => (
          <BaseSurfaceSkeleton
            key={index}
            variant="rounded"
            width={104}
            height={32}
          />
        ))}
        <PortfolioFilterOptionsSkeleton />
      </Stack>
    </PortfolioFilterBarContainer>
  );
};
