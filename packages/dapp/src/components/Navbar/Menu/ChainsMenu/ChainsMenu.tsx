import CheckIcon from '@mui/icons-material/Check';
import { Box } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { useTheme } from '@mui/material/styles';
import { useChainsContent } from '@transferto/dapp/src/const';
import { useWallet } from '@transferto/dapp/src/providers/WalletProvider';
import { useMenuStore } from '@transferto/dapp/src/stores';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';
import MenuItemComponent from '../../MenuItemComponent';
import { NavbarMenu } from '../../index';

interface NavbarMenuProps {
  handleClose: (event: MouseEvent | TouchEvent) => void;
  open?: boolean;
}

export const ChainsMenu = ({ handleClose, open }: NavbarMenuProps) => {
  const i18Path = 'navbar.walletMenu.';
  const { t: translate } = useTranslation();
  const chains = useChainsContent();
  const theme = useTheme();
  const { account } = useWallet();
  const [openNavbarChainsMenu, onOpenNavbarChainsMenu, onOpenNavbarSubMenu] =
    useMenuStore(
      (state) => [
        state.openNavbarChainsMenu,
        state.onOpenNavbarChainsMenu,
        state.onOpenNavbarSubMenu,
      ],
      shallow,
    );

  return !!openNavbarChainsMenu ? (
    <NavbarMenu
      handleClose={handleClose}
      label={translate(`${i18Path}chains`)}
      transformOrigin={'top'}
      open={true}
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
