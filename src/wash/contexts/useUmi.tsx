'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { ChainType } from '@lifi/sdk';
import { useAccount } from '@lifi/wallet-management';
import { mplCore } from '@metaplex-foundation/mpl-core';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';

import type { ReactElement, ReactNode } from 'react';
import type { Umi } from '@metaplex-foundation/umi';
import type { WalletAdapter } from '@solana/wallet-adapter-base';

type TUmiContext = {
  umi: Umi | null;
};

const UmiContext = createContext<TUmiContext>({ umi: null });
export const UmiContextApp = ({
  children,
}: {
  children: ReactNode;
}): ReactElement => {
  const { account } = useAccount({ chainType: ChainType.SVM });
  const [umi, set_umi] = useState<Umi | null>(null);

  useEffect(() => {
    const initUmi = (): void => {
      const umi = createUmi(process.env.NEXT_PUBLIC_SOLANA_RPC_URI as string)
        .use(mplCore())
        .use(walletAdapterIdentity(account.connector as WalletAdapter));
      set_umi(umi);
    };
    if (account.isConnected && account.address) {
      initUmi();
    }
  }, [account.isConnected, account.address, account.connector]);

  return <UmiContext.Provider value={{ umi }}>{children}</UmiContext.Provider>;
};

export const useUmi = (): TUmiContext => {
  const ctx = useContext(UmiContext);
  if (!ctx) {
    throw new Error('UmiContext not found');
  }
  return ctx;
};
