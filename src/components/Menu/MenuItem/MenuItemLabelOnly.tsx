import { MenuItemLabel } from './MenuItemLabel';
import type { MenuItemProps } from './MenuItem.types';

export const MenuItemLabelOnly = ({
  label,
  prefixIcon,
  suffixIcon,
  showMoreIcon,
}: Pick<
  MenuItemProps,
  'label' | 'prefixIcon' | 'suffixIcon' | 'showMoreIcon'
>) => (
  <MenuItemLabel
    label={label}
    showMoreIcon={showMoreIcon}
    suffixIcon={suffixIcon}
    prefixIcon={prefixIcon}
  />
);
