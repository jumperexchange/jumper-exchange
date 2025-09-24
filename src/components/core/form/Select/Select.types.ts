export type TData = string | string[];

export enum SelectVariant {
  Single = 'single',
  Multi = 'multi',
}

export enum SelectSize {
  Small = 'small',
  Medium = 'medium',
}

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export interface SelectBaseProps<T extends TData> {
  options: SelectOption[];
  value: T;
  onChange: (value: T) => void;
  fullWidth?: boolean;
  size?: SelectSize;
  error?: boolean;
  helperText?: string;
  label?: string;
  required?: boolean;
  debounceMs?: number;
}

export interface MultiSelectProps<T extends string[]>
  extends SelectBaseProps<T> {
  filterBy?: string;
  label: string;
}

export interface SingleSelectProps<T extends string>
  extends SelectBaseProps<T> {}

export type SelectProps<T extends TData> =
  | (MultiSelectProps<string[]> & { variant: SelectVariant.Multi })
  | (SingleSelectProps<string> & { variant: SelectVariant.Single });
