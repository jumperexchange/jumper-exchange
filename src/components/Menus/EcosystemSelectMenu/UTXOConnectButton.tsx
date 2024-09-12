import { useAccountConnect } from '@/hooks/useAccounts';
import { useChains } from '@/hooks/useChains';
import { useMenuStore } from '@/stores/menu';
import { ChainId } from '@lifi/types';
import type { CreateConnectorFnExtended } from '@lifi/wallet-management';
import { Avatar, Typography, useTheme } from '@mui/material';
import { type Connector } from 'wagmi';
import {
  ConnectButton,
  EcoSystemSelectBadge,
} from './EcosystemSelectMenu.style';

interface UtxoConnectButton {
  walletIcon?: string;
  utxo: Connector | CreateConnectorFnExtended;
}

export const UTXOConnectButton = ({ walletIcon, utxo }: UtxoConnectButton) => {
  const theme = useTheme();
  const connect = useAccountConnect();
  const { chains } = useChains();
  const bitcoinChain = chains.find((chain) => chain.id === ChainId.BTC);

  const { closeAllMenus } = useMenuStore((state) => state);

  const connectHandler = async () => {
    connect({ utxo });
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
            sx={{ width: '36px', height: '36px' }}
          />
        }
      >
        <Avatar
          src={bitcoinChain?.logoURI}
          sx={{ width: '88px', height: '88px' }}
        />
      </EcoSystemSelectBadge>
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
        Bitcoin
      </Typography>
    </ConnectButton>
  );
};
