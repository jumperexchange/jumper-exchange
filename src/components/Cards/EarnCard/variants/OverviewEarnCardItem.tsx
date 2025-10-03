import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { SxProps, Theme } from '@mui/material/styles';
import { FC, ReactNode } from 'react';
import {
  OverviewEarnCardItemContentContainer,
  OverviewEarnCardItemHeaderContainer,
  OverviewEarnCardItemValue,
  OverviewEarnCardItemValueAppend,
  OverviewEarnCardItemValuePrepend,
  TooltipIcon,
} from '../EarnCard.styles';

interface OverviewEarnCardItemProps {
  title: string;
  tooltip: string;
  value?: string;
  valuePrepend?: ReactNode;
  valueAppend?: ReactNode;
  contentStyles?: SxProps<Theme>;
}

export const OverviewEarnCardItem: FC<OverviewEarnCardItemProps> = ({
  title,
  tooltip,
  value,
  valuePrepend,
  valueAppend,
  contentStyles,
}) => {
  return (
    <Grid size={{ xs: 12, sm: 6 }}>
      <OverviewEarnCardItemHeaderContainer sx={{ display: 'flex', gap: 1 }}>
        <Typography variant="bodyXSmall" color="text.secondary">
          {title}
        </Typography>
        <Tooltip title={tooltip} placement={'top'} enterTouchDelay={0} arrow>
          <TooltipIcon />
        </Tooltip>
      </OverviewEarnCardItemHeaderContainer>
      <OverviewEarnCardItemContentContainer sx={contentStyles}>
        {valuePrepend && (
          <OverviewEarnCardItemValuePrepend>
            {valuePrepend}
          </OverviewEarnCardItemValuePrepend>
        )}
        {value && (
          <OverviewEarnCardItemValue variant="bodyXLargeStrong">
            {value}
          </OverviewEarnCardItemValue>
        )}
        {valueAppend && (
          <OverviewEarnCardItemValueAppend variant="bodyXLarge">
            {valueAppend}
          </OverviewEarnCardItemValueAppend>
        )}
      </OverviewEarnCardItemContentContainer>
    </Grid>
  );
};
