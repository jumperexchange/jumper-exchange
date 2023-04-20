import CheckIcon from '@mui/icons-material/Check';
import { Box } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';
import { MenuKeys } from '../../../../const';
import { useGetChains } from '../../../../hooks';
import { useWallet } from '../../../../providers/WalletProvider';
import { useMenuStore } from '../../../../stores';
import MenuItemComponent from '../../MenuItemComponent';
import { NavbarMenu } from '../../index';

interface NavbarMenuProps {
  handleClose: (event: MouseEvent | TouchEvent) => void;
  open?: boolean;
}

export const ChainsMenu = ({ handleClose, open }: NavbarMenuProps) => {
  const i18Path = 'navbar.walletMenu.';
  const { t: translate } = useTranslation();
  const chains = useGetChains();
  const theme = useTheme();
  const { account } = useWallet();
  const [
    openNavbarChainsMenu,
    onOpenNavbarChainsMenu,
    openNavbarSubMenu,
    onOpenNavbarSubMenu,
  ] = useMenuStore(
    (state) => [
      state.openNavbarChainsMenu,
      state.onOpenNavbarChainsMenu,
      state.openNavbarSubMenu,
      state.onOpenNavbarSubMenu,
    ],
    shallow,
  );

  return !!openNavbarChainsMenu ? (
    <NavbarMenu
      handleClose={handleClose}
      label={`${translate(`${i18Path}chains`)}`}
      open={true}
      hideBackArrow={true}
      setOpen={onOpenNavbarChainsMenu}
    >
      {chains.length ? (
        chains.map((el, index) => (
          <MenuItemComponent
            key={`${el.label}-${index}`}
            label={el.label}
            showButton={el.showButton}
            showMoreIcon={false}
            suffixIcon={el.chainId === account.chainId && <CheckIcon />}
            prefixIcon={el.prefixIcon}
            onClick={el.onClick}
            open={openNavbarChainsMenu}
            isOpenSubMenu={openNavbarSubMenu === MenuKeys.Chains}
            setOpenSubMenu={onOpenNavbarSubMenu}
          />
        ))
      ) : (
        <Box textAlign={'center'} mt={theme.spacing(2)}>
          <CircularProgress />
        </Box>
      )}
    </NavbarMenu>
  ) : null;
};
