import { useAccount } from '@jumperexchange/wallet-management';
import { useMemo } from 'react';
import type { Hex } from 'viem';
import { useCapabilities } from 'wagmi';

const SUPPORTED_ATOMIC_STATUSES = ['supported', 'ready'] as const;

const isAtomicStatusSupported = (cap?: { atomic?: { status?: string } }) =>
  !!cap?.atomic?.status &&
  SUPPORTED_ATOMIC_STATUSES.includes(cap.atomic.status as never);

/**
 * Returns whether the connected wallet supports EIP-5792 batch transactions
 * (wallet_sendCalls). When true, useSendCalls can be used for batch execution.
 */
export const useWalletCapabilities = (chainId?: number) => {
  const { account } = useAccount();
  const { data: capabilities } = useCapabilities({
    account: account.address as Hex,
  });

  const supportsBatchTransactions = useMemo(() => {
    if (!capabilities || typeof capabilities !== 'object') {
      return false;
    }

    return chainId
      ? isAtomicStatusSupported(capabilities[chainId])
      : Object.values(capabilities).some(isAtomicStatusSupported);
  }, [chainId, capabilities]);

  return { supportsBatchTransactions };
};
