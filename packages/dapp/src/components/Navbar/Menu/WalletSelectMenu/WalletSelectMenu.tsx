import { Box } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';
import { MenuKeys, useWalletSelectContent } from '../../../../const';
import { useMenuStore } from '../../../../stores';
import { MenuItemComponent, NavbarMenu } from '../../index';

interface NavbarMenuProps {
  handleClose: (event: MouseEvent | TouchEvent) => void;
  open?: boolean;
}

export const WalletSelectMenu = ({ handleClose, open }: NavbarMenuProps) => {
  const i18Path = 'navbar.';
  const { t: translate } = useTranslation();
  const theme = useTheme();
  const walletSelectMenuItems = useWalletSelectContent();
  const [
    openNavbarWalletSelectMenu,
    onOpenNavbarWalletSelectMenu,
    onOpenNavbarSubMenu,
    openNavbarSubMenu,
  ] = useMenuStore(
    (state) => [
      state.openNavbarWalletSelectMenu,
      state.onOpenNavbarWalletSelectMenu,
      state.onOpenNavbarSubMenu,
      state.openNavbarSubMenu,
    ],
    shallow,
  );

  return (
    <NavbarMenu
      handleClose={handleClose}
      label={`${translate(`${i18Path}chooseWallet`)}`}
      open={openNavbarWalletSelectMenu}
      hideBackArrow={true}
      setOpen={onOpenNavbarWalletSelectMenu}
      isOpenSubMenu={openNavbarSubMenu === MenuKeys.WalletSelect}
    >
      {!!walletSelectMenuItems.length ? (
        walletSelectMenuItems.map((el, index) => (
          <MenuItemComponent
            key={`${el.label}-${index}`}
            label={el.label}
            triggerSubMenu={MenuKeys.WalletSelect}
            showButton={el.showButton}
            showMoreIcon={el.showMoreIcon}
            prefixIcon={el.prefixIcon}
            onClick={el.onClick}
            open={!!open ? open : openNavbarWalletSelectMenu}
            isOpenSubMenu={openNavbarSubMenu !== MenuKeys.WalletSelect}
            setOpenSubMenu={onOpenNavbarSubMenu}
          />
        ))
      ) : (
        <Box textAlign={'center'} mt={theme.spacing(2)}>
          <CircularProgress />
        </Box>
      )}
    </NavbarMenu>
  );
};
