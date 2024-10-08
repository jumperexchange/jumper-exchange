import { useAccountConnect } from '@/hooks/useAccounts';
import { useChains } from '@/hooks/useChains';
import { useMenuStore } from '@/stores/menu';
import { ChainId } from '@lifi/types';
import { Typography, useTheme } from '@mui/material';
import type { Wallet } from '@solana/wallet-adapter-react';
import AvatarBadge from 'src/components/AvatarBadge/AvatarBadge';
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
  const { closeAllMenus } = useMenuStore((state) => state);
  const connect = useAccountConnect();
  const { chains } = useChains();
  const solanaChain = chains.find((chain) => chain.id === ChainId.SOL);

  const connectHandler = async () => {
    connect({ svm });
    closeAllMenus();
  };
  return (
    <ConnectButton onClick={() => connectHandler()}>
      <AvatarBadge
        avatarSrc={solanaChain?.logoURI}
        avatarSize={88}
        badgeSize={36}
        badgeOffset={{ x: 5, y: 5 }}
        badgeGap={10}
        alt={`Ecosystem ${solanaChain?.name} avatar`}
        badgeAlt={`Ecosystem wallet avatar`}
        badgeSrc={walletIcon}
      />
      <Typography
        sx={{
          color:
            theme.palette.mode === 'dark'
              ? theme.palette.white.main
              : theme.palette.black.main,
          marginTop: 1.5,
        }}
        variant={'bodySmallStrong'}
      >
        Solana
      </Typography>
    </ConnectButton>
  );
};
