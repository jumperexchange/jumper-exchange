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
};
