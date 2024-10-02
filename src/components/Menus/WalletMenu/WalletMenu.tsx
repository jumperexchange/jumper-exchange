import Portfolio from '@/components/Portfolio/Portfolio';
import { useAccounts } from '@/hooks/useAccounts';
import { useMenuStore } from '@/stores/menu';
import CloseIcon from '@mui/icons-material/Close';
import {
  alpha,
  Collapse,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CollapseContainer, WalletButton } from '.';
import { WalletCardV2 } from './WalletCardV2';

interface WalletMenuProps {
  anchorEl?: HTMLAnchorElement;
}

export const WalletMenu = ({ anchorEl }: WalletMenuProps) => {
  const { t } = useTranslation();
  const { accounts } = useAccounts();
  const theme = useTheme();
  const {
    openWalletMenu,
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
    <Collapse
      in={openWalletMenu}
      easing={'ease-in-out'}
      orientation="horizontal"
      mountOnEnter
      unmountOnExit
      sx={{ position: 'absolute', right: 0, top: 0 }}
    >
      <CollapseContainer sx={{ width: 'auto' }}>
        <Stack direction="row" justifyContent="space-between">
          <IconButton
            aria-label="close"
            onClick={() => setWalletMenuState(false)}
            sx={{
              color: theme.palette.text.primary,
              '&:hover': {
                backgroundColor: alpha(theme.palette.text.primary, 0.04),
              },
            }}
            color="primary"
          >
            <CloseIcon />
          </IconButton>
          <WalletButton
            sx={{ width: 'auto' }}
            onClick={() => {
              setWalletSelectMenuState(true, false);
            }}
          >
            <Typography
              sx={{
                color: theme.palette.text.primary,
              }}
              variant="bodySmallStrong"
            >
              {t('navbar.walletMenu.connectAnotherWallet')}
            </Typography>
          </WalletButton>
        </Stack>
        {accounts.map(
          (account) =>
            account.isConnected && (
              <WalletCardV2 key={account.address} account={account} />
            ),
        )}
        <Portfolio />
      </CollapseContainer>
    </Collapse>
  );
};
