import CheckIcon from '@mui/icons-material/Check';
import { Box } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { SubMenuKeys } from '../../../../const';
import { useGetChains } from '../../../../hooks';
import { useMenu } from '../../../../providers/MenuProvider';
import { useWallet } from '../../../../providers/WalletProvider';
import MenuItemComponent from '../../MenuItemComponent';
import { NavbarMenu } from '../../index';

interface NavbarMenuProps {
  handleClose: (event: MouseEvent | TouchEvent) => void;
  open?: boolean;
}

export const ChainsMenu = ({ handleClose, open }: NavbarMenuProps) => {
  const i18Path = 'navbar.walletMenu.';
  const { t: translate } = useTranslation();
  const menu = useMenu();
  const chains = useGetChains();
  const theme = useTheme();
  const { account } = useWallet();

  return (
    <NavbarMenu
      handleClose={handleClose}
      label={`${translate(`${i18Path}chains`)}`}
      hideBackArrow={true}
      open={menu.openNavbarChainsMenu}
      setOpen={menu.onOpenNavbarChainsMenu}
      isOpenSubMenu={menu.openNavbarSubMenu === SubMenuKeys.chains}
    >
      {!!chains.length ? (
        chains.map((el, index) => (
          <MenuItemComponent
            key={`${el.label}-${index}`}
            label={el.label}
            triggerSubMenu={SubMenuKeys.chains}
            showButton={el.showButton}
            showMoreIcon={false}
            suffixIcon={el.chainId === account.chainId && <CheckIcon />}
            prefixIcon={el.prefixIcon}
            onClick={el.onClick}
            open={!!open ? open : menu.openNavbarChainsMenu}
            isOpenSubMenu={menu.openNavbarSubMenu !== SubMenuKeys.chains}
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
