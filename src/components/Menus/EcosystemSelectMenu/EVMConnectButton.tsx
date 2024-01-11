import { isWalletInstalledAsync } from '@lifi/wallet-management';
import { Avatar, Button, Typography, useTheme } from '@mui/material';
import { useMenuStore } from 'src/stores';
import { useConnect, useDisconnect, type Connector } from 'wagmi';
import { ConnectButton } from './EcosystemSelectMenu.style';

interface EvmConnectButton {
  walletIcon?: string;
  evm: Connector;
}

export const EVMConnectButton = ({ walletIcon, evm }: EvmConnectButton) => {
  const theme = useTheme();
  const { connectAsync } = useConnect();
  const { disconnect } = useDisconnect();
  const { onCloseAllMenus } = useMenuStore((state) => state);

  const connect = async () => {
    const identityCheckPassed = await isWalletInstalledAsync(evm.id);
    if (!identityCheckPassed) {
      //   onNotInstalled(connector);
      return;
    }
    disconnect();
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
    onCloseAllMenus();
  };
  return (
    <ConnectButton onClick={() => connect()}>
      <Avatar src={walletIcon} sx={{ width: '88px', height: '88px' }} />
      <Typography
        variant={'lifiBodySmallStrong'}
        sx={{
          color:
            theme.palette.mode === 'dark'
              ? theme.palette.white.main
              : theme.palette.black.main,
          margin: '12px',
        }}
      >
        EVM
      </Typography>
    </ConnectButton>
  );
};
