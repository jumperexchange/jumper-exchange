import { Menu, MenuItem, useMainMenuContent } from 'src/components';
import { MenuKeys } from 'src/const';
import { useMenuStore } from 'src/stores';
import type { JsxElement } from 'typescript';
import { DevelopersSubmenu, LanguagesSubmenu } from '..';

interface MenuProps {
  anchorEl: any;
}

export const MainMenu = ({ anchorEl }: MenuProps) => {
  const mainMenuItems = useMainMenuContent();
  const { openMainMenu, setMainMenuState, openSubMenu } = useMenuStore(
    (state) => state,
  );

  return (
    <Menu
      open={openMainMenu}
      setOpen={setMainMenuState}
      isOpenSubMenu={openSubMenu !== MenuKeys.None}
      anchorEl={anchorEl}
    >
      {openSubMenu === MenuKeys.None &&
        mainMenuItems.map((el, index) => (
          <MenuItem
            key={`${el.label}-${index}`}
            autoFocus={index > 0 ? true : false}
            label={el.label}
            prefixIcon={el.prefixIcon}
            styles={el.styles}
            children={el.children as unknown as JsxElement}
            triggerSubMenu={el.triggerSubMenu}
            showButton={el.showButton}
            disableRipple={el.disableRipple}
            showMoreIcon={el.showMoreIcon}
            suffixIcon={el.suffixIcon}
            onClick={el.onClick}
            open
          />
        ))}

      <LanguagesSubmenu />
      <DevelopersSubmenu />
    </Menu>
  );
};
