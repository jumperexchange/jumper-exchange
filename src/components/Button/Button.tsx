import type { SxProps, Theme } from '@mui/material';
import type { ReactNode } from 'react';
import { type PropsWithChildren } from 'react';
import {
  ButtonPrimary,
  ButtonSecondary,
  ButtonTransparent,
} from './Button.style';
type ButtonVariant = 'primary' | 'secondary' | 'transparent';
type ButtonSize = 'small' | 'medium' | 'large';

const buttonHeight = {
  small: 30,
  medium: 40,
  large: 48,
};

interface ButtonProps {
  variant: ButtonVariant;
  styles?: SxProps<Theme>;
  id?: string;
  fullWidth?: boolean;
  muiVariant?: 'text' | 'outlined' | 'contained';
  onClick?: (event?: any) => void;
  children?: any;
  disabled?: boolean;
  size?: ButtonSize;
}

export const Button: React.FC<PropsWithChildren<ButtonProps>> = ({
  variant,
  styles,
  id,
  fullWidth,
  onClick,
  children,
  muiVariant,
  disabled,
  size,
}: ButtonProps) => {
  let output: ReactNode;

  const sx = {
    ...styles,
    height: size ? buttonHeight[size] : buttonHeight['large'],
  };

  switch (variant) {
    case 'primary':
      output = (
        <ButtonPrimary
          id={id}
          disabled={disabled}
          fullWidth={fullWidth}
          onClick={(event) => onClick && onClick(event)}
          variant={muiVariant}
          sx={sx}
        >
          {children}
        </ButtonPrimary>
      );
      break;
    case 'secondary':
      output = (
        <ButtonSecondary
          id={id}
          disabled={disabled}
          fullWidth={fullWidth}
          onClick={(event) => onClick && onClick(event)}
          variant={muiVariant}
          sx={sx}
        >
          {children}
        </ButtonSecondary>
      );
      break;
    case 'transparent':
      output = (
        <ButtonTransparent
          id={id}
          disabled={disabled}
          fullWidth={fullWidth}
          onClick={(event) => onClick && onClick(event)}
          variant={muiVariant}
          sx={sx}
        >
          {children}
        </ButtonTransparent>
      );
      break;
    default:
      output = (
        <ButtonPrimary
          id={id}
          disabled={disabled}
          fullWidth={fullWidth}
          onClick={onClick}
          variant={muiVariant}
          sx={sx}
        >
          {children}
        </ButtonPrimary>
      );
  }

  return output;
};
