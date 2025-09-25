export interface IconOption {
  value: string;
  icon: React.ReactNode;
  label?: string;
  tooltip?: string;
  disabled?: boolean;
  color?: string;
}

export interface IconSelectProps {
  options: IconOption[];
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  multiple?: boolean;
  size?: 'small' | 'medium' | 'large';
  spacing?: number;
  columns?: number;
  showLabel?: boolean;
  showTooltip?: boolean;
  disabled?: boolean;
  color?: 'primary' | 'secondary' | 'default';
  selectionMode?: 'toggle' | 'radio';
  variant?: 'contained' | 'outlined' | 'text';
  fullWidth?: boolean;
  className?: string;
  orientation?: 'horizontal' | 'vertical' | 'grid';
  'data-testid'?: string;
}
