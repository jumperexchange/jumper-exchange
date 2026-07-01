import type { FC } from 'react';
import type { EarnCardProps } from '../EarnCard.types';
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
import { useFormatDisplayEarnOpportunityData } from '@/hooks/earn/useFormatDisplayEarnOpportunityData';
import { ApyWindowOptions } from '@/utils/earn/apyWindow';

export const OverviewEarnCard: FC<Omit<EarnCardProps, 'variant'>> = ({
  data,
  isLoading,
  fullWidth,
  headerBadge,
  apyWindow,
  setApyWindow,
}) => {
  const isEmpty = !data || isLoading;
  const { t } = useTranslation();

  const hasApyWindow = apyWindow && setApyWindow;

  const onToggleApyWindow = () => {
    if (!setApyWindow || !apyWindow) {
      return;
    }
    setApyWindow(
      apyWindow === ApyWindowOptions.SEVEN_DAY
        ? ApyWindowOptions.THIRTY_DAY
        : ApyWindowOptions.SEVEN_DAY,
    );
  };

  const { overviewItems } = useFormatDisplayEarnOpportunityData(
    data,
    'overview',
    hasApyWindow ? { apyWindow, onToggleApyWindow } : undefined,
  );

  const items = overviewItems.map((item, index) => {
    const shouldExpand =
      index === overviewItems.length - 1 && overviewItems.length % 2 !== 0;
    return (
      <OverviewEarnCardItem
        dataTestId={item.dataTestId}
        key={item.key}
        title={item.label}
        value={item.value}
        valuePrepend={item.valuePrepend}
        tooltip={item.tooltip}
        shouldExpand={shouldExpand}
        onClick={item.onClick}
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
