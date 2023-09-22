import { Box } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { PopperItem, PopperMenu } from 'src/components';
import { MenuKeys, useWalletSelectContent } from 'src/const';
import { useMenuStore } from 'src/stores';

interface PopperMenuProps {
  handleClose: (event: MouseEvent | TouchEvent) => void;
  open?: boolean;
}

export const WalletSelectMenu = ({ handleClose, open }: PopperMenuProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const walletSelectMenuItems = useWalletSelectContent();
  const [
    openNavbarWalletSelectMenu,
    onOpenNavbarWalletSelectMenu,
    openPopperSubMenu,
  ] = useMenuStore((state) => [
    state.openNavbarWalletSelectMenu,
    state.onOpenNavbarWalletSelectMenu,
    state.openPopperSubMenu,
  ]);

  return (
    <PopperMenu
      handleClose={handleClose}
      label={t('navbar.chooseWallet')}
      open={openNavbarWalletSelectMenu}
      transformOrigin={'top'}
      setOpen={onOpenNavbarWalletSelectMenu}
      isOpenSubMenu={openPopperSubMenu === MenuKeys.WalletSelect}
    >
      {!!walletSelectMenuItems.length ? (
        walletSelectMenuItems.map((el, index) => (
          <PopperItem
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
    </PopperMenu>
  );
};
