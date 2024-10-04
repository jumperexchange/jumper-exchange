import { Typography, useTheme } from '@mui/material';
import {
  FlexibleFeeAmountsBadge,
  FlexibleFeePercentContainer,
} from './FlexibleFee.style';

interface FlexibleFeePercentProps {
  handleRateClick: () => void;
}

export const FlexibleFeePercentBox = ({
  handleRateClick,
}: FlexibleFeePercentProps) => {
  const theme = useTheme();

  return (
    <FlexibleFeePercentContainer>
      <FlexibleFeeAmountsBadge onClick={handleRateClick}>
        <Typography
          variant="bodyXSmallStrong"
          color={
            theme.palette.mode === 'light'
              ? theme.palette.primary.main
              : theme.palette.text.primary
          }
        >
          {0.3}%
        </Typography>
      </FlexibleFeeAmountsBadge>
      <FlexibleFeeAmountsBadge onClick={handleRateClick}>
        <Typography
          variant="bodyXSmallStrong"
          color={
            theme.palette.mode === 'light'
              ? theme.palette.primary.main
              : theme.palette.text.primary
          }
        >
          {0.5}%
        </Typography>
      </FlexibleFeeAmountsBadge>
      <FlexibleFeeAmountsBadge onClick={handleRateClick}>
        <Typography
          variant="bodyXSmallStrong"
          color={
            theme.palette.mode === 'light'
              ? theme.palette.primary.main
              : theme.palette.text.primary
          }
        >
          {0.75}%
        </Typography>
      </FlexibleFeeAmountsBadge>
      <FlexibleFeeAmountsBadge onClick={handleRateClick}>
        <Typography
          variant="bodyXSmallStrong"
          color={
            theme.palette.mode === 'light'
              ? theme.palette.primary.main
              : theme.palette.text.primary
          }
        >
          {1}%
        </Typography>
      </FlexibleFeeAmountsBadge>
    </FlexibleFeePercentContainer>
  );
};
