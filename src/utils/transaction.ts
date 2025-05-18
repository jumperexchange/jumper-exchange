import { type Address } from 'viem';

// ERC20 Transfer ABI - commonly used for token transfers
export const ERC20_TRANSFER_ABI = [
  {
    name: 'transfer',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
] as const;

// Type for transaction configuration
export type TransactionConfig =
  | {
      to: Address;
      value: bigint;
    }
  | {
      address: Address;
      abi: typeof ERC20_TRANSFER_ABI;
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
    abi: ERC20_TRANSFER_ABI,
    functionName: 'transfer',
    args: [to, amount],
    chainId,
  };
}
