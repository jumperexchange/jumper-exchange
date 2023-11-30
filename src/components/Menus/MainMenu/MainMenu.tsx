import { useTranslation } from 'react-i18next';
import {
  PopperItem,
  PopperMenu,
  PopperSubMenu,
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
  const [openMainMenuPopper, onOpenMainMenuPopper, openSubMenuPopper] =
    useMenuStore((state) => [
      state.openMainMenuPopper,
      state.onOpenMainMenuPopper,
      state.openSubMenuPopper,
    ]);

  return openMainMenuPopper ? (
    <PopperMenu
      handleClose={handleClose}
      open
      transformOrigin={'top right'}
      setOpen={onOpenMainMenuPopper}
      isOpenSubMenu={openSubMenuPopper !== MenuKeys.None}
    >
      {openSubMenuPopper === MenuKeys.None &&
        mainMenuItems.map((el, index) => (
          <PopperItem
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

      <PopperSubMenu
        label={t('language.key', { ns: 'language' })}
        triggerSubMenu={MenuKeys.Language}
        open={openSubMenuPopper === MenuKeys.Language}
        prevMenu={MenuKeys.None}
        subMenuList={mainSubMenuLanguage}
      />

      <PopperSubMenu
        label={t('navbar.navbarMenu.developers')}
        triggerSubMenu={MenuKeys.Devs}
        open={openSubMenuPopper === MenuKeys.Devs}
        prevMenu={MenuKeys.None}
        subMenuList={mainSubMenuDevelopers}
      />
    </PopperMenu>
  ) : null;
};
