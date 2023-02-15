import { useTranslation } from 'react-i18next';
import {
  SubMenuKeys,
  useMainMenuItems,
  useMainSubMenuDevelopers,
  useMainSubMenuLanguage,
  useMainSubMenuShowcases,
  useMainSubMenuTheme,
} from '../../../../const';
import { useMenu } from '../../../../providers/MenuProvider';
import { SupportModal } from '../../../SupportModal';
import { MenuItemComponent, NavbarMenu, SubMenuComponent } from '../../index';
interface MainMenuProps {
  handleClose: (event: MouseEvent | TouchEvent) => void;
}

export const MainMenu = ({ handleClose }: MainMenuProps) => {
  const menu = useMenu();
  const i18Path = 'navbar.';
  const { t: translate } = useTranslation();
  const mainMenuItems = useMainMenuItems();
  const mainSubMenuTheme = useMainSubMenuTheme();
  const mainSubMenuDevelopers = useMainSubMenuDevelopers();
  const mainSubMenuLanguage = useMainSubMenuLanguage();
  const mainSubMenuShowcases = useMainSubMenuShowcases();

  return (
    <>
      <NavbarMenu
        handleClose={handleClose}
        open={menu.openMainNavbarMenu}
        setOpen={menu.onOpenNavbarMainMenu}
        isOpenSubMenu={menu.openNavbarSubMenu !== SubMenuKeys.none}
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
            open={menu.openMainNavbarMenu}
            isOpenSubMenu={menu.openNavbarSubMenu !== SubMenuKeys.none}
            setOpenSubMenu={menu.onOpenNavbarSubMenu}
          />
        ))}
        <SubMenuComponent
          isSubMenu={true}
          label={`${translate(`${i18Path}navbarMenu.theme`)}`}
          triggerSubMenu={SubMenuKeys.themes}
          isScrollable={true}
          open={menu.openMainNavbarMenu}
          isOpenSubMenu={menu.openNavbarSubMenu !== SubMenuKeys.none}
          setOpenSubMenu={menu.onOpenNavbarSubMenu}
          subMenuList={mainSubMenuTheme}
        />

        <SubMenuComponent
          isSubMenu={true}
          label={`${translate(`${i18Path}language.key`)}`}
          triggerSubMenu={SubMenuKeys.language}
          isScrollable={true}
          open={menu.openMainNavbarMenu}
          isOpenSubMenu={menu.openNavbarSubMenu !== SubMenuKeys.none}
          setOpenSubMenu={menu.onOpenNavbarSubMenu}
          subMenuList={mainSubMenuLanguage}
        />

        <SubMenuComponent
          isSubMenu={true}
          label={`${translate(`${i18Path}navbarMenu.developers`)}`}
          triggerSubMenu={SubMenuKeys.devs}
          isScrollable={true}
          open={menu.openMainNavbarMenu}
          isOpenSubMenu={menu.openNavbarSubMenu !== SubMenuKeys.none}
          setOpenSubMenu={menu.onOpenNavbarSubMenu}
          subMenuList={mainSubMenuDevelopers}
        />

        <SubMenuComponent
          isSubMenu={true}
          label={`${translate(`${i18Path}developers.showcases`)}`}
          triggerSubMenu={'showcases'}
          isScrollable={true}
          open={menu.openMainNavbarMenu}
          isOpenSubMenu={menu.openNavbarSubMenu !== SubMenuKeys.none}
          setOpenSubMenu={menu.onOpenNavbarSubMenu}
          subMenuList={mainSubMenuShowcases}
        />
      </NavbarMenu>
      <SupportModal />
    </>
  );
};
