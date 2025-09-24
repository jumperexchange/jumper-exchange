export interface SingleSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export interface SingleSelectProps {
  options: SingleSelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  size?: 'small' | 'medium';
  variant?: 'outlined' | 'filled' | 'standard';
  error?: boolean;
  helperText?: string;
  label?: string;
  required?: boolean;
  'data-testid'?: string;
}
