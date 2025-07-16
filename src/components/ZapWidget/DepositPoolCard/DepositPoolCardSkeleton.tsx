import {
  DepositPoolCardContainer,
  DepositPoolHeaderContainer,
  BaseSkeleton,
} from './DepositPoolCard.style';
import Grid from '@mui/material/Grid';

export const DepositPoolCardSkeleton = () => {
  return (
    <DepositPoolCardContainer>
      <DepositPoolHeaderContainer>
        <BaseSkeleton variant="circular" sx={{ height: 40, width: 40 }} />
        <BaseSkeleton variant="rounded" sx={{ height: 32, width: '100%' }} />
      </DepositPoolHeaderContainer>
      <Grid container rowSpacing={3} columnSpacing={2}>
        {Array.from({ length: 4 }).map((_, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6 }}>
            <BaseSkeleton
              variant="rounded"
              sx={{ height: 16, width: '100%' }}
            />
            <BaseSkeleton
              variant="rounded"
              sx={{ height: 32, width: '75%', marginTop: 0.5 }}
            />
          </Grid>
        ))}
      </Grid>
    </DepositPoolCardContainer>
  );
};
