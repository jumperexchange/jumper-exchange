import type { MouseEvent } from 'react';

import { MenuItemContainer } from './MenuItem.style';
import { MenuItemButton } from './MenuItemButton';
import { MenuItemLabelOnly } from './MenuItemLabelOnly';
import { MenuItemLinkExternal } from './MenuItemLinkExternal';
import { MenuItemLinkInternal } from './MenuItemLinkInternal';
import { MenuItemProps } from './MenuItem.types';

export const InteractiveMenuItem = ({
  open,
  styles,
  autoFocus,
  disableRipple,
  showButton,
  children,
  link,
  onClick,
  ...rest
}: MenuItemProps) => {
  if (!open) return null;

  const handleClick = (event: MouseEvent<HTMLLIElement>) => {
    event.stopPropagation();
    if (!children) onClick?.(event);
  };

  const renderContent = () => {
    if (children) return children;
    if (showButton) return <MenuItemButton {...rest} />;
    if (link?.url) {
      return link.external ? (
        <MenuItemLinkExternal link={link} {...rest} />
      ) : (
        <MenuItemLinkInternal link={link} {...rest} />
      );
    }
    return <MenuItemLabelOnly {...rest} />;
  };

  return (
    <MenuItemContainer
      disableRipple={disableRipple || showButton}
      sx={styles}
      autoFocus={autoFocus}
      onClick={handleClick}
    >
      {renderContent()}
    </MenuItemContainer>
  );
};
