import Stack from '@mui/material/Stack';
import { BaseSurfaceSkeleton } from '@/components/core/skeletons/BaseSurfaceSkeleton/BaseSurfaceSkeleton.style';

export const PortfolioHoldingsSectionHeaderSkeleton = () => (
  <Stack
    direction="row"
    sx={{ width: '100%', justifyContent: 'space-between', gap: 2 }}
  >
    <Stack direction="row" sx={{ gap: 2 }}>
      <BaseSurfaceSkeleton variant="rounded" sx={{ width: 64, height: 24 }} />
      <BaseSurfaceSkeleton variant="rounded" sx={{ width: 36, height: 24 }} />
    </Stack>
    <BaseSurfaceSkeleton
      variant="rounded"
      sx={{ width: 64, height: 24, mr: 1 }}
    />
  </Stack>
);
