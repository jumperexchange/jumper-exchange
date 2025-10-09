import { SxProps, Theme } from '@mui/material/styles';

export type TData = string | string[] | number[];

export enum SelectVariant {
  Single = 'single',
  Multi = 'multi',
  Slider = 'slider',
}

export enum SelectSize {
  Small = 'small',
  Medium = 'medium',
}

export interface SelectOption<T> {
  value: T;
  label: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  sx?: SxProps<Theme>;
}

export interface SelectBaseProps<T extends TData> {
  options: SelectOption<T extends (infer U)[] ? U : T>[];
  value: T;
  onChange: (value: T) => void;
  fullWidth?: boolean;
  size?: SelectSize;
  error?: boolean;
  helperText?: string;
  label?: string;
  required?: boolean;
  debounceMs?: number;
  'data-testid'?: string;
}

export interface MultiSelectProps<T extends string[]>
  extends SelectBaseProps<T> {
  filterBy?: string;
  label: string;
}

export interface SingleSelectProps<T extends string>
  extends SelectBaseProps<T> {}

export interface SliderSelectProps<T extends number[]>
  extends Omit<SelectBaseProps<T>, 'options'> {
  options: never[];
  min: number;
  max: number;
  label: string;
}

export type SelectProps<T extends TData> =
  | (MultiSelectProps<string[]> & { variant: SelectVariant.Multi })
  | (SingleSelectProps<string> & { variant: SelectVariant.Single })
  | (SliderSelectProps<number[]> & { variant: SelectVariant.Slider });
