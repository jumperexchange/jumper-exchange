import type { FC } from 'react';
import {
  WithdrawButtonContentWrapper,
  WithdrawButtonLabelWrapper,
  WithdrawButtonPrimary,
} from './WithdrawButton.styles';
import type { WithdrawButtonProps } from './WithdrawButton.types';

export const WithdrawButton: FC<WithdrawButtonProps> = ({
  size = 'medium',
  label,
  onClick,
  ...props
}) => {
  return (
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
};
