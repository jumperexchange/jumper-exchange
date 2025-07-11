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

interface ButtonProps {
  variant?: ButtonVariant;
  styles?: SxProps<Theme>;
  id?: string;
  fullWidth?: boolean;
  loading?: boolean;
  muiVariant?: 'text' | 'outlined' | 'contained';
  onClick?: (event?: React.MouseEvent<HTMLButtonElement>) => void;
  children?: ReactNode;
  disabled?: boolean;
  size?: ButtonSize;
  type?: 'button' | 'reset' | 'submit';
}

export const Button: React.FC<PropsWithChildren<ButtonProps>> = ({
  variant,
  styles,
  id,
  fullWidth,
  loading,
  onClick,
  children,
  muiVariant,
  disabled,
  size,
  type = 'button',
}: ButtonProps) => {
  let output: ReactNode;

  switch (variant) {
    case 'primary':
      output = (
        <ButtonPrimary
          size={size}
          id={id}
          disabled={disabled}
          fullWidth={fullWidth}
          onClick={(event) => onClick && onClick(event)}
          variant={muiVariant}
          sx={styles}
          type={type}
          loading={loading}
        >
          {children}
        </ButtonPrimary>
      );
      break;
    case 'secondary':
      output = (
        <ButtonSecondary
          size={size}
          id={id}
          disabled={disabled}
          fullWidth={fullWidth}
          onClick={(event) => onClick && onClick(event)}
          variant={muiVariant}
          sx={styles}
          type={type}
          loading={loading}
        >
          {children}
        </ButtonSecondary>
      );
      break;
    case 'transparent':
      output = (
        <ButtonTransparent
          size={size}
          id={id}
          disabled={disabled}
          fullWidth={fullWidth}
          onClick={(event) => onClick && onClick(event)}
          variant={muiVariant}
          sx={styles}
          type={type}
          loading={loading}
        >
          {children}
        </ButtonTransparent>
      );
      break;
    default:
      output = (
        <ButtonPrimary
          size={size}
          id={id}
          disabled={disabled}
          fullWidth={fullWidth}
          onClick={onClick}
          variant={muiVariant}
          sx={styles}
          type={type}
          loading={loading}
        >
          {children}
        </ButtonPrimary>
      );
  }

  return output;
};
