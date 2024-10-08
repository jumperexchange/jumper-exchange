import { useAccountConnect } from '@/hooks/useAccounts';
import { useChains } from '@/hooks/useChains';
import { useMenuStore } from '@/stores/menu';
import { ChainId } from '@lifi/types';
import type { CreateConnectorFnExtended } from '@lifi/wallet-management';
import { Typography, useTheme } from '@mui/material';
import AvatarBadge from 'src/components/AvatarBadge/AvatarBadge';
import { type Connector } from 'wagmi';
import { ConnectButton } from './EcosystemSelectMenu.style';

interface EvmConnectButton {
  walletIcon?: string;
  evm: Connector | CreateConnectorFnExtended;
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
      <AvatarBadge
        avatarSrc={ethereumChain?.logoURI}
        avatarSize={88}
        badgeSize={36}
        badgeOffset={{ x: 5, y: 5 }}
        badgeGap={10}
        alt={`Ecosystem ${ethereumChain?.name} avatar`}
        badgeAlt={`Ecosystem wallet avatar`}
        badgeSrc={walletIcon}
      />
      <Typography
        variant={'bodySmallStrong'}
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
