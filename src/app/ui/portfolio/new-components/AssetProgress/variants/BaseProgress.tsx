import type { FC, PropsWithChildren } from 'react';
import type { BaseAssetProgressProps } from '../AssetProgress.types';
import { BaseProgressContainer } from '../AssetProgress.styles';
import { Percent } from '@/components/core/Percent/Percent';
import { PercentSize } from '@/components/core/Percent/Percent.types';
import Typography from '@mui/material/Typography';
import { toCompactValue, toFixedFractionDigits } from '@/utils/formatNumbers';
import { THRESHOLD_MIN_AMOUNT } from '../constants';
import { Tooltip } from '@/components/core/Tooltip/Tooltip';
import { formatPortfolioValueInDollar } from '@/utils/numbers/portfolioValueInDollar';

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
    <BaseProgressContainer>
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
    </BaseProgressContainer>
  );
};
