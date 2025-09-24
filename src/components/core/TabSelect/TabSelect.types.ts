export interface TabOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  badge?: string | number;
}

export interface TabSelectProps {
  options: TabOption[];
  value?: string;
  onChange?: (value: string) => void;
  orientation?: 'horizontal' | 'vertical';
  variant?: 'standard' | 'scrollable' | 'fullWidth';
  centered?: boolean;
  indicatorColor?: 'primary' | 'secondary';
  textColor?: 'primary' | 'secondary' | 'inherit';
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  showBorder?: boolean;
  scrollButtons?: 'auto' | boolean;
  allowScrollButtonsMobile?: boolean;
  iconPosition?: 'start' | 'end' | 'top' | 'bottom';
  wrapped?: boolean;
  className?: string;
  ariaLabel?: string;
  'data-testid'?: string;
}
