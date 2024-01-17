import { Menu, MenuItem, useMainMenuContent } from 'src/components';
import { MenuKeys } from 'src/const';
import { useMenuStore } from 'src/stores';
import type { JsxElement } from 'typescript';
import { DevelopersSubmenu, LanguagesSubmenu } from '..';

export const MainMenu = () => {
  const mainMenuItems = useMainMenuContent();
  const { openMainMenu, setMainMenuState, openSubMenu } = useMenuStore(
    (state) => state,
  );

  return openMainMenu ? (
    <Menu
      open
      transformOrigin={'top right'}
      setOpen={setMainMenuState}
      isOpenSubMenu={openSubMenu !== MenuKeys.None}
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
  ) : null;
};
