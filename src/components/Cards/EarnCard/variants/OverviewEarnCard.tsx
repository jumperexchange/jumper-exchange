import { FC } from 'react';
import { EarnCardProps } from '../EarnCard.types';
import {
  OverviewEarnCardContainer,
  OverviewEarnCardContentContainer,
  OverviewEarnCardHeaderContainer,
} from '../EarnCard.styles';
import { OverviewEarnCardItem } from './OverviewEarnCardItem';
import { useTranslation } from 'react-i18next';
import { chunk } from 'lodash';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { OverviewEarnSkeleton } from './OverviewEarnSkeleton';
import { useFormatDisplayEarnOpportunityData } from 'src/hooks/earn/useFormatDisplayEarnOpportunityData';

export const OverviewEarnCard: FC<Omit<EarnCardProps, 'variant'>> = ({
  data,
  isLoading,
  fullWidth,
  headerBadge,
}) => {
  const isEmpty = !data || isLoading;
  const { t } = useTranslation();

  const { overviewItems } = useFormatDisplayEarnOpportunityData(
    data,
    'overview',
  );

  const items = overviewItems.map((item, index) => {
    const shouldExpand =
      index === overviewItems.length - 1 && overviewItems.length % 2 !== 0;
    return (
      <OverviewEarnCardItem
        key={item.key}
        title={item.label}
        value={item.value}
        valuePrepend={item.valuePrepend}
        tooltip={item.tooltip}
        shouldExpand={shouldExpand}
      />
    );
  });

  if (isEmpty) {
    return <OverviewEarnSkeleton />;
  }

  return (
    <OverviewEarnCardContainer sx={{ maxWidth: fullWidth ? '100%' : 408 }}>
      <OverviewEarnCardContentContainer>
        <OverviewEarnCardHeaderContainer>
          <Typography variant="titleXSmall">{t('labels.overview')}</Typography>
          {headerBadge}
        </OverviewEarnCardHeaderContainer>
        {chunk(items, 2).map((itemsChunk, index) => (
          <Grid container rowSpacing={3} columnSpacing={2} key={index}>
            {itemsChunk}
          </Grid>
        ))}
      </OverviewEarnCardContentContainer>
    </OverviewEarnCardContainer>
  );
};
