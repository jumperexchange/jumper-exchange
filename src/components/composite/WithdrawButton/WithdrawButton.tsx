import type { FC } from 'react';
import {
  WithdrawButtonContentWrapper,
  WithdrawButtonLabelWrapper,
  WithdrawButtonPrimary,
} from './WithdrawButton.styles';
import type { WithdrawButtonProps } from './WithdrawButton.types';
import type { TooltipProps } from '@mui/material/Tooltip';
import { Tooltip } from '@/components/core/Tooltip/Tooltip';
import Box from '@mui/material/Box';
import { mergeSx } from '@/utils/theme/mergeSx';

const tooltipSlotProps: TooltipProps['slotProps'] = {
  popper: {
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [0, -6],
        },
      },
    ],
  },
} as const;

const tooltipWrapperStyles = {
  minWidth: 'auto',
  display: 'flex',
  pointerEvents: 'auto',
  cursor: 'not-allowed',
};

export const WithdrawButton: FC<WithdrawButtonProps> = ({
  size = 'medium',
  label,
  tooltip,
  onClick,
  ...props
}) => {
  const button = (
    <WithdrawButtonPrimary
      {...props}
      sx={props.sx}
      size={size}
      onClick={onClick}
    >
      <WithdrawButtonContentWrapper>
        <WithdrawButtonLabelWrapper size={size}>
          {label}
        </WithdrawButtonLabelWrapper>
      </WithdrawButtonContentWrapper>
    </WithdrawButtonPrimary>
  );

  if (tooltip) {
    return (
      <Tooltip
        title={tooltip}
        placement="top"
        enterTouchDelay={0}
        arrow
        slotProps={tooltipSlotProps}
      >
        <Box component="span" sx={mergeSx(tooltipWrapperStyles, props.sx)}>
          {button}
        </Box>
      </Tooltip>
    );
  }
  return button;
};
