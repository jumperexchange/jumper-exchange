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
import { shallow } from 'zustand/shallow';
import { MenuItemComponent, NavbarMenu, SubMenuComponent } from '../../index';
interface MainMenuProps {
  handleClose: (event: MouseEvent | TouchEvent) => void;
}

export const MainMenu = ({ handleClose }: MainMenuProps) => {
  const i18Path = 'navbar.';
  const { t: translate } = useTranslation();
  const mainMenuItems = useMainMenuContent();
  const mainSubMenuTheme = useThemeContent();
  const mainSubMenuDevelopers = useDevelopersContent();
  const mainSubMenuLanguage = useLanguagesContent();
  const mainSubMenuShowcases = useShowcasesContent();
  const [
    openMainNavbarMenu,
    onOpenNavbarMainMenu,
    openNavbarSubMenu,
    onOpenNavbarSubMenu,
  ] = useMenuStore(
    (state) => [
      state.openMainNavbarMenu,
      state.onOpenNavbarMainMenu,
      state.openNavbarSubMenu,
      state.onOpenNavbarSubMenu,
    ],
    shallow,
  );

  return openMainNavbarMenu ? (
    <NavbarMenu
      handleClose={handleClose}
      open={true}
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
            showButton={el.showButton}
            showMoreIcon={el.showMoreIcon}
            suffixIcon={el.suffixIcon}
            onClick={el.onClick}
            open={true}
            setOpenSubMenu={onOpenNavbarSubMenu}
          />
        ))}
      <SubMenuComponent
        label={translate(`${i18Path}navbarMenu.theme`)}
        triggerSubMenu={MenuKeys.Themes}
        open={openNavbarSubMenu === MenuKeys.Themes}
        prevMenu={MenuKeys.None}
        subMenuList={mainSubMenuTheme}
      />

      <SubMenuComponent
        label={translate(`${i18Path}language.key`)}
        triggerSubMenu={MenuKeys.Language}
        open={openNavbarSubMenu === MenuKeys.Language}
        prevMenu={MenuKeys.None}
        subMenuList={mainSubMenuLanguage}
      />

      <SubMenuComponent
        label={translate(`${i18Path}navbarMenu.developers`)}
        triggerSubMenu={MenuKeys.Devs}
        open={openNavbarSubMenu === MenuKeys.Devs}
        prevMenu={MenuKeys.None}
        subMenuList={mainSubMenuDevelopers}
      />

      <SubMenuComponent
        label={translate(`${i18Path}developers.showcases`)}
        triggerSubMenu={MenuKeys.Showcases}
        open={openNavbarSubMenu === MenuKeys.Showcases}
        prevMenu={MenuKeys.Devs}
        subMenuList={mainSubMenuShowcases}
      />
    </NavbarMenu>
  ) : null;
};
