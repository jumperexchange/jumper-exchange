import { Box } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { useTheme } from '@mui/material/styles';
import { useSettings } from '@transferto/shared/src/hooks';
import { useTranslation } from 'react-i18next';
import { WalletMenuItems } from '../../../const';
import { MenuItemComponent, NavbarMenu } from '../index';

interface NavbarMenuProps {
  anchorRef: any; // TODO: Replace this any with the correct type
  handleClose: (event: MouseEvent | TouchEvent) => void;
  open?: boolean;
}

const WalletMenu = ({ handleClose, anchorRef, open }: NavbarMenuProps) => {
  const i18Path = 'Navbar.';
  const { t: translate } = useTranslation();
  const theme = useTheme();
  const settings = useSettings();
  const _walletMenuItems = WalletMenuItems();

  return (
    <NavbarMenu
      handleClose={handleClose}
      label={`${translate(`${i18Path}ChooseWallet`)}`}
      anchorRef={anchorRef}
      scrollableMainLayer={true}
      open={settings.openNavbarWalletMenu}
      setOpen={settings.onOpenNavbarWalletMenu}
      openSubMenu={settings.openNavbarSubMenu}
    >
      {!!_walletMenuItems.length ? (
        _walletMenuItems.map((el, index) => (
          <MenuItemComponent
            key={`${el.label}-${index}`}
            label={el.label}
            listIcon={el.listIcon}
            stickyLabel={true}
            triggerSubMenu={'wallets'}
            showButton={el.showButton}
            extraIcon={el.extraIcon}
            onClick={el.onClick}
            open={!!open ? open : settings.openNavbarWalletMenu}
            openSubMenu={settings.openNavbarSubMenu}
            setOpenSubMenu={settings.onOpenNavbarSubMenu}
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

export default WalletMenu;
