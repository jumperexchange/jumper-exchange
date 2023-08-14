import { Box } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { useTheme } from '@mui/material/styles';
import { MenuKeys, useWalletSelectContent } from '@transferto/dapp/src/const';
import { useMenuStore } from '@transferto/dapp/src/stores';
import { useTranslation } from 'react-i18next';
import { MenuItemComponent, NavbarMenu } from '../../index';

interface NavbarMenuProps {
  handleClose: (event: MouseEvent | TouchEvent) => void;
  open?: boolean;
}

export const WalletSelectMenu = ({ handleClose, open }: NavbarMenuProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const walletSelectMenuItems = useWalletSelectContent();
  const [
    openNavbarWalletSelectMenu,
    onOpenNavbarWalletSelectMenu,
    openNavbarSubMenu,
  ] = useMenuStore((state) => [
    state.openNavbarWalletSelectMenu,
    state.onOpenNavbarWalletSelectMenu,
    state.openNavbarSubMenu,
  ]);

  return (
    <NavbarMenu
      handleClose={handleClose}
      label={t('navbar.chooseWallet')}
      open={openNavbarWalletSelectMenu}
      transformOrigin={'top'}
      setOpen={onOpenNavbarWalletSelectMenu}
      isOpenSubMenu={openNavbarSubMenu === MenuKeys.WalletSelect}
    >
      {!!walletSelectMenuItems.length ? (
        walletSelectMenuItems.map((el, index) => (
          <MenuItemComponent
            key={`${el.label}-${index}`}
            label={`${el.label || ' '}`}
            triggerSubMenu={MenuKeys.WalletSelect}
            showButton={el.showButton || false}
            showMoreIcon={el.showMoreIcon}
            prefixIcon={el.prefixIcon}
            onClick={el.onClick}
            open={open || openNavbarWalletSelectMenu}
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
