import { useTranslation } from 'react-i18next';
import { PopperItem, PopperMenu, PopperSubMenu } from 'src/components';
import {
  MenuKeys,
  useDevelopersContent,
  useLanguagesContent,
  useMainMenuContent,
  useThemeContent,
} from 'src/const';
import { useMenuStore } from 'src/stores';
interface MainMenuProps {
  handleClose: (event: MouseEvent | TouchEvent) => void;
}

export const MainMenu = ({ handleClose }: MainMenuProps) => {
  const { t } = useTranslation();
  const mainMenuItems = useMainMenuContent();
  const mainSubMenuTheme = useThemeContent();
  const mainSubMenuDevelopers = useDevelopersContent();
  const mainSubMenuLanguage = useLanguagesContent();
  const [openMainPopperMenu, onOpenNavbarMainMenu, openPopperSubMenu] =
    useMenuStore((state) => [
      state.openMainPopperMenu,
      state.onOpenNavbarMainMenu,
      state.openPopperSubMenu,
    ]);

  return openMainPopperMenu ? (
    <PopperMenu
      handleClose={handleClose}
      open
      transformOrigin={'top right'}
      setOpen={onOpenNavbarMainMenu}
      isOpenSubMenu={openPopperSubMenu !== MenuKeys.None}
    >
      {openPopperSubMenu === MenuKeys.None &&
        mainMenuItems.map((el, index) => (
          <PopperItem
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
      <PopperSubMenu
        label={t('navbar.navbarMenu.theme')}
        triggerSubMenu={MenuKeys.Themes}
        open={openPopperSubMenu === MenuKeys.Themes}
        prevMenu={MenuKeys.None}
        subMenuList={mainSubMenuTheme}
      />

      <PopperSubMenu
        label={t('language.key', { ns: 'language' })}
        triggerSubMenu={MenuKeys.Language}
        open={openPopperSubMenu === MenuKeys.Language}
        prevMenu={MenuKeys.None}
        subMenuList={mainSubMenuLanguage}
      />

      <PopperSubMenu
        label={t('navbar.navbarMenu.developers')}
        triggerSubMenu={MenuKeys.Devs}
        open={openPopperSubMenu === MenuKeys.Devs}
        prevMenu={MenuKeys.None}
        subMenuList={mainSubMenuDevelopers}
      />
    </PopperMenu>
  ) : null;
};
