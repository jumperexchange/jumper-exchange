import { Avatar, Button, Typography, useTheme } from '@mui/material';
import type { Wallet } from '@solana/wallet-adapter-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useMenuStore } from 'src/stores';
import { ConnectButton } from './EcosystemSelectMenu.style';

interface SVMConnectButtonProps {
  walletIcon?: string;
  svm: Wallet;
}

export const SVMConnectButton = ({
  walletIcon,
  svm,
}: SVMConnectButtonProps) => {
  const theme = useTheme();
  const { select, disconnect, connected } = useWallet();
  const { closeAllMenus } = useMenuStore((state) => state);

  const connect = async () => {
    if (connected) {
      await disconnect();
    }
    select(svm.adapter.name);
    // We use autoConnect on wallet selection
    // svm.adapter.once('connect', (publicKey) => {
    //   emitter.emit(WidgetEvent.WalletConnected, {
    //     address: publicKey?.toString(),
    //     chainId: ChainId.SOL,
    //     chainType: ChainType.SVM,
    //   });
    // });
    closeAllMenus();
  };
  return (
    <ConnectButton onClick={() => connect()}>
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
