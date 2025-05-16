import { ChainId } from '@lifi/sdk';
import {
  SuiClientProvider,
  WalletProvider,
  createNetworkConfig,
} from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui/client';
import { type FC, type PropsWithChildren, useMemo } from 'react';

const config = createNetworkConfig({
  mainnet: { url: getFullnodeUrl('mainnet') },
});

export const SuiProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <SuiClientProvider networks={config.networkConfig} defaultNetwork="mainnet">
      <WalletProvider storageKey="jumper-sui-wallet-connection" autoConnect>
        {children}
      </WalletProvider>
    </SuiClientProvider>
  );
};
