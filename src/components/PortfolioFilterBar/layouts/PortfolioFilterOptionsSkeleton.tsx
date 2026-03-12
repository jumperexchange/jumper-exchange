'use client';

import { BaseSurfaceSkeleton } from '@/components/core/skeletons/BaseSurfaceSkeleton/BaseSurfaceSkeleton.style';
import Stack from '@mui/material/Stack';

export const PortfolioFilterOptionsSkeleton = () => {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="flex-end"
      sx={(theme) => ({ gap: theme.spacing(2) })}
      data-testid="portfolio-filter-bar-skeleton"
    >
      <BaseSurfaceSkeleton
        variant="rounded"
        width={72}
        height={40}
        sx={(theme) => ({
          borderRadius: (theme.vars || theme).shape.buttonBorderRadius,
        })}
      />
    </Stack>
  );
};
