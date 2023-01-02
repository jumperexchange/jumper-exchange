import { Box } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { WalletMenuItems } from '../../../const';
import { useMenu } from '../../../providers/MenuProvider';
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
  const menu = useMenu();
  const _walletMenuItems = WalletMenuItems();

  return (
    <NavbarMenu
      handleClose={handleClose}
      label={`${translate(`${i18Path}ChooseWallet`)}`}
      anchorRef={anchorRef}
      bgColor={theme.palette.surface2.main}
      isScrollable={true}
      scrollableMainLayer={true}
      open={menu.openNavbarWalletMenu}
      setOpen={menu.onOpenNavbarWalletMenu}
      openSubMenu={menu.openNavbarSubMenu}
    >
      {!!_walletMenuItems.length ? (
        _walletMenuItems.map((el, index) => (
          <MenuItemComponent
            key={`${el.label}-${index}`}
            label={el.label}
            listIcon={el.listIcon}
            isScrollable={true}
            bgColor={theme.palette.surface2.main}
            triggerSubMenu={'wallets'}
            showButton={el.showButton}
            extraIcon={el.extraIcon}
            onClick={el.onClick}
            open={!!open ? open : menu.openNavbarWalletMenu}
            openSubMenu={menu.openNavbarSubMenu}
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

export default WalletMenu;
