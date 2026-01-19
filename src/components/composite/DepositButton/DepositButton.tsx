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

export const DepositButton: FC<DepositButtonProps> = ({
  displayMode = DepositButtonDisplayMode.IconAndLabel,
  size = 'medium',
  label,
  tooltip,
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

  const button = (
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
