import type { FC } from 'react';
import {
  WithdrawButtonContentWrapper,
  WithdrawButtonLabelWrapper,
  WithdrawButtonPrimary,
} from './WithdrawButton.styles';
import type { WithdrawButtonProps } from './WithdrawButton.types';
import type { TooltipProps } from '@mui/material/Tooltip';
import { Tooltip } from '@/components/core/Tooltip/Tooltip';

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

export const WithdrawButton: FC<WithdrawButtonProps> = ({
  size = 'medium',
  label,
  tooltip,
  onClick,
  ...props
}) => {
  return (
    <Tooltip
      title={tooltip}
      placement="top"
      enterTouchDelay={0}
      arrow
      slotProps={tooltipSlotProps}
    >
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
    </Tooltip>
  );
};
