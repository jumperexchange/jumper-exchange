import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { SxProps, Theme } from '@mui/material/styles';
import { FC, ReactNode } from 'react';
import {
  DepositPoolCardItemContentContainer,
  DepositPoolCardItemHeaderContainer,
  DepositPoolCardItemValue,
  DepositPoolCardItemValueAppend,
  DepositPoolCardItemValuePrepend,
  TooltipIcon,
} from './DepositPoolCard.style';

interface DepositPoolCardItemProps {
  title: string;
  tooltip: string;
  value: string;
  valuePrepend?: ReactNode;
  valueAppend?: ReactNode;
  contentStyles?: SxProps<Theme>;
}

export const DepositPoolCardItem: FC<DepositPoolCardItemProps> = ({
  title,
  tooltip,
  value,
  valuePrepend,
  valueAppend,
  contentStyles,
}) => {
  return (
    <Grid size={{ xs: 12, sm: 6 }}>
      <DepositPoolCardItemHeaderContainer sx={{ display: 'flex', gap: 1 }}>
        <Typography variant="bodyXSmallStrong">{title}</Typography>
        <Tooltip title={tooltip} placement={'top'} enterTouchDelay={0} arrow>
          <TooltipIcon />
        </Tooltip>
      </DepositPoolCardItemHeaderContainer>
      <DepositPoolCardItemContentContainer sx={contentStyles}>
        {valuePrepend && (
          <DepositPoolCardItemValuePrepend>
            {valuePrepend}
          </DepositPoolCardItemValuePrepend>
        )}
        <DepositPoolCardItemValue variant="titleSmall">
          {value}
        </DepositPoolCardItemValue>
        {valueAppend && (
          <DepositPoolCardItemValueAppend variant="bodyLarge">
            {valueAppend}
          </DepositPoolCardItemValueAppend>
        )}
      </DepositPoolCardItemContentContainer>
    </Grid>
  );
};
