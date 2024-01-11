import { Stack, Typography, useTheme } from '@mui/material';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, WalletButton } from 'src/components';
import { MenuKeys } from 'src/const';
// import { useWallet } from 'src/providers';
import { useMenuStore } from 'src/stores';
import { useAccounts } from 'src/hooks/useAccounts';
import { WalletCard } from './WalletCard';
interface MenuProps {
  handleClose: (event: MouseEvent | TouchEvent) => void;
}

export const WalletMenu = ({ handleClose }: MenuProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const { accounts } = useAccounts();

  const {
    openWalletMenu,
    onOpenWalletMenu,
    onOpenSnackbar,
    openSubMenu,
    onCloseAllMenus,
    onOpenWalletSelectMenu,
  } = useMenuStore((state) => state);

  useEffect(() => {
    openWalletMenu! && onOpenSnackbar(false);
  }, [onOpenSnackbar, openWalletMenu]);

  return openWalletMenu ? (
    <Menu
      open
      transformOrigin={'top left'}
      setOpen={onOpenWalletMenu}
      handleClose={handleClose}
      isOpenSubMenu={openSubMenu !== MenuKeys.None}
      width={'auto'}
      styles={{
        background: theme.palette.surface1.main,
        padding: '16px',
      }}
    >
      <Stack
        spacing={2}
        sx={{ padding: '0 !important', margin: '0 !important' }}
      >
        {accounts.map((account) =>
          account.isConnected ? (
            <WalletCard key={account.address} account={account} />
          ) : null,
        )}
        <WalletButton
          sx={{ width: '324px' }}
          onClick={() => {
            onCloseAllMenus();
            onOpenWalletSelectMenu(true);
          }}
        >
          <Typography
            sx={{
              color: isDarkMode
                ? theme.palette.white.main
                : theme.palette.black.main,
            }}
            variant="lifiBodySmallStrong"
          >
            {t('navbar.walletMenu.connectAnotherWallet')}
          </Typography>
        </WalletButton>
      </Stack>
    </Menu>
  ) : null;
};
