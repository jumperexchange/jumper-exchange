import Grid from '@mui/material/Grid';
import { EarnCard } from 'src/components/Cards/EarnCard/EarnCard';
import { EarnCardVariant } from 'src/components/Cards/EarnCard/EarnCard.types';
import { AtLeastNWhenLoading } from 'src/components/Cards/EarnCard/variants/shared';
import { EarnOpportunityWithLatestAnalytics } from 'src/types/jumper-backend';

export const EarnOpportunitiesCards = ({
  items,
  isLoading,
  variant,
}: {
  items: EarnOpportunityWithLatestAnalytics[];
  isLoading: boolean;
  variant: EarnCardVariant;
}) => {
  const gridItems = AtLeastNWhenLoading(items, isLoading, 3, Infinity);

  const gridSize = variant === 'compact' ? { xs: 12, sm: 4 } : { xs: 12 };

  return (
    <Grid container spacing={2}>
      {gridItems.map((item, index) => (
        <Grid key={item?.slug || index} size={gridSize}>
          {item == null ? (
            <EarnCard variant={variant} isLoading={true} data={null} />
          ) : (
            <EarnCard variant={variant} isLoading={false} data={item} />
          )}
        </Grid>
      ))}
    </Grid>
  );
};
