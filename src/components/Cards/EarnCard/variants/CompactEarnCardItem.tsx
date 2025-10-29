import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { SxProps, Theme } from '@mui/material/styles';
import { FC, ReactNode } from 'react';
import {
  CompactEarnCardItemContentContainer,
  CompactEarnCardItemHeaderContainer,
  CompactEarnCardItemValue,
  CompactEarnCardItemValueAppend,
  CompactEarnCardItemValuePrepend,
  TooltipIcon,
} from '../EarnCard.styles';

interface CompactEarnCardItemProps {
  title: string;
  dataTestId?: string;
  tooltip: string;
  value?: string;
  valuePrepend?: ReactNode;
  valueAppend?: ReactNode;
  contentStyles?: SxProps<Theme>;
  shouldExpand?: boolean;
}

export const CompactEarnCardItem: FC<CompactEarnCardItemProps> = ({
  dataTestId,
  title,
  tooltip,
  value,
  valuePrepend,
  valueAppend,
  contentStyles,
  shouldExpand,
}) => {
  return (
    <Grid size={{ xs: 12, sm: shouldExpand ? 12 : 6 }} data-testid={dataTestId}>
      <CompactEarnCardItemHeaderContainer sx={{ display: 'flex', gap: 1 }}>
        <Typography variant="bodyXSmall" color="text.secondary">
          {title}
        </Typography>
        <Tooltip title={tooltip} placement={'top'} enterTouchDelay={0} arrow>
          <TooltipIcon />
        </Tooltip>
      </CompactEarnCardItemHeaderContainer>
      <CompactEarnCardItemContentContainer sx={contentStyles}>
        {valuePrepend && (
          <CompactEarnCardItemValuePrepend>
            {valuePrepend}
          </CompactEarnCardItemValuePrepend>
        )}
        {value && (
          <CompactEarnCardItemValue variant="bodyLargeStrong">
            {value}
          </CompactEarnCardItemValue>
        )}
        {valueAppend && (
          <CompactEarnCardItemValueAppend variant="bodyLarge">
            {valueAppend}
          </CompactEarnCardItemValueAppend>
        )}
      </CompactEarnCardItemContentContainer>
    </Grid>
  );
};
