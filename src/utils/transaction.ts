import { erc20Abi, type Address } from 'viem';

// Type for transaction configuration
export type TransactionConfig =
  | {
      to: Address;
      value: bigint;
    }
  | {
      address: Address;
      abi: typeof erc20Abi;
      functionName: 'transfer';
      args: [Address, bigint];
      chainId: number;
    };

/**
 * Creates a transaction configuration for sending native currency
 */
export function createNativeTransactionConfig(
  to: Address,
  value: bigint,
): TransactionConfig {
  return {
    to,
    value,
  };
}

/**
 * Creates a transaction configuration for sending ERC20 tokens
 */
export function createTokenTransactionConfig(
  tokenAddress: Address,
  to: Address,
  amount: bigint,
  chainId: number,
): TransactionConfig {
  return {
    address: tokenAddress,
    abi: erc20Abi,
    functionName: 'transfer',
    args: [to, amount],
    chainId,
  };
}
