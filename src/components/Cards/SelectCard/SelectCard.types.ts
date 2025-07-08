import { ChangeEventHandler, FocusEventHandler, ReactNode } from 'react';
import { SelectCardMode } from './SelectCard.styles';

export interface SelectCardBaseProps {
  label?: string;
  value?: string;
  placeholder: string;
  description?: string;
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
  mode: SelectCardMode;
}

export interface SelectCardDisplayProps
  extends Omit<SelectCardBaseProps, 'mode'> {
  mode: SelectCardMode.Display;
  onClick?: () => void;
}

export interface SelectCardInputProps
  extends Omit<SelectCardBaseProps, 'mode'> {
  mode: SelectCardMode.Input;
  id: string;
  name: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onFocus?: FocusEventHandler<HTMLInputElement>;
  onBlur?: FocusEventHandler<HTMLInputElement>;
}

export type SelectCardProps = SelectCardDisplayProps | SelectCardInputProps;
