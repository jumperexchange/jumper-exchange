import { MenuItemLink } from './MenuItem.style';
import { MenuItemLabel } from './MenuItemLabel';
import type { MenuItemProps } from './MenuItem.types';

export const MenuItemLinkExternal = ({
  label,
  link,
  prefixIcon,
  suffixIcon,
  showMoreIcon,
}: Pick<
  MenuItemProps,
  'label' | 'prefixIcon' | 'suffixIcon' | 'showMoreIcon' | 'link'
>) => (
  <MenuItemLink
    as="a"
    href={link?.url ?? ''}
    target="_blank"
    rel="noopener noreferrer"
  >
    <MenuItemLabel
      label={label}
      showMoreIcon={showMoreIcon}
      suffixIcon={suffixIcon}
      prefixIcon={prefixIcon}
    />
  </MenuItemLink>
);
