import MuiTooltip, {
  type TooltipProps as MuiTooltipProps,
} from '@mui/material/Tooltip';
import { useMemo } from 'react';

interface TooltipProps extends MuiTooltipProps {
  anchorEl?: HTMLElement;
}

export const Tooltip = ({
  children,
  slotProps: externalSlotProps,
  ...props
}: TooltipProps) => {
  const slotProps = useMemo(() => {
    const externalTooltip =
      externalSlotProps?.tooltip &&
      typeof externalSlotProps.tooltip === 'object'
        ? externalSlotProps.tooltip
        : undefined;
    const externalPopper =
      externalSlotProps?.popper && typeof externalSlotProps.popper === 'object'
        ? externalSlotProps.popper
        : undefined;

    const _slotProps: MuiTooltipProps['slotProps'] = {
      tooltip: {
        ...externalTooltip,
        sx: {
          color: (theme) => (theme.vars || theme).palette.textPrimaryInverted,
          backgroundColor: (theme) => (theme.vars || theme).palette.grey[900],
          '& .MuiTooltip-arrow': {
            color: (theme) => (theme.vars || theme).palette.grey[900],
          },
          ...externalTooltip?.sx,
        },
      },
      popper: {
        ...externalPopper,
      },
    };

    if (props.anchorEl) {
      _slotProps.popper = {
        ..._slotProps.popper,
        anchorEl: props.anchorEl,
        sx: {
          marginBottom: '-11px !important',
          ...externalPopper?.sx,
        },
      };
    }

    return _slotProps;
  }, [props.anchorEl, externalSlotProps]);

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
