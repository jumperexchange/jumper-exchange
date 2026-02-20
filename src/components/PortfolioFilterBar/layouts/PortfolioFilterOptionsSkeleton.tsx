'use client';

import { BaseSurfaceSkeleton } from '@/components/core/skeletons/BaseSurfaceSkeleton/BaseSurfaceSkeleton.style';
import Stack from '@mui/material/Stack';
import useMediaQuery from '@mui/material/useMediaQuery';

export const PortfolioFilterOptionsSkeleton = () => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  return (
    <Stack
      direction="row"
      alignItems="center"
      sx={(theme) => ({ gap: theme.spacing(2) })}
      data-testid="portfolio-filter-bar-skeleton"
    >
      {!isMobile &&
        Array.from({ length: 5 }).map((_, index) => (
          <BaseSurfaceSkeleton
            key={index}
            variant="rounded"
            width={56}
            height={32}
          />
        ))}
      <BaseSurfaceSkeleton
        variant="circular"
        width={40}
        height={40}
        sx={{ marginLeft: 'auto' }}
      />
    </Stack>
  );
};
