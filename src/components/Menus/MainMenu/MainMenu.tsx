import { useTranslation } from 'react-i18next';
import {
  Menu,
  MenuItem,
  SubMenu,
  useDevelopersContent,
  useLanguagesContent,
  useMainMenuContent,
} from 'src/components';
import { MenuKeys } from 'src/const';
import { useMenuStore } from 'src/stores';
import type { JsxElement } from 'typescript';
interface MainMenuProps {
  handleClose: (event: MouseEvent | TouchEvent) => void;
}

export const MainMenu = ({ handleClose }: MainMenuProps) => {
  const { t } = useTranslation();
  const mainMenuItems = useMainMenuContent();
  const mainSubMenuDevelopers = useDevelopersContent();
  const mainSubMenuLanguage = useLanguagesContent();
  const [openMainMenu, onOpenMainMenu, openSubMenu] = useMenuStore((state) => [
    state.openMainMenu,
    state.onOpenMainMenu,
    state.openSubMenu,
  ]);

  return openMainMenu ? (
    <Menu
      handleClose={handleClose}
      open
      transformOrigin={'top right'}
      setOpen={onOpenMainMenu}
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

      <SubMenu
        label={t('language.key', { ns: 'language' })}
        triggerSubMenu={MenuKeys.Language}
        open={openSubMenu === MenuKeys.Language}
        prevMenu={MenuKeys.None}
        subMenuList={mainSubMenuLanguage}
      />

      <SubMenu
        label={t('navbar.navbarMenu.developers')}
        triggerSubMenu={MenuKeys.Devs}
        open={openSubMenu === MenuKeys.Devs}
        prevMenu={MenuKeys.None}
        subMenuList={mainSubMenuDevelopers}
      />
    </Menu>
  ) : null;
};
