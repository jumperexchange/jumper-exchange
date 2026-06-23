import ButtonBase from '@mui/material/ButtonBase';
import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import type { SxProps, Theme } from '@mui/material/styles';
import type { FC, ReactNode } from 'react';
import {
  OverviewEarnCardItemContentContainer,
  OverviewEarnCardItemHeaderContainer,
  OverviewEarnCardItemValue,
  OverviewEarnCardItemValueAppend,
  OverviewEarnCardItemValuePrepend,
  TooltipIcon,
} from '../EarnCard.styles';

interface OverviewEarnCardItemProps {
  dataTestId: string;
  title: string;
  tooltip: string;
  value?: string;
  valuePrepend?: ReactNode;
  valueAppend?: ReactNode;
  contentStyles?: SxProps<Theme>;
  shouldExpand?: boolean;
  onClick?: () => void;
}

export const OverviewEarnCardItem: FC<OverviewEarnCardItemProps> = ({
  dataTestId,
  title,
  tooltip,
  value,
  valuePrepend,
  valueAppend,
  contentStyles,
  shouldExpand,
  onClick,
}) => {
  return (
    <Grid size={{ xs: 12, sm: shouldExpand ? 12 : 6 }} data-testid={dataTestId}>
      <OverviewEarnCardItemHeaderContainer sx={{ display: 'flex', gap: 1 }}>
        {onClick ? (
          <ButtonBase
            onClick={onClick}
            sx={{
              typography: 'bodyXSmall',
              color: 'text.secondary',
              cursor: 'pointer',
              textDecoration: 'underline',
              textDecorationStyle: 'dashed',
              textUnderlineOffset: '3px',
              borderRadius: '2px',
              '&:focus-visible': {
                outline: '2px solid',
                outlineOffset: '2px',
              },
            }}
            aria-label={title}
          >
            {title}
          </ButtonBase>
        ) : (
          <Typography
            variant="bodyXSmall"
            sx={{
              color: 'text.secondary',
            }}
          >
            {title}
          </Typography>
        )}
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
