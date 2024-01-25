import { isWalletInstalledAsync } from '@lifi/wallet-management';
import { Avatar, Typography, useTheme } from '@mui/material';
import { useMenuStore } from 'src/stores';
import { type Connector } from 'wagmi';
import { ConnectButton } from './EcosystemSelectMenu.style';
import { useAccountConnect } from 'src/hooks/useAccounts';

interface EvmConnectButton {
  walletIcon?: string;
  evm: Connector;
}

export const EVMConnectButton = ({ walletIcon, evm }: EvmConnectButton) => {
  const theme = useTheme();
  const connect = useAccountConnect();

  const { closeAllMenus } = useMenuStore((state) => state);

  const connectHandler = async () => {
    connect({ evm });
    closeAllMenus();
  };
  return (
    <ConnectButton onClick={() => connectHandler()}>
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
