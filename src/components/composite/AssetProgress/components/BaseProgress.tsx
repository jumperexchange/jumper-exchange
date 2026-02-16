import type { FC, PropsWithChildren } from 'react';
import Typography from '@mui/material/Typography';
import { Percent } from '@/components/core/Percent/Percent';
import { PercentSize } from '@/components/core/Percent/Percent.types';
import { Tooltip } from '@/components/core/Tooltip/Tooltip';
import { toCompactValue, toFixedFractionDigits } from '@/utils/formatNumbers';
import { formatPortfolioValueInDollar } from '@/utils/numbers/portfolioValueInDollar';
import { ProgressContainer } from '../AssetProgress.styles';
import { THRESHOLD_MIN_AMOUNT } from '../constants';
import type { BaseAssetProgressProps } from '../types';

interface BaseProgressProps extends BaseAssetProgressProps, PropsWithChildren {}

export const BaseProgress: FC<BaseProgressProps> = ({
  progress,
  amount,
  children,
}) => {
  const isBelowThreshold = amount < THRESHOLD_MIN_AMOUNT;
  const formattedActualAmount = isBelowThreshold
    ? `$${toCompactValue(amount)}`
    : formatPortfolioValueInDollar(amount);
  const formattedAmount = isBelowThreshold
    ? `<$${THRESHOLD_MIN_AMOUNT}`
    : formattedActualAmount;
  const formattedProgress = `${toFixedFractionDigits(progress, 0, 2)}%`;

  return (
    <ProgressContainer>
      <Percent percent={progress} size={PercentSize.XXL}>
        {children}
      </Percent>
      <Tooltip
        title={isBelowThreshold ? formattedActualAmount : null}
        placement="bottom"
      >
        <Typography variant="bodyXLargeStrong">{formattedAmount}</Typography>
      </Tooltip>
      <Typography variant="bodyXSmall" color="textSecondary">
        {formattedProgress}
      </Typography>
    </ProgressContainer>
  );
};
