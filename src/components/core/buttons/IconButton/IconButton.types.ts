import type { IconButtonProps as MuiIconButtonProps } from '@mui/material/IconButton';
import type { Variant, Size } from '../types';

export interface IconButtonProps extends Omit<
  MuiIconButtonProps,
  'variant' | 'size'
> {
  variant?: Variant;
  size?: Size;
  'data-testid'?: string;
}
