import MuiTooltip, {
  TooltipProps as MuiTooltipProps,
} from '@mui/material/Tooltip';
import { useMemo } from 'react';

interface TooltipProps extends MuiTooltipProps {
  anchorEl?: HTMLElement;
}

export const Tooltip = ({ children, ...props }: TooltipProps) => {
  const slotProps = useMemo(() => {
    const _slotProps: MuiTooltipProps['slotProps'] = {
      tooltip: {
        sx: {
          color: (theme) => (theme.vars || theme).palette.textPrimaryInverted,
          backgroundColor: (theme) => (theme.vars || theme).palette.grey[900],
          '& .MuiTooltip-arrow': {
            color: (theme) => (theme.vars || theme).palette.grey[900],
          },
        },
      },
    };

    if (props.anchorEl) {
      _slotProps.popper = {
        anchorEl: props.anchorEl,
        sx: {
          marginBottom: '-11px !important',
        },
      };
    }

    return _slotProps;
  }, [props.anchorEl]);

  return (
    <MuiTooltip
      arrow
      placement="top"
      enterDelay={100}
      disableTouchListener={false}
      enterTouchDelay={0}
      leaveTouchDelay={2000}
      {...props}
      slotProps={slotProps}
    >
      {children}
    </MuiTooltip>
  );
};
