'use client';

import { RoycoProvider } from 'royco';
import React from 'react';

export const RoycoClientProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const RPC_API_KEYS: {
    [chain_id: number]: string;
  } = {
    1: 'https://eth-mainnet.g.alchemy.com/v2/1loBE7C025PbFMLCiTAhbG3WrIqH0J1y',
    11155111:
      'https://eth-sepolia.g.alchemy.com/v2/1loBE7C025PbFMLCiTAhbG3WrIqH0J1y',
  };

  return (
    <RoycoProvider
      originUrl={process.env.NEXT_PUBLIC_ROYCO_URL!}
      originKey={process.env.NEXT_PUBLIC_ROYCO_KEY!}
      originId={process.env.NEXT_PUBLIC_ROYCO_ID!}
      rpcApiKeys={RPC_API_KEYS}
    >
      {children}
    </RoycoProvider>
  );
};
