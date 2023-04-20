import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';
import {
  MenuKeys,
  MenuSub,
  useMainMenuItems,
  useMainSubMenuDevelopers,
  useMainSubMenuLanguage,
  useMainSubMenuShowcases,
  useMainSubMenuTheme,
} from '../../../../const';
import { useMenuStore } from '../../../../stores';
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
  console.log(
    'test',
    openNavbarSubMenu === MenuKeys.None,
    'openNavbarSubMenu',
    openNavbarSubMenu,
  );
  console.log('openNavbarSubMenu', openNavbarSubMenu);
  console.log('openMainNavbarMenu', openMainNavbarMenu);
  return openMainNavbarMenu ? (
    <>
      <NavbarMenu
        handleClose={handleClose}
        open={true}
        setOpen={onOpenNavbarMainMenu}
        isOpenSubMenu={openNavbarSubMenu !== MenuKeys.None}
      >
        {openNavbarSubMenu === MenuKeys.None &&
          mainMenuItems.map((el, index) => (
            <MenuItemComponent
              key={`${el.label}-${index}`}
              label={el.label}
              prefixIcon={el.prefixIcon}
              triggerSubMenu={el.triggerSubMenu}
              showButton={el.showButton}
              showMoreIcon={el.showMoreIcon}
              suffixIcon={el.suffixIcon}
              onClick={el.onClick}
              open={true}
              setOpenSubMenu={onOpenNavbarSubMenu}
              isOpenSubMenu={openNavbarSubMenu !== MenuSub.None}
            />
          ))}
        <SubMenuComponent
          label={`${translate(`${i18Path}navbarMenu.theme`)}`}
          triggerSubMenu={MenuKeys.Themes}
          open={openNavbarSubMenu === MenuKeys.Themes}
          prevMenu={MenuKeys.None}
          subMenuList={mainSubMenuTheme}
        />

        <SubMenuComponent
          label={`${translate(`${i18Path}language.key`)}`}
          triggerSubMenu={MenuKeys.Language}
          open={openNavbarSubMenu === MenuKeys.Language}
          prevMenu={MenuKeys.None}
          subMenuList={mainSubMenuLanguage}
        />

        <SubMenuComponent
          label={`${translate(`${i18Path}navbarMenu.developers`)}`}
          triggerSubMenu={MenuKeys.Devs}
          open={openNavbarSubMenu === MenuKeys.Devs}
          prevMenu={MenuKeys.None}
          subMenuList={mainSubMenuDevelopers}
        />

        <SubMenuComponent
          label={`${translate(`${i18Path}developers.showcases`)}`}
          triggerSubMenu={MenuKeys.Showcases}
          open={openNavbarSubMenu === MenuKeys.Showcases}
          prevMenu={MenuKeys.Devs}
          subMenuList={mainSubMenuShowcases}
        />
      </NavbarMenu>
    </>
  ) : null;
};
