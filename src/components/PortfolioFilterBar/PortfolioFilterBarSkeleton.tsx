import Stack from '@mui/material/Stack';
import { PortfolioFilterBarContainer } from './PortfolioFilterBar.styles';
import { BaseSurfaceSkeleton } from '../core/skeletons/BaseSurfaceSkeleton/BaseSurfaceSkeleton.style';

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
      </Stack>
      <Stack
        direction="row"
        alignItems="center"
        sx={(theme) => ({ gap: theme.spacing(2) })}
      >
        {Array.from({ length: 5 }).map((_, index) => (
          <BaseSurfaceSkeleton
            key={index}
            variant="rounded"
            width={56}
            height={32}
          />
        ))}
        <BaseSurfaceSkeleton variant="circular" width={40} height={40} />
      </Stack>
    </PortfolioFilterBarContainer>
  );
};
