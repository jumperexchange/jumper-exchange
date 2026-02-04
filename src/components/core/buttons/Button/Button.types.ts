import type { ReactNode } from 'react';
import type { ButtonProps as MuiButtonProps } from '@mui/material/Button';
import type { SizeWithoutXS, Variant } from '../types';

export interface ButtonProps extends Omit<
  MuiButtonProps,
  'variant' | 'size' | 'startIcon' | 'endIcon'
> {
  variant?: Variant;
  size?: SizeWithoutXS;
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
  'data-testid'?: string;
}
