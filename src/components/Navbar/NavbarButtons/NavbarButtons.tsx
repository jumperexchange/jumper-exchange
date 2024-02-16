import MenuIcon from '@mui/icons-material/Menu';
import { Typography } from '@mui/material';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from 'src/const';
import { useAccounts, useChains, useUserTracking } from 'src/hooks';
import { useMenuStore, useSettingsStore } from 'src/stores';
import { EventTrackingTool } from 'src/types';
import { NavbarButtonsContainer, WalletManagementButtons } from '.';
import { MainMenu, MenuToggle } from '../..';

export const NavbarButtons = () => {
  const mainMenuAnchor = useRef<any>(null);
  const { trackEvent } = useUserTracking();

  const onWalletDisconnect = useSettingsStore(
    (state) => state.onWalletDisconnect,
  );

  const [openMainMenu, setMainMenuState] = useMenuStore((state) => [
    state.openMainMenu,
    state.setMainMenuState,
  ]);

  const { t } = useTranslation();
  const { account } = useAccounts();
  if (!account.isConnected) {
    onWalletDisconnect();
  }

  // return focus to the button when we transitioned from !open -> open
  const prevMainMenu = useRef(openMainMenu);
  useEffect(() => {
    if (prevMainMenu.current === true && openMainMenu === false) {
      mainMenuAnchor!.current.focus();
    }

    prevMainMenu.current = openMainMenu;
  }, [openMainMenu]);

  const { isSuccess } = useChains();

  const handleOnOpenNavbarMainMenu = () => {
    trackEvent({
      category: TrackingCategory.Menu,
      action: TrackingAction.OpenMenu,
      label: 'open_main_menu',
      data: { [TrackingEventParameter.Menu]: 'main_menu' },
      disableTrackingTool: [EventTrackingTool.ARCx, EventTrackingTool.Cookie3],
    });
  };

  return (
    <NavbarButtonsContainer className="settings">
      <WalletManagementButtons
        connectButtonLabel={
          <Typography
            variant={'lifiBodyMediumStrong'}
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: '2',
              WebkitBoxOrient: 'vertical',
            }}
          >
            {t('navbar.connect')}
          </Typography>
        }
        isSuccess={isSuccess}
      />

      <MenuToggle
        ref={mainMenuAnchor}
        id="main-burger-menu-button"
        aria-controls={openMainMenu ? 'main-burger-menu' : undefined}
        aria-expanded={openMainMenu ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleOnOpenNavbarMainMenu}
      >
        <MenuIcon
          sx={{
            fontSize: '32px',
            color: 'inherit',
          }}
        />
      </MenuToggle>
      <MainMenu anchorEl={mainMenuAnchor.current} />
    </NavbarButtonsContainer>
  );
};
