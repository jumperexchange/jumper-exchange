import { ChangeEventHandler, ReactNode } from 'react';
import { SelectCardMode } from './SelectCard.styles';

export interface SelectCardBaseProps {
  label?: string;
  value?: string;
  placeholder: string;
  description?: string;
  icon?: ReactNode;
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
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onFocus?: () => void;
  onBlur?: () => void;
}

export type SelectCardProps = SelectCardDisplayProps | SelectCardInputProps;
