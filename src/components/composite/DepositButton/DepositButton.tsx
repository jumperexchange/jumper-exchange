import { FC } from 'react';
import {
  DepositButtonDisplayMode,
  DepositButtonProps,
} from './DepositButton.types';
import {
  DepositButtonContentWrapper,
  DepositButtonLabelWrapper,
  DepositButtonPrimary,
  DepositIcon,
} from './DepositButton.styles';

export const DepositButton: FC<DepositButtonProps> = ({
  displayMode = DepositButtonDisplayMode.IconAndLabel,
  size = 'medium',
  label,
  onClick,
  ...props
}) => {
  const showLabel = displayMode !== DepositButtonDisplayMode.IconOnly;
  const showIcon = displayMode !== DepositButtonDisplayMode.LabelOnly;
  const renderedIcon = <DepositIcon size={size} />;
  const renderedLabel = (
    <DepositButtonLabelWrapper>{label}</DepositButtonLabelWrapper>
  );

  return (
    <DepositButtonPrimary
      {...props}
      sx={props.sx}
      size={size}
      onClick={onClick}
    >
      <DepositButtonContentWrapper>
        {showLabel && renderedLabel}
        {showIcon && renderedIcon}
      </DepositButtonContentWrapper>
    </DepositButtonPrimary>
  );
};
