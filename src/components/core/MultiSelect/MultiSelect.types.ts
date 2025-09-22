export interface MultiSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  group?: string;
}

export interface MultiSelectProps {
  options: MultiSelectOption[];
  value?: string[];
  onChange?: (value: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  size?: 'small' | 'medium' | 'large';
  variant?: 'outlined' | 'filled' | 'standard';
  error?: boolean;
  helperText?: string;
  label?: string;
  required?: boolean;
  multiple?: boolean;
  renderValue?: (selected: unknown) => React.ReactNode;
  maxHeight?: number;
  showCheckbox?: boolean;
  showChips?: boolean;
  maxChips?: number;
}
