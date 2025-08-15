import { MainMenu } from 'src/components/Menus/MainMenu';
import { DotsMenuIcon, NavbarMenuToggleButton } from './Buttons.style';
import { useRef, useEffect } from 'react';
import { useMenuStore } from 'src/stores/menu';

export const MainMenuToggle = () => {
  const mainMenuAnchor = useRef(null);

  const [openedMenu, openMainMenu, setMainMenuState] = useMenuStore((state) => [
    state.openedMenu,
    state.openMainMenu,
    state.setMainMenuState,
  ]);
  // return focus to the button when we transitioned from !open -> open
  const prevMainMenu = useRef(openMainMenu);
  useEffect(() => {
    if (prevMainMenu.current === true && openMainMenu === false) {
      mainMenuAnchor.current && (mainMenuAnchor.current as HTMLElement).focus();
    }

    prevMainMenu.current = openMainMenu;
  }, [openMainMenu]);

  const handleOnOpenNavbarMainMenu = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    const menuOpen = openedMenu();
    if (menuOpen) {
      setMainMenuState(false);
    } else {
      setMainMenuState(true);
    }
  };

  return (
    <>
      <NavbarMenuToggleButton
        ref={mainMenuAnchor}
        id="main-burger-menu-button"
        aria-label="Main Menu"
        aria-controls={openMainMenu ? 'main-burger-menu' : undefined}
        aria-expanded={openMainMenu ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleOnOpenNavbarMainMenu}
      >
        <DotsMenuIcon />
      </NavbarMenuToggleButton>
      <MainMenu anchorEl={mainMenuAnchor.current ?? undefined} />
    </>
  );
};
