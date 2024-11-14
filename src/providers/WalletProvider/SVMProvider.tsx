'use client';

import type { Adapter } from '@solana/wallet-adapter-base';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare';
import { clusterApiUrl } from '@solana/web3.js';
import { type FC, type PropsWithChildren } from 'react';
import { UmiContextApp } from 'src/wash/contexts/useUmi';

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
const wallets: Adapter[] = [new SolflareWalletAdapter()];

export const SVMProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <UmiContextApp>{children}</UmiContextApp>
      </WalletProvider>
    </ConnectionProvider>
  );
};
