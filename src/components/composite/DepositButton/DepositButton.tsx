import { FC } from 'react';
import {
  DepositButtonDisplayMode,
  DepositButtonProps,
} from './DepositButton.types';
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

  const dataTestId =
    ((props as Record<string, unknown>)['data-testid'] as string | undefined) ||
    'quick-deposit-button';

  return (
    <DepositButtonPrimary
      {...props}
      sx={props.sx}
      size={size}
      onClick={onClick}
      data-testid={dataTestId}
    >
      <DepositButtonContentWrapper>
        {showLabel && renderedLabel}
        {showIcon && renderedIcon}
      </DepositButtonContentWrapper>
    </DepositButtonPrimary>
  );
};
