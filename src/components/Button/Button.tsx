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
  muiVariant?: 'text' | 'outlined' | 'contained';
  onClick?: (event?: React.MouseEvent<HTMLButtonElement>) => void;
  children?: ReactNode;
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
        >
          {children}
        </ButtonPrimary>
      );
  }

  return output;
};
