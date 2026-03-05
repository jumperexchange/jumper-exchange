import {
  DotsMenuIcon,
  BurgerMenuIcon,
  NavbarMenuToggleButton,
} from './Buttons.style';
import { useRef } from 'react';
import { useMenuStore } from 'src/stores/menu';
import { useMediaQuery } from '@mui/material';
import dynamic from 'next/dynamic';

const MainMenu = dynamic(
  () => import('@/components/Menus/MainMenu/MainMenu').then((m) => m.MainMenu),
  { ssr: false },
);

export const MainMenuToggle = () => {
  const isDesktop = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  const mainMenuAnchor = useRef(null);

  const [openedMenu, openMainMenu, setMainMenuState] = useMenuStore((state) => [
    state.openedMenu,
    state.openMainMenu,
    state.setMainMenuState,
  ]);

  const handleOnOpenNavbarMainMenu = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    const menuOpen = openedMenu();
    setMainMenuState(!menuOpen);
  };

  return (
    <>
      <NavbarMenuToggleButton
        ref={mainMenuAnchor}
        id="main-burger-menu-button"
        aria-label="Main Menu"
        aria-controls="main-burger-menu"
        aria-expanded={openMainMenu}
        aria-haspopup="true"
        onClick={handleOnOpenNavbarMainMenu}
      >
        {isDesktop ? <DotsMenuIcon /> : <BurgerMenuIcon />}
      </NavbarMenuToggleButton>
      {openMainMenu && (
        <MainMenu anchorEl={mainMenuAnchor.current ?? undefined} />
      )}
    </>
  );
};
