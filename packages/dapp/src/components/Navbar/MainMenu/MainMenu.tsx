import { useTranslation } from 'react-i18next';

import {
  MainMenuItems,
  MainSubMenuDevelopers,
  MainSubMenuLanguage,
  MainSubMenuTheme,
} from '../../../const';
import { useMenu } from '../../../providers/MenuProvider';
import { MenuItemComponent, NavbarMenu, SubMenuComponent } from '../index';

interface MainMenuProps {
  anchorRef: any; // TODO: Replace this any with the correct type
  handleClose: (event: MouseEvent | TouchEvent) => void;
}

const MainMenu = ({ handleClose, anchorRef }: MainMenuProps) => {
  const menu = useMenu();
  const i18Path = 'Navbar.';
  const { t: translate } = useTranslation();
  const _MainMenuItems = MainMenuItems();
  const _mainSubMenuTheme = MainSubMenuTheme();
  const _mainSubMenuDevelopers = MainSubMenuDevelopers();
  const _mainSubMenuLanguage = MainSubMenuLanguage();

  return (
    <NavbarMenu
      handleClose={handleClose}
      anchorRef={anchorRef}
      open={menu.openMainNavbarMenu}
      setOpen={menu.onOpenNavbarMainMenu}
      openSubMenu={menu.openNavbarSubMenu}
    >
      {_MainMenuItems.map((el, index) => (
        <MenuItemComponent
          key={`${el.label}-${index}`}
          label={el.label}
          listIcon={el.listIcon}
          triggerSubMenu={el.triggerSubMenu}
          showButton={el.showButton}
          extraIcon={el.extraIcon}
          onClick={el.onClick}
          open={menu.openMainNavbarMenu}
          openSubMenu={menu.openNavbarSubMenu}
          setOpenSubMenu={menu.onOpenNavbarSubMenu}
        />
      ))}
      <SubMenuComponent
        isSubMenu={true}
        label={`${translate(`${i18Path}NavbarMenu.Theme`)}`}
        triggerSubMenu={'themes'}
        isScrollable={true}
        open={menu.openMainNavbarMenu}
        openSubMenu={menu.openNavbarSubMenu}
        setOpenSubMenu={menu.onOpenNavbarSubMenu}
        subMenuList={_mainSubMenuTheme}
      />

      <SubMenuComponent
        isSubMenu={true}
        label={`${translate(`${i18Path}Language.key`)}`}
        triggerSubMenu={'language'}
        isScrollable={true}
        open={menu.openMainNavbarMenu}
        openSubMenu={menu.openNavbarSubMenu}
        setOpenSubMenu={menu.onOpenNavbarSubMenu}
        subMenuList={_mainSubMenuLanguage}
      />

      <SubMenuComponent
        isSubMenu={true}
        label={`${translate(`${i18Path}NavbarMenu.Developers`)}`}
        triggerSubMenu={'devs'}
        isScrollable={true}
        open={menu.openMainNavbarMenu}
        openSubMenu={menu.openNavbarSubMenu}
        setOpenSubMenu={menu.onOpenNavbarSubMenu}
        subMenuList={_mainSubMenuDevelopers}
      />
    </NavbarMenu>
  );
};

export default MainMenu;
