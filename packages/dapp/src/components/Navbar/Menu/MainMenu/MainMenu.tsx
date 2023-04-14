import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';
import {
  SubMenuKeys,
  useMainMenuItems,
  useMainSubMenuDevelopers,
  useMainSubMenuLanguage,
  useMainSubMenuShowcases,
  useMainSubMenuTheme,
} from '../../../../const';
import { useMenuStore } from '../../../../stores';
import { SupportModal } from '../../../SupportModal';
import { MenuItemComponent, NavbarMenu, SubMenuComponent } from '../../index';
interface MainMenuProps {
  handleClose: (event: MouseEvent | TouchEvent) => void;
}

export const MainMenu = ({ handleClose }: MainMenuProps) => {
  const i18Path = 'navbar.';
  const { t: translate } = useTranslation();
  const mainMenuItems = useMainMenuItems();
  const mainSubMenuTheme = useMainSubMenuTheme();
  const mainSubMenuDevelopers = useMainSubMenuDevelopers();
  const mainSubMenuLanguage = useMainSubMenuLanguage();
  const mainSubMenuShowcases = useMainSubMenuShowcases();
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

  return (
    <>
      <NavbarMenu
        handleClose={handleClose}
        open={openMainNavbarMenu}
        setOpen={onOpenNavbarMainMenu}
        isOpenSubMenu={openNavbarSubMenu !== SubMenuKeys.none}
      >
        {mainMenuItems.map((el, index) => (
          <MenuItemComponent
            key={`${el.label}-${index}`}
            label={el.label}
            prefixIcon={el.prefixIcon}
            triggerSubMenu={el.triggerSubMenu}
            showButton={el.showButton}
            showMoreIcon={el.showMoreIcon}
            suffixIcon={el.suffixIcon}
            onClick={el.onClick}
            open={openMainNavbarMenu}
            isOpenSubMenu={openNavbarSubMenu !== SubMenuKeys.none}
            setOpenSubMenu={onOpenNavbarSubMenu}
          />
        ))}
        <SubMenuComponent
          isSubMenu={true}
          label={`${translate(`${i18Path}navbarMenu.theme`)}`}
          triggerSubMenu={SubMenuKeys.themes}
          isScrollable={true}
          open={openMainNavbarMenu}
          isOpenSubMenu={openNavbarSubMenu !== SubMenuKeys.none}
          setOpenSubMenu={onOpenNavbarSubMenu}
          subMenuList={mainSubMenuTheme}
        />

        <SubMenuComponent
          isSubMenu={true}
          label={`${translate(`${i18Path}language.key`)}`}
          triggerSubMenu={SubMenuKeys.language}
          isScrollable={true}
          open={openMainNavbarMenu}
          isOpenSubMenu={openNavbarSubMenu !== SubMenuKeys.none}
          setOpenSubMenu={onOpenNavbarSubMenu}
          subMenuList={mainSubMenuLanguage}
        />

        <SubMenuComponent
          isSubMenu={true}
          label={`${translate(`${i18Path}navbarMenu.developers`)}`}
          triggerSubMenu={SubMenuKeys.devs}
          isScrollable={true}
          open={openMainNavbarMenu}
          isOpenSubMenu={openNavbarSubMenu !== SubMenuKeys.none}
          setOpenSubMenu={onOpenNavbarSubMenu}
          subMenuList={mainSubMenuDevelopers}
        />

        <SubMenuComponent
          isSubMenu={true}
          label={`${translate(`${i18Path}developers.showcases`)}`}
          triggerSubMenu={'showcases'}
          isScrollable={true}
          open={openMainNavbarMenu}
          isOpenSubMenu={openNavbarSubMenu !== SubMenuKeys.none}
          setOpenSubMenu={onOpenNavbarSubMenu}
          subMenuList={mainSubMenuShowcases}
        />
      </NavbarMenu>
      <SupportModal />
    </>
  );
};
