import { erc20Abi, type Address } from 'viem';

// Type for native token transaction configuration
export type NativeTransactionConfig = {
  to: Address;
  value: bigint;
};

// Type for ERC20 token transaction configuration
export type ERC20TransactionConfig = {
  address: `0x${string}`;
  abi: typeof erc20Abi;
  functionName: 'transfer';
  args: [`0x${string}`, bigint];
};

// Combined type for all transaction configurations
export type TransactionConfig =
  | NativeTransactionConfig
  | (ERC20TransactionConfig & { chainId: number });

/**
 * Creates a transaction configuration for sending ERC20 tokens
 */
export function createTokenTransactionConfig(
  tokenAddress: Address,
  to: Address,
  amount: bigint,
  chainId: number,
): ERC20TransactionConfig & { chainId: number } {
  return {
    address: tokenAddress as `0x${string}`,
    abi: erc20Abi,
    functionName: 'transfer',
    args: [to as `0x${string}`, amount],
    chainId,
  };
}

/**
 * Creates a transaction configuration for sending native tokens
 */
export function createNativeTransactionConfig(
  to: Address,
  amount: bigint,
): NativeTransactionConfig {
  return {
    to,
    value: amount,
  };
}
