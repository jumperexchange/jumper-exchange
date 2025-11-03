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

export enum SelectDisplayMode {
  Menu = 'menu',
  Drawer = 'drawer',
}

export interface SelectOption<T> {
  value: T;
  label: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  sx?: SxProps<Theme>;
}

export interface BaseProps<T extends TData> {
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
  displayMode?: SelectDisplayMode;
}

export interface MenuSelectProps<T extends TData> extends BaseProps<T> {
  menuPlacementX?: 'left' | 'right';
  displayMode: SelectDisplayMode.Menu;
}

export interface DrawerSelectProps<T extends TData> extends BaseProps<T> {
  displayMode: SelectDisplayMode.Drawer;
  showTrigger?: boolean;
  open?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}

export type SelectBaseProps<T extends TData> =
  | MenuSelectProps<T>
  | DrawerSelectProps<T>;

export type MultiSelectProps<T extends string[]> = SelectBaseProps<T> & {
  filterBy?: string;
  label: string;
};

export type SingleSelectProps<T extends string> = SelectBaseProps<T>;

export type SliderSelectProps<T extends number[]> = Omit<
  SelectBaseProps<T>,
  'options'
> & {
  options: never[];
  min: number;
  max: number;
  label: string;
};

export type SelectProps<T extends TData> =
  | (MultiSelectProps<string[]> & { variant: SelectVariant.Multi })
  | (SingleSelectProps<string> & { variant: SelectVariant.Single })
  | (SliderSelectProps<number[]> & { variant: SelectVariant.Slider });
