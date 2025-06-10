import { MenuItemLink } from './MenuItem.style';
import { MenuItemLabel } from './MenuItemLabel';
import RouterLink from 'next/link';
import type { MenuItemProps } from './MenuItem.types';

export const MenuItemLinkInternal = ({
  label,
  link,
  prefixIcon,
  suffixIcon,
  showMoreIcon,
}: Pick<
  MenuItemProps,
  'label' | 'prefixIcon' | 'suffixIcon' | 'showMoreIcon' | 'link'
>) => (
  <MenuItemLink as={RouterLink} href={link?.url || '#'}>
    <MenuItemLabel
      label={label}
      showMoreIcon={showMoreIcon}
      suffixIcon={suffixIcon}
      prefixIcon={prefixIcon}
    />
  </MenuItemLink>
);
