import { Avatar, Skeleton, Typography, useTheme } from '@mui/material';
import { useAccountConnect } from 'src/hooks/useAccounts';
import { useMenuStore } from 'src/stores';
import { type Connector } from 'wagmi';
import {
  ConnectButton,
  EcoSystemSelectBadge,
} from './EcosystemSelectMenu.style';
import { useChains } from 'src/hooks';
import { ChainId } from '@lifi/types';

interface EvmConnectButton {
  walletIcon?: string;
  evm: Connector;
}

export const EVMConnectButton = ({ walletIcon, evm }: EvmConnectButton) => {
  const theme = useTheme();
  const connect = useAccountConnect();
  const { chains } = useChains();
  const ethereumChain = chains.find((chain) => chain.id === ChainId.ETH);

  const { closeAllMenus } = useMenuStore((state) => state);

  const connectHandler = async () => {
    connect({ evm });
    closeAllMenus();
  };
  return (
    <ConnectButton onClick={() => connectHandler()}>
      <EcoSystemSelectBadge
        overlap="circular"
        className="badge"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        badgeContent={
          <Avatar
            src={walletIcon}
            alt={'wallet-avatar'}
            sx={{ width: '33px', height: '33px' }}
          />
        }
      >
        <Avatar
          src={ethereumChain?.logoURI}
          sx={{ width: '88px', height: '88px' }}
        />
      </EcoSystemSelectBadge>
      <Typography
        variant={'lifiBodySmallStrong'}
        sx={{
          color:
            theme.palette.mode === 'dark'
              ? theme.palette.white.main
              : theme.palette.black.main,
          marginTop: 1.5,
        }}
      >
        EVM
      </Typography>
    </ConnectButton>
  );
};
