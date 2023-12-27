import { isWalletInstalledAsync } from '@lifi/wallet-management';
import { Avatar, Button, Typography, useTheme } from '@mui/material';
import { useConnect, type Connector } from 'wagmi';

interface EvmConnectButton {
  walletIcon?: string;
  evm: Connector;
}

export const EVMConnectButton = ({ walletIcon, evm }: EvmConnectButton) => {
  const theme = useTheme();
  const { connectAsync } = useConnect();

  const connect = async () => {
    const identityCheckPassed = await isWalletInstalledAsync(evm.id);
    if (!identityCheckPassed) {
      //   onNotInstalled(connector);
      return;
    }

    await connectAsync(
      { connector: evm },
      //   {
      //     onSuccess(data) {
      //       emitter.emit(WidgetEvent.WalletConnected, {
      //         address: data.accounts[0],
      //         chainId: data.chainId,
      //         chainType: ChainType.EVM,
      //       });
      //     },
      //   },
    );
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
        EVM
      </Typography>
    </Button>
  );
};
