import type { TransactionRequestUpdateHook } from '@lifi/sdk';
import { Attribution } from 'ox/erc8021';
import envConfig from '@/config/env-config';

const BASE_CHAIN_ID = 8453;

/**
 * Creates an SDK `updateTransactionRequestHook` that appends the ERC-8021
 * Base Builder Code attribution suffix to the calldata of Base-chain
 * transactions, so they are attributed to Jumper on base.dev.
 *
 * https://docs.base.org/apps/builder-codes/builder-codes
 */
export function createBaseBuilderCodeHook(
  builderCode: string,
): TransactionRequestUpdateHook | undefined {
  if (!builderCode) {
    return undefined;
  }
  // Suffix without the 0x prefix so it can be concatenated onto calldata.
  const suffix = Attribution.toDataSuffix({ codes: [builderCode] }).slice(2);
  return async (tx) => {
    if (
      tx.chainId === BASE_CHAIN_ID &&
      // Only the swap/bridge transaction is meaningful for attribution;
      // skip ERC-20 approvals.
      tx.requestType === 'transaction' &&
      tx.data &&
      // Resumed routes re-run the hook on already-suffixed calldata.
      !tx.data.endsWith(suffix)
    ) {
      return { ...tx, data: tx.data + suffix };
    }
    return tx;
  };
}

export const baseBuilderCodeHook = createBaseBuilderCodeHook(
  envConfig.NEXT_PUBLIC_BASE_BUILDER_CODE,
);
