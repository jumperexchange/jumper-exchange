import { useAccounts } from '@/hooks/useAccounts';
import { useMenuStore } from '@/stores/menu';
import { Drawer, Menu, Stack, Typography, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { WalletButton } from '.';
import { WalletCard } from './WalletCard';
import Portfolio from '@/components/Portfolio/Portfolio';
import { WalletSelectMenu } from '@/components/Menus';
import WalletSelectMenuContent from '@/components/Menus/WalletSelectMenu/WalletSelectMenuContent';
import { MenuKeysEnum } from '@/const/menuKeys';
import { Box } from '@mui/system';
import { MenuPaper } from '@/components/Menu';

interface WalletMenuProps {
  anchorEl?: HTMLAnchorElement;
}

export const WalletMenu = ({ anchorEl }: WalletMenuProps) => {
  const { t } = useTranslation();
  const { accounts } = useAccounts();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);
  const isDarkMode = theme.palette.mode === 'dark';
  const {
    isPopper,
    openWalletMenu,
    openWalletSelectMenu,
    openSubMenu,
    setWalletMenuState,
    setSnackbarState,
    setWalletSelectMenuState,
  } = useMenuStore((state) => state);

  useEffect(() => {
    openWalletMenu! && setSnackbarState(false);
  }, [setSnackbarState, openWalletMenu]);

  useEffect(() => {
    if (
      openWalletMenu &&
      accounts.every((account) => account.status === 'disconnected')
    ) {
      setWalletMenuState(false);
    }
  }, [accounts, setWalletMenuState, openWalletMenu]);

  return (
    <Drawer
      anchor="right"
      open={openWalletMenu}
      onClose={() => {
        setWalletMenuState(false);
        setOpen(false);
      }}
      PaperProps={{
        sx: (theme) => ({
          width: '100%',
          padding: '1.25rem',
          gap: '32px',
          maxWidth: 450,
          background: theme.palette.background.default,
        }),
      }}
      sx={{
        zIndex: 1500,
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
        {openWalletSelectMenu && !isPopper ? (
          <MenuPaper show={openWalletSelectMenu && !isPopper}>
            <Box
              component="ul"
              sx={{
                display: 'grid',
                gridTemplateColumns:
                  openSubMenu === MenuKeysEnum.EcosystemSelect
                    ? '1fr 1fr'
                    : '1fr 1fr 1fr',
                justifyItems: 'center',
                ul: {
                  gridColumnStart: 1,
                  gridColumnEnd:
                    openSubMenu === MenuKeysEnum.EcosystemSelect ? 3 : 4,
                },
                padding: 0,
                gap: 2,
              }}
            >
              <WalletSelectMenuContent
                openWalletSelectMenu={openWalletSelectMenu && !isPopper}
                showAllButton={false}
              />
            </Box>
          </MenuPaper>
        ) : (
          <WalletButton
            sx={{ width: '100%' }}
            onClick={() => {
              setWalletSelectMenuState(true, false);
            }}
          >
            <Typography
              sx={{
                color: isDarkMode
                  ? theme.palette.white.main
                  : theme.palette.black.main,
              }}
              variant="bodySmallStrong"
            >
              {t('navbar.walletMenu.connectAnotherWallet')}
            </Typography>
          </WalletButton>
        )}
      </Stack>
      <Portfolio />
    </Drawer>
  );
};
