import { FC, PropsWithChildren } from 'react';
import { BaseAssetProgressProps } from '../AssetProgress.types';
import { BaseProgressContainer } from '../AssetProgress.styles';
import { Percent } from 'src/components/core/Percent/Percent';
import { PercentSize } from 'src/components/core/Percent/Percent.types';
import Typography from '@mui/material/Typography';
import { toCompactValue, toFixedFractionDigits } from 'src/utils/formatNumbers';
import { THRESHOLD_MIN_AMOUNT } from '../constants';
import { Tooltip } from 'src/components/core/Tooltip/Tooltip';

interface BaseProgressProps extends BaseAssetProgressProps, PropsWithChildren {}

export const BaseProgress: FC<BaseProgressProps> = ({
  progress,
  amount,
  children,
}) => {
  const isBelowThreshold = amount < THRESHOLD_MIN_AMOUNT;
  const formattedActualAmount = `$${toCompactValue(amount)}`;
  const formattedAmount = isBelowThreshold
    ? `<$${THRESHOLD_MIN_AMOUNT}`
    : formattedActualAmount;
  const formattedProgress = `${toFixedFractionDigits(progress, 0, 2)}%`;

  return (
    <BaseProgressContainer>
      <Percent percent={progress} size={PercentSize.XXL}>
        {children}
      </Percent>
      <Tooltip title={isBelowThreshold ? formattedActualAmount : null}>
        <Typography variant="bodyXLargeStrong">{formattedAmount}</Typography>
      </Tooltip>
      <Typography variant="bodyXSmall" color="textSecondary">
        {formattedProgress}
      </Typography>
    </BaseProgressContainer>
  );
};
