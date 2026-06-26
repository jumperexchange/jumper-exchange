'use client';

import Stack from '@mui/material/Stack';
import { BaseSkeleton } from './MarketPriceSection.styles';

export const MarketPriceSectionSkeleton = () => {
  return (
    <Stack sx={{ gap: 2 }}>
      <BaseSkeleton variant="rounded" sx={{ height: 120, width: '100%' }} />
      <Stack direction="row" sx={{ gap: 2 }}>
        <BaseSkeleton variant="rounded" sx={{ height: 16, flex: 1 }} />
        <BaseSkeleton variant="rounded" sx={{ height: 16, flex: 1 }} />
      </Stack>
    </Stack>
  );
};
