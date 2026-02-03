'use client';

import { StyledButton, ButtonLabel } from './Button.style';
import type { ButtonProps } from './Button.types';
import { Variant, Size } from '../types';

export const Button = ({
  variant = Variant.Default,
  size = Size.MD,
  disabled = false,
  startAdornment,
  endAdornment,
  loadingPosition = 'start',
  children,
  ...rest
}: ButtonProps) => {
  const isDisabled = disabled || rest.loading || variant === Variant.Disabled;

  return (
    <StyledButton
      {...rest}
      buttonVariant={variant}
      buttonSize={size}
      disabled={isDisabled}
      startIcon={startAdornment}
      endIcon={endAdornment}
      loadingPosition={loadingPosition}
    >
      <ButtonLabel buttonSize={size} className="MuiButton-buttonLabel">
        {children}
      </ButtonLabel>
    </StyledButton>
  );
};
