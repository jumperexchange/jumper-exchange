import { SelectBaseProps, TData, SelectDisplayMode } from '../Select.types';
import { PropsWithChildren } from 'react';
import { SelectProps } from '@mui/material/Select';
import {
  MenuDisplayMode,
  MenuDisplayModeProps,
} from '../displayMode/MenuDisplayMode';
import {
  DrawerDisplayMode,
  DrawerDisplayModeProps,
} from '../displayMode/DrawerDisplayMode';

export { SelectDisplayMode as DisplayMode };

interface ExtendedSelectBaseProps<T extends TData>
  extends Omit<SelectBaseProps<T>, 'onChange'>,
    PropsWithChildren {
  multiple?: boolean;
  onChange: SelectProps['onChange'];
  selectorContent?: React.ReactNode;
  title: string;
}

export const SelectBase = <T extends TData>({
  displayMode = SelectDisplayMode.Menu,
  ...rest
}: ExtendedSelectBaseProps<T>) => {
  if (displayMode === SelectDisplayMode.Drawer) {
    return (
      <DrawerDisplayMode {...(rest as unknown as DrawerDisplayModeProps<T>)} />
    );
  }

  return <MenuDisplayMode {...(rest as unknown as MenuDisplayModeProps<T>)} />;
};
