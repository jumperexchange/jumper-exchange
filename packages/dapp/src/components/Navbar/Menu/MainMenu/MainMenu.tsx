import {
  MenuKeys,
  useDevelopersContent,
  useLanguagesContent,
  useMainMenuContent,
  useShowcasesContent,
  useThemeContent,
} from '@transferto/dapp/src/const';
import { useMenuStore } from '@transferto/dapp/src/stores';
import { useTranslation } from 'react-i18next';
import { MenuItemComponent, NavbarMenu, SubMenuComponent } from '../../index';
interface MainMenuProps {
  handleClose: (event: MouseEvent | TouchEvent) => void;
}

export const MainMenu = ({ handleClose }: MainMenuProps) => {
  const { t } = useTranslation();
  const mainMenuItems = useMainMenuContent();
  const mainSubMenuTheme = useThemeContent();
  const mainSubMenuDevelopers = useDevelopersContent();
  const mainSubMenuLanguage = useLanguagesContent();
  const mainSubMenuShowcases = useShowcasesContent();
  const [openMainNavbarMenu, onOpenNavbarMainMenu, openNavbarSubMenu] =
    useMenuStore((state) => [
      state.openMainNavbarMenu,
      state.onOpenNavbarMainMenu,
      state.openNavbarSubMenu,
    ]);

  return openMainNavbarMenu ? (
    <NavbarMenu
      handleClose={handleClose}
      open
      transformOrigin={'top right'}
      setOpen={onOpenNavbarMainMenu}
      isOpenSubMenu={openNavbarSubMenu !== MenuKeys.None}
    >
      {openNavbarSubMenu === MenuKeys.None &&
        mainMenuItems.map((el, index) => (
          <MenuItemComponent
            key={`${el.label}-${index}`}
            autoFocus={index > 0 ? true : false}
            label={el.label}
            prefixIcon={el.prefixIcon}
            triggerSubMenu={el.triggerSubMenu}
            showButton={el.showButton ?? false}
            showMoreIcon={el.showMoreIcon}
            suffixIcon={el.suffixIcon}
            onClick={el.onClick}
            open
          />
        ))}
      <SubMenuComponent
        label={t('navbar.navbarMenu.theme')}
        triggerSubMenu={MenuKeys.Themes}
        open={openNavbarSubMenu === MenuKeys.Themes}
        prevMenu={MenuKeys.None}
        subMenuList={mainSubMenuTheme}
      />

      <SubMenuComponent
        label={t('navbar.language.key')}
        triggerSubMenu={MenuKeys.Language}
        open={openNavbarSubMenu === MenuKeys.Language}
        prevMenu={MenuKeys.None}
        subMenuList={mainSubMenuLanguage}
      />

      <SubMenuComponent
        label={t('navbar.navbarMenu.developers')}
        triggerSubMenu={MenuKeys.Devs}
        open={openNavbarSubMenu === MenuKeys.Devs}
        prevMenu={MenuKeys.None}
        subMenuList={mainSubMenuDevelopers}
      />

      <SubMenuComponent
        label={t('navbar.developers.showcases')}
        triggerSubMenu={MenuKeys.Showcases}
        open={openNavbarSubMenu === MenuKeys.Showcases}
        prevMenu={MenuKeys.Devs}
        subMenuList={mainSubMenuShowcases}
      />
    </NavbarMenu>
  ) : null;
};
