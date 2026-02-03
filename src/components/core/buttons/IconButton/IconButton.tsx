'use client';

import { StyledIconButton } from './IconButton.styles';
import type { IconButtonProps } from './IconButton.types';
import { Variant, Size } from '../types';

export const IconButton = ({
  variant = Variant.Default,
  size = Size.MD,
  disabled = false,
  children,
  ...rest
}: IconButtonProps) => {
  const isDisabled = disabled || rest.loading || variant === Variant.Disabled;

  return (
    <StyledIconButton
      {...rest}
      buttonVariant={variant}
      buttonSize={size}
      disabled={isDisabled}
    >
      {children}
    </StyledIconButton>
  );
};
