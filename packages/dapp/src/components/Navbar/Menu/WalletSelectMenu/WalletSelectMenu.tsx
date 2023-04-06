import { Box } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { SubMenuKeys, useWalletSelectMenuItems } from '../../../../const';
import { useMenu } from '../../../../providers/MenuProvider';
import { MenuItemComponent, NavbarMenu } from '../../index';

interface NavbarMenuProps {
  handleClose: (event: MouseEvent | TouchEvent) => void;
  open?: boolean;
}

export const WalletSelectMenu = ({ handleClose, open }: NavbarMenuProps) => {
  const i18Path = 'navbar.';
  const { t: translate } = useTranslation();
  const theme = useTheme();
  const menu = useMenu();
  const _walletSelectMenuItems = useWalletSelectMenuItems();
  return (
    <NavbarMenu
      handleClose={handleClose}
      label={`${translate(`${i18Path}chooseWallet`)}`}
      hideBackArrow={true}
      open={menu.openNavbarWalletSelectMenu}
      setOpen={menu.onOpenNavbarWalletSelectMenu}
      isOpenSubMenu={menu.openNavbarSubMenu === SubMenuKeys.walletSelect}
    >
      {!!_walletSelectMenuItems.length ? (
        _walletSelectMenuItems.map((el, index) => (
          <MenuItemComponent
            key={`${el.label}-${index}`}
            label={el.label}
            triggerSubMenu={SubMenuKeys.walletSelect}
            showButton={el.showButton}
            showMoreIcon={el.showMoreIcon}
            prefixIcon={el.prefixIcon}
            onClick={el.onClick}
            open={!!open ? open : menu.openNavbarWalletSelectMenu}
            isOpenSubMenu={menu.openNavbarSubMenu !== SubMenuKeys.walletSelect}
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
