'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { mplCore } from '@metaplex-foundation/mpl-core';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';

import type { ReactElement, ReactNode } from 'react';
import type { Umi } from '@metaplex-foundation/umi';
import { useWallet } from '@solana/wallet-adapter-react';

type TUmiContext = {
  umi: Umi | null;
};

const UmiContext = createContext<TUmiContext>({ umi: null });
export const UmiContextApp = (props: { children: ReactNode }): ReactElement => {
  const wallet = useWallet();
  const [umi, set_umi] = useState<Umi | null>(null);

  useEffect(() => {
    if (wallet.connected && wallet.publicKey) {
      set_umi(
        createUmi(process.env.NEXT_PUBLIC_SOLANA_RPC_URI as string, {
          commitment: 'confirmed',
        })
          .use(mplCore())
          .use(walletAdapterIdentity(wallet)),
      );
    }
  }, [wallet, wallet.connected, wallet.publicKey]);

  return (
    <UmiContext.Provider value={{ umi }}>{props.children}</UmiContext.Provider>
  );
};

export const useUmi = (): TUmiContext => {
  const ctx = useContext(UmiContext);
  if (!ctx) {
    throw new Error('UmiContext not found');
  }
  return ctx;
};
