'use client';

import { useCallback, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useSignTypedData, useSwitchChain } from 'wagmi';
import { useAccount } from '@jumperexchange/wallet-management';
import type { Hex } from 'viem';
import { makeClient } from '@/app/lib/client';
import { useTransactionFlow } from '@/hooks/transactions/useTransactionFlow';
import type { LimitOrder as Order } from '@/types/jumper-backend';

export enum CancelOrderErrorType {
  CalldataFailed = 'calldataFailed',
  SignatureFailed = 'signatureFailed',
  TransactionFailed = 'transactionFailed',
  RelayFailed = 'relayFailed',
  Unsupported = 'unsupported',
  Unknown = 'unknown',
}

export class CancelOrderError extends Error {
  constructor(
    message: string,
    public type: CancelOrderErrorType,
  ) {
    super(message);
    this.name = 'CancelOrderError';
  }
}

/** The generated client types `typedData` as an untyped `object[]`; this is
 * the EIP-712 shape the limit-order backend actually sends. */
interface LimitOrderTypedData {
  domain: Record<string, unknown>;
  types: Record<string, unknown>;
  primaryType: string;
  message: Record<string, unknown>;
}

export interface CancelOrderResult {
  /** Set when the order was cancelled via an on-chain transaction. */
  txHash?: Hex;
  /** Set when the order was cancelled via a signed+relayed cancellation. */
  txLink?: string;
  chainId: number;
}

/**
 * On-chain cancellations go through `useTransactionFlow`, which handles
 * chain-switching and the execute → confirm state machine, instead of
 * hitting a raw executor directly. Off-chain (sign + relay) cancellations
 * don't fit that tx-action-list model, so they run as a plain async mutation.
 */
export const useCancelOrder = () => {
  const { mutateAsync: signTypedDataAsync } = useSignTypedData();
  const { mutateAsync: switchChainAsync } = useSwitchChain();
  const { account } = useAccount();
  const txFlow = useTransactionFlow();

  const [isAwaitingOnchainTx, setIsAwaitingOnchainTx] = useState(false);
  const [onchainChainId, setOnchainChainId] = useState<number>();

  const prepareAndSubmitFn = useCallback(
    async (order: Order): Promise<CancelOrderResult | undefined> => {
      const client = makeClient();
      const tool = order.tool as '1inch' | 'cowswap';

      const calldataResponse = await client.limitOrder
        .ordersControllerCancelOrderStepTransaction({
          chainId: order.chainId,
          tool,
          orderId: order.orderId,
        })
        .catch(() => {
          throw new CancelOrderError(
            'Failed to fetch cancellation calldata',
            CancelOrderErrorType.CalldataFailed,
          );
        });
      const { transactionRequest, typedData, estimate } = calldataResponse.data;

      if (transactionRequest) {
        setOnchainChainId(transactionRequest.chainId);
        setIsAwaitingOnchainTx(true);
        await txFlow
          .executeFlow({
            actions: [
              {
                name: 'cancelOrder',
                tx: {
                  to: transactionRequest.to,
                  data: transactionRequest.data,
                  value: transactionRequest.value,
                  chainId: transactionRequest.chainId,
                },
              },
            ],
          })
          .catch(() => {
            setIsAwaitingOnchainTx(false);
            setOnchainChainId(undefined);
            throw new CancelOrderError(
              'Failed to send the cancellation transaction',
              CancelOrderErrorType.TransactionFailed,
            );
          });
        // Final success/error is driven by txFlow's reactive state below.
        return undefined;
      }

      if (typedData?.length) {
        const payload = typedData[0] as LimitOrderTypedData;

        if (account?.chainId !== order.chainId) {
          await switchChainAsync({ chainId: order.chainId }).catch(() => {
            throw new CancelOrderError(
              'Failed to switch chain',
              CancelOrderErrorType.SignatureFailed,
            );
          });
        }

        const signature = await signTypedDataAsync(
          payload as Parameters<typeof signTypedDataAsync>[0],
        ).catch(() => {
          throw new CancelOrderError(
            'Failed to sign the cancellation',
            CancelOrderErrorType.SignatureFailed,
          );
        });

        const relayResponse = await client.limitOrder
          .ordersControllerCancelOrderRelay({
            chainId: order.chainId,
            tool,
            estimate,
            typedData: [{ ...payload, signature }],
          })
          .catch(() => {
            throw new CancelOrderError(
              'Failed to relay the cancellation',
              CancelOrderErrorType.RelayFailed,
            );
          });
        return {
          txLink: relayResponse.data.data.txLink,
          chainId: order.chainId,
        };
      }

      throw new CancelOrderError(
        'No cancellation method available for this order',
        CancelOrderErrorType.Unsupported,
      );
    },
    [account?.chainId, signTypedDataAsync, switchChainAsync, txFlow],
  );

  const mutation = useMutation({ mutationFn: prepareAndSubmitFn });

  const reset = useCallback(() => {
    mutation.reset();
    txFlow.resetFlow();
    setIsAwaitingOnchainTx(false);
    setOnchainChainId(undefined);
  }, [mutation, txFlow]);

  const isPending =
    mutation.isPending ||
    (isAwaitingOnchainTx &&
      (txFlow.isExecuting || txFlow.isPending || txFlow.isConfirming));
  const isSuccess = isAwaitingOnchainTx
    ? txFlow.currentStep === 'success'
    : mutation.isSuccess;
  const isError = isAwaitingOnchainTx ? !!txFlow.error : mutation.isError;

  const errorType = isAwaitingOnchainTx
    ? CancelOrderErrorType.TransactionFailed
    : mutation.error instanceof CancelOrderError
      ? mutation.error.type
      : CancelOrderErrorType.Unknown;

  const result: CancelOrderResult | undefined = isAwaitingOnchainTx
    ? txFlow.currentStep === 'success' && onchainChainId
      ? { txHash: txFlow.txHash, chainId: onchainChainId }
      : undefined
    : mutation.data;

  return {
    cancelOrderAsync: mutation.mutateAsync,
    result,
    isPending,
    isSuccess,
    isError,
    errorType,
    reset,
    error: mutation.error,
  };
};
