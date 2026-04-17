'use client';

import { BaseSurfaceSkeleton } from '@/components/core/skeletons/BaseSurfaceSkeleton/BaseSurfaceSkeleton.style';
import Stack from '@mui/material/Stack';

export const PortfolioFilterOptionsSkeleton = () => {
  return (
    <Stack
      direction="row"
      data-testid="portfolio-filter-bar-skeleton"
      sx={[
        {
          alignItems: 'center',
          justifyContent: 'flex-end',
        },
        (theme) => ({ gap: theme.spacing(2) }),
      ]}
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
