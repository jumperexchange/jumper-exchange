export interface MultiSelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

export type MultiSelectDisplayMode = 'chips' | 'label' | 'count';

export interface MultiSelectProps {
  options: MultiSelectOption[];
  value?: string[];
  onChange?: (value: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  size?: 'small' | 'medium';
  variant?: 'outlined' | 'filled' | 'standard';
  error?: boolean;
  helperText?: string;
  label?: string;
  required?: boolean;
  multiple?: boolean;
  renderValue?: (selected: unknown) => React.ReactNode;
  maxHeight?: number;
  show?: MultiSelectDisplayMode;
  maxChips?: number;
  'data-testid'?: string;
}
