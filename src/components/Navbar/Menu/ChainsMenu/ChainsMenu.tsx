import CheckIcon from '@mui/icons-material/Check';
import { Box } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { MenuItemComponent, NavbarMenu } from 'src/components';
import { useChainsContent } from 'src/const';
import { useWallet } from 'src/providers';
import { useMenuStore } from 'src/stores';

interface NavbarMenuProps {
  handleClose: (event: MouseEvent | TouchEvent) => void;
  open?: boolean;
}

export const ChainsMenu = ({ handleClose, open }: NavbarMenuProps) => {
  const { t } = useTranslation();
  const chains = useChainsContent();
  const theme = useTheme();
  const { account } = useWallet();
  const [openNavbarChainsMenu, onOpenNavbarChainsMenu] = useMenuStore(
    (state) => [state.openNavbarChainsMenu, state.onOpenNavbarChainsMenu],
  );

  return openNavbarChainsMenu ? (
    <NavbarMenu
      handleClose={handleClose}
      label={t('navbar.walletMenu.chains')}
      transformOrigin={'top'}
      open
      setOpen={onOpenNavbarChainsMenu}
    >
      {chains.length ? (
        chains.map((el, index) => (
          <MenuItemComponent
            key={`${el.label}-${index}`}
            label={el.label}
            showButton={el.showButton ? el.showButton : false}
            showMoreIcon={false}
            suffixIcon={
              el.chainId && el.chainId === account.chainId ? (
                <CheckIcon />
              ) : undefined
            }
            prefixIcon={el.prefixIcon}
            onClick={el.onClick}
            open={openNavbarChainsMenu}
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
