'use client';

import { useAccountAddress } from '@/hooks/earn/useAccountAddress';
import type { Address } from 'viem';
import { useReadContract } from 'wagmi';
import { base } from 'wagmi/chains';

interface GatekeeperProps extends React.PropsWithChildren {}

enum GatekeeperStatus {
  LOADING = 'loading',
  REQUIRES_CONNECT = 'requires_wallet',
  LOADING_NFT = 'loading_access',
  SUCCESS = 'success',
  ERROR = 'error',
  NOT_ALLOWED = 'not_allowed',
}

interface GatekeeperData {
  status: GatekeeperStatus;
  error?: unknown;
}

// https://basescan.org/tx/0x05f541bca11bcdf24508bdba5f3d5d8b0705b754ca3b9c82d910020066c77ea9
const NFT_ADDRESS: Address = '0x67092c874b307d26c2f8cbdfadba08d10c965779';

const erc1155Abi = [
  {
    type: 'function',
    name: 'balanceOf',
    stateMutability: 'view',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'id', type: 'uint256' },
    ],
    outputs: [{ type: 'uint256' }],
  },
] as const;

const TOKEN_ID = 1n;

const useGatekeeperStatus = (): GatekeeperData => {
  const accountAddress = useAccountAddress();

  const ownerArg: Address = (accountAddress ?? NFT_ADDRESS) as Address;
  const {
    data: balance,
    isLoading,
    error,
  } = useReadContract({
    address: NFT_ADDRESS,
    abi: erc1155Abi,
    functionName: 'balanceOf',
    args: [ownerArg, TOKEN_ID],
    chainId: base.id,
    query: { enabled: Boolean(accountAddress) },
  });

  if (!accountAddress) {
    return { status: GatekeeperStatus.REQUIRES_CONNECT };
  }

  if (isLoading) {
    return { status: GatekeeperStatus.LOADING_NFT };
  }

  if (error) {
    return { status: GatekeeperStatus.ERROR, error };
  }

  const hasAccess = (balance ?? 0n) > 0n;

  return {
    status: hasAccess ? GatekeeperStatus.SUCCESS : GatekeeperStatus.NOT_ALLOWED,
  };
};

export const Gatekeeper: React.FC<GatekeeperProps> = ({ children }) => {
  const { status, error } = useGatekeeperStatus();

  if (status === GatekeeperStatus.LOADING) {
    return <div>Loading...</div>;
  }

  if (status === GatekeeperStatus.REQUIRES_CONNECT) {
    return <div>Requires connect</div>;
  }

  if (status === GatekeeperStatus.LOADING_NFT) {
    return <div>Loading NFT</div>;
  }

  if (status === GatekeeperStatus.ERROR) {
    return (
      <div>
        <pre>Error: {error?.toString()}</pre>
      </div>
    );
  }

  if (status === GatekeeperStatus.NOT_ALLOWED) {
    return <div>Not allowed</div>;
  }

  return <>{children}</>;
};
