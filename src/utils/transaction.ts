import { erc20Abi, Hex, type Address } from 'viem';

// Type for ERC20 token transaction configuration
export type ERC20TransactionConfig = {
  abi: typeof erc20Abi;
  address: Hex;
  args: [Hex, bigint];
  functionName: 'transfer';
};

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
    abi: erc20Abi,
    address: tokenAddress as Hex,
    args: [to as Hex, amount],
    chainId,
    functionName: 'transfer',
  };
}

// Type for native token transaction configuration
export type NativeTransactionConfig = {
  to: Address;
  value: bigint;
};

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
