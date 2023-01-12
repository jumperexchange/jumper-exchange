import { useTranslation } from 'react-i18next';
import {
  MainMenuItems,
  MainSubMenuDevelopers,
  MainSubMenuLanguage,
  MainSubMenuShowcases,
  MainSubMenuTheme,
  SubMenuKeys,
} from '../../../const';
import { useMenu } from '../../../providers/MenuProvider';
import { SupportModal } from '../../SupportModal';
import { MenuItemComponent, NavbarMenu, SubMenuComponent } from '../index';
interface MainMenuProps {
  anchorRef: any; // TODO: Replace this any with the correct type
  handleClose: (event: MouseEvent | TouchEvent) => void;
}

const MainMenu = ({ handleClose, anchorRef }: MainMenuProps) => {
  const menu = useMenu();
  const i18Path = 'navbar.';
  const { t: translate } = useTranslation();
  const _MainMenuItems = MainMenuItems();
  const _mainSubMenuTheme = MainSubMenuTheme();
  const _mainSubMenuDevelopers = MainSubMenuDevelopers();
  const _mainSubMenuLanguage = MainSubMenuLanguage();
  const _mainSubMenuShowcases = MainSubMenuShowcases();

  return (
    <>
      <NavbarMenu
        handleClose={handleClose}
        anchorRef={anchorRef}
        open={menu.openMainNavbarMenu}
        setOpen={menu.onOpenNavbarMainMenu}
        isOpenSubMenu={menu.openNavbarSubMenu !== SubMenuKeys.none}
      >
        {_MainMenuItems.map((el, index) => (
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
            isOpenSubMenu={menu.openNavbarSubMenu === SubMenuKeys.none}
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
          subMenuList={_mainSubMenuTheme}
        />

        <SubMenuComponent
          isSubMenu={true}
          label={`${translate(`${i18Path}language.key`)}`}
          triggerSubMenu={SubMenuKeys.language}
          isScrollable={true}
          open={menu.openMainNavbarMenu}
          isOpenSubMenu={menu.openNavbarSubMenu !== SubMenuKeys.none}
          setOpenSubMenu={menu.onOpenNavbarSubMenu}
          subMenuList={_mainSubMenuLanguage}
        />

        <SubMenuComponent
          isSubMenu={true}
          label={`${translate(`${i18Path}navbarMenu.developers`)}`}
          triggerSubMenu={SubMenuKeys.devs}
          isScrollable={true}
          open={menu.openMainNavbarMenu}
          isOpenSubMenu={menu.openNavbarSubMenu !== SubMenuKeys.none}
          setOpenSubMenu={menu.onOpenNavbarSubMenu}
          subMenuList={_mainSubMenuDevelopers}
        />

        <SubMenuComponent
          isSubMenu={true}
          label={`${translate(`${i18Path}developers.showcases`)}`}
          triggerSubMenu={'showcases'}
          isScrollable={true}
          open={menu.openMainNavbarMenu}
          isOpenSubMenu={menu.openNavbarSubMenu !== SubMenuKeys.none}
          setOpenSubMenu={menu.onOpenNavbarSubMenu}
          subMenuList={_mainSubMenuShowcases}
        />
      </NavbarMenu>
      <SupportModal />
    </>
  );
};

export default MainMenu;
