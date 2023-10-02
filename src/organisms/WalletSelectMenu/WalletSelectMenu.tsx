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
  const [openWalletSelectPopper, onOpenWalletSelectPopper, openSubMenuPopper] =
    useMenuStore((state) => [
      state.openWalletSelectPopper,
      state.onOpenWalletSelectPopper,
      state.openSubMenuPopper,
    ]);

  return (
    <PopperMenu
      handleClose={handleClose}
      label={t('navbar.chooseWallet')}
      open={openWalletSelectPopper}
      transformOrigin={'top'}
      setOpen={onOpenWalletSelectPopper}
      isOpenSubMenu={openSubMenuPopper === MenuKeys.WalletSelect}
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
            open={open || openWalletSelectPopper}
          />
        ))
      ) : (
        <Box textAlign={'center'} mt={theme.spacing(1)}>
          <CircularProgress />
        </Box>
      )}
    </PopperMenu>
  );
};
