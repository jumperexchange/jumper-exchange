import { Avatar, Typography, useTheme } from '@mui/material';
import type { Wallet } from '@solana/wallet-adapter-react';
import { useMenuStore } from 'src/stores';
import { ConnectButton } from './EcosystemSelectMenu.style';
import { useAccountConnect } from 'src/hooks/useAccounts';

interface SVMConnectButtonProps {
  walletIcon?: string;
  svm: Wallet;
}

export const SVMConnectButton = ({
  walletIcon,
  svm,
}: SVMConnectButtonProps) => {
  const theme = useTheme();
  const { closeAllMenus } = useMenuStore((state) => state);
  const connect = useAccountConnect();

  const connectHandler = async () => {
    connect({ svm });
    closeAllMenus();
  };
  return (
    <ConnectButton onClick={() => connectHandler()}>
      <Avatar src={walletIcon} sx={{ width: '88px', height: '88px' }} />
      <Typography
        sx={{
          color:
            theme.palette.mode === 'dark'
              ? theme.palette.white.main
              : theme.palette.black.main,
          margin: '12px',
        }}
        variant={'lifiBodySmallStrong'}
      >
        Solana
      </Typography>
    </ConnectButton>
  );
};
