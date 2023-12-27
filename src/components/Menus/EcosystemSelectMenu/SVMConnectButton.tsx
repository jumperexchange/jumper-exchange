import { Avatar, Button, Typography, useTheme } from '@mui/material';
import type { Wallet } from '@solana/wallet-adapter-react';
import { useWallet } from '@solana/wallet-adapter-react';

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

  const connect = async () => {
    if (connected) {
      await disconnect();
    }
    select(svm.adapter.name);
    // We use autoConnect on wallet selection
    // await solanaConnect();
    // svm.adapter.once('connect', (publicKey) => {
    //   emitter.emit(WidgetEvent.WalletConnected, {
    //     address: publicKey?.toString(),
    //     chainId: ChainId.SOL,
    //     chainType: ChainType.SVM,
    //   });
    // });
  };
  return (
    <Button
      sx={{
        boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.04)',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flex: ' 1 0 0',
        cursor: 'pointer',
        background: theme.palette.surface2.main,
      }}
      onClick={() => connect()}
    >
      <Avatar src={walletIcon} sx={{ width: '88px', height: '88px' }} />
      <Typography variant={'lifiBodySmallStrong'} sx={{ margin: '12px' }}>
        Solana
      </Typography>
    </Button>
  );
};
