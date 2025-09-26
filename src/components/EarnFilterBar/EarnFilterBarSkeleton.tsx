import Stack from '@mui/material/Stack';
import { BaseSkeleton, EarnFilterBarContainer } from './EarnFilterBar.styles';

export const EarnFilterBarSkeleton = () => {
  return (
    <EarnFilterBarContainer sx={(theme) => ({ gap: theme.spacing(1) })}>
      <Stack direction="row" sx={(theme) => ({ gap: theme.spacing(1) })}>
        {Array.from({ length: 2 }).map((_, index) => (
          <BaseSkeleton key={index} variant="rounded" width={104} height={32} />
        ))}
      </Stack>
      <Stack
        direction="row"
        alignItems="center"
        sx={(theme) => ({ gap: theme.spacing(2) })}
      >
        {Array.from({ length: 5 }).map((_, index) => (
          <BaseSkeleton key={index} variant="rounded" width={56} height={32} />
        ))}
        <BaseSkeleton variant="circular" width={40} height={40} />
      </Stack>
    </EarnFilterBarContainer>
  );
};
