'use client';

import type { Adapter } from '@solana/wallet-adapter-base';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { clusterApiUrl } from '@solana/web3.js';
import { WalletConnectWalletAdapter } from '@walletconnect/solana-adapter';
import { type FC, type PropsWithChildren } from 'react';

const endpoint = clusterApiUrl(WalletAdapterNetwork.Mainnet);
/**
 * Wallets that implement either of these standards will be available automatically.
 *
 *   - Solana Mobile Stack Mobile Wallet Adapter Protocol
 *     (https://github.com/solana-mobile/mobile-wallet-adapter)
 *   - Solana Wallet Standard
 *     (https://github.com/solana-labs/wallet-standard)
 *
 * If you wish to support a wallet that supports neither of those standards,
 * instantiate its legacy wallet adapter here. Common legacy adapters can be found
 * in the npm package `@solana/wallet-adapter-*`.
 */
const wallets: Adapter[] = [
  new WalletConnectWalletAdapter({
    network: WalletAdapterNetwork.Mainnet,
    options: {
      projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
    },
  }),
];

export const SVMProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        {children}
      </WalletProvider>
    </ConnectionProvider>
  );
};
