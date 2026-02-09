import type { ReactNode } from 'react';
import type { ButtonProps as MuiButtonProps } from '@mui/material/Button';
import type { Size, Variant } from '../types';

export interface ButtonProps extends Omit<
  MuiButtonProps,
  'variant' | 'size' | 'startIcon' | 'endIcon'
> {
  variant?: Variant;
  size?: Size;
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
  'data-testid'?: string;
}
