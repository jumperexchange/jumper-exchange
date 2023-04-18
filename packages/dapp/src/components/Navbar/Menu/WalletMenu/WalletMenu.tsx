import { Box } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';
import { SubMenuKeys, useWalletMenuItems } from '../../../../const';
import { useMenuStore } from '../../../../stores/menu';
import { MenuItemComponent, NavbarMenu } from '../../index';

interface NavbarMenuProps {
  handleClose: (event: MouseEvent | TouchEvent) => void;
  open?: boolean;
}

export const WalletMenu = ({ handleClose, open }: NavbarMenuProps) => {
  const i18Path = 'navbar.';
  const { t: translate } = useTranslation();
  const theme = useTheme();

  const [
    openNavbarWalletSelectMenu,
    onOpenNavbarWalletSelectMenu,
    openNavbarSubMenu,
    onOpenNavbarSubMenu,
  ] = useMenuStore(
    (state) => [
      state.openNavbarWalletSelectMenu,
      state.onOpenNavbarWalletSelectMenu,
      state.openNavbarSubMenu,
      state.onOpenNavbarSubMenu,
    ],
    shallow,
  );

  const _walletMenuItems = useWalletMenuItems();
  return (
    <NavbarMenu
      handleClose={handleClose}
      label={`${translate(`${i18Path}chooseWallet`)}`}
      isScrollable={true}
      open={openNavbarWalletSelectMenu}
      setOpen={onOpenNavbarWalletSelectMenu}
      isOpenSubMenu={openNavbarSubMenu === SubMenuKeys.wallets}
    >
      {!!_walletMenuItems.length ? (
        _walletMenuItems.map((el, index) => (
          <MenuItemComponent
            key={`${el.label}-${index}`}
            label={el.label}
            isScrollable={true}
            triggerSubMenu={SubMenuKeys.wallets}
            showButton={el.showButton}
            showMoreIcon={el.showMoreIcon}
            prefixIcon={el.prefixIcon}
            onClick={el.onClick}
            open={!!open ? open : openNavbarWalletSelectMenu}
            isOpenSubMenu={openNavbarSubMenu !== SubMenuKeys.wallets}
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
