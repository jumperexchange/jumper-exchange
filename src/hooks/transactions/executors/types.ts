import type { Hex } from 'viem';

export interface TransactionAction {
  name: string;
  tx: {
    to: string;
    data: string;
    value?: string;
    chainId: number;
    gasPrice?: bigint;
    maxFeePerGas?: bigint;
    maxPriorityFeePerGas?: bigint;
  };
}

export interface TransactionExecutor {
  /** Execute one or more actions. For batch executor, pass all actions as second argument. */
  execute: (
    action: TransactionAction,
    allActions?: TransactionAction[],
  ) => void;
  reset: () => void;
  txHash?: Hex;
  isPending: boolean;
  isConfirming: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: Error | null;
}

export type ExecutorType = 'single' | 'batch';
