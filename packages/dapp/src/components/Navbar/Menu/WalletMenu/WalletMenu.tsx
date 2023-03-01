import { Box } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { SubMenuKeys, useWalletMenuItems } from '../../../../const';
import { useMenu } from '../../../../providers/MenuProvider';
import { MenuItemComponent, NavbarMenu } from '../../index';

interface NavbarMenuProps {
  handleClose: (event: MouseEvent | TouchEvent) => void;
  open?: boolean;
}

export const WalletMenu = ({ handleClose, open }: NavbarMenuProps) => {
  const i18Path = 'navbar.';
  const { t: translate } = useTranslation();
  const theme = useTheme();
  const menu = useMenu();
  const _walletMenuItems = useWalletMenuItems();
  return (
    <NavbarMenu
      handleClose={handleClose}
      label={`${translate(`${i18Path}chooseWallet`)}`}
      hideBackArrow={true}
      isScrollable={true}
      open={menu.openNavbarWalletMenu}
      setOpen={menu.onOpenNavbarWalletMenu}
      isOpenSubMenu={menu.openNavbarSubMenu === SubMenuKeys.wallets}
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
            open={!!open ? open : menu.openNavbarWalletMenu}
            isOpenSubMenu={menu.openNavbarSubMenu !== SubMenuKeys.wallets}
            setOpenSubMenu={menu.onOpenNavbarSubMenu}
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
