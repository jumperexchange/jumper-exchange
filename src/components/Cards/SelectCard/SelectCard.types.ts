import type { ChangeEventHandler, FocusEventHandler, ReactNode } from 'react';
import type { SelectCardMode } from './SelectCard.styles';
import type { TypographyProps } from '@mui/material/Typography';
import type { SxProps, Theme } from '@mui/material/styles';

export interface SelectCardBaseProps {
  label?: string;
  labelVariant?: TypographyProps['variant'];
  value?: string;
  valueVariant?: TypographyProps['variant'];
  placeholder: string;
  placeholderVariant?: TypographyProps['variant'];
  description?: ReactNode;
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
  mode: SelectCardMode;
  isClickable?: boolean;
  sx?: SxProps<Theme>;
}

export interface SelectCardDisplayProps extends Omit<
  SelectCardBaseProps,
  'mode'
> {
  mode: SelectCardMode.Display;
  onClick?: () => void;
}

export interface SelectCardInputProps extends Omit<
  SelectCardBaseProps,
  'mode'
> {
  mode: SelectCardMode.Input;
  id: string;
  name: string;
  isAmount?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onFocus?: FocusEventHandler<HTMLInputElement>;
  onBlur?: FocusEventHandler<HTMLInputElement>;
}

export type SelectCardProps = SelectCardDisplayProps | SelectCardInputProps;
