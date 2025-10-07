import { Grid } from '@mui/material';
import Stack from '@mui/material/Stack';
import { CompactEarnCardSkeleton } from 'src/components/Cards/EarnCard/variants/CompactEarnCardSkeleton';
import { SectionCardContainer } from 'src/components/Cards/SectionCard/SectionCard.style';
import { EarnFilterBarSkeleton } from 'src/components/EarnFilterBar/EarnFilterBarSkeleton';

export const EarnOpportunitiesAllSkeleton = () => {
  return (
    <SectionCardContainer>
      <Stack direction="column" gap={3}>
        <EarnFilterBarSkeleton />
        <Grid container spacing={2}>
          {Array.from({ length: 3 }).map((_, index) => (
            <Grid key={index} size={{ xs: 12, sm: 4 }}>
              <CompactEarnCardSkeleton />
            </Grid>
          ))}
        </Grid>
      </Stack>
    </SectionCardContainer>
  );
};
