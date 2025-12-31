import type { FC, MouseEvent } from 'react';
import type { DepositButtonProps } from './DepositButton.types';
import { DepositButtonDisplayMode } from './DepositButton.types';
import {
  DepositButtonContentWrapper,
  DepositButtonLabelWrapper,
  DepositButtonPrimary,
  DepositButtonIconWrapper,
} from './DepositButton.styles';
import BoltIcon from 'src/components/illustrations/BoltIcon';
import { Tooltip } from '@/components/core/Tooltip/Tooltip';
import type { TooltipProps } from '@mui/material/Tooltip';

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

export const DepositButton: FC<DepositButtonProps> = ({
  displayMode = DepositButtonDisplayMode.IconAndLabel,
  size = 'medium',
  label,
  onClick,
  ...props
}) => {
  const showLabel = displayMode !== DepositButtonDisplayMode.IconOnly;
  const showIcon = displayMode !== DepositButtonDisplayMode.LabelOnly;
  const renderedIcon = (
    <DepositButtonIconWrapper size={size}>
      <BoltIcon />
    </DepositButtonIconWrapper>
  );
  const renderedLabel = (
    <DepositButtonLabelWrapper size={size}>{label}</DepositButtonLabelWrapper>
  );

  const clickHandler = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    onClick();
  };

  return (
    <Tooltip
      title={!showLabel ? label : undefined}
      placement="top"
      enterTouchDelay={0}
      arrow
      slotProps={tooltipSlotProps}
    >
      <DepositButtonPrimary
        {...props}
        sx={props.sx}
        size={size}
        onClick={clickHandler}
      >
        <DepositButtonContentWrapper>
          {showLabel && renderedLabel}
          {showIcon && renderedIcon}
        </DepositButtonContentWrapper>
      </DepositButtonPrimary>
    </Tooltip>
  );
};
