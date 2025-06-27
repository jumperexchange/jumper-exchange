import { EVMAddress } from 'src/types/internal';
import { erc20Abi, type Address } from 'viem';

// Type for ERC20 token transaction configuration
export type ERC20TransactionConfig = {
  abi: typeof erc20Abi;
  address: EVMAddress;
  args: [EVMAddress, bigint];
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
    address: tokenAddress as EVMAddress,
    args: [to as EVMAddress, amount],
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
