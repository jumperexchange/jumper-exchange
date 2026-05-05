import type { ExecutorType, TransactionExecutor } from './types';
import { useSendCallsExecutor } from './useSendCallsExecutor';
import { useSendTransactionExecutor } from './useSendTransactionExecutor';

export const useTransactionExecutor = (
  type: ExecutorType,
): TransactionExecutor => {
  const singleExecutor = useSendTransactionExecutor();
  const batchExecutor = useSendCallsExecutor();

  return type === 'batch' ? batchExecutor : singleExecutor;
};
