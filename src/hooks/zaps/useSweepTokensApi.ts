import { useCallback, useState, useEffect, useMemo } from 'react';
import { useAccount } from '@lifi/wallet-management';
import { useSwitchChain, useWalletClient } from 'wagmi';
import { ProjectData } from 'src/types/questDetails';
import { sweepApiService } from 'src/services/sweepApi';
import { Hex } from 'viem';
import {
  getDefaultMEENetworkUrl,
  parseTransactionStatus,
} from '@biconomy/abstractjs';
import config from 'src/config/env-config';
import { retryWithTimeout } from 'src/utils/retryWithTimeout';
import { RetryStoppedError } from 'src/utils/errors';
import type { ParseKeys } from 'i18next';
import { SweepableTokenDto } from 'src/types/jumper-backend';

type SweepStep =
  | 'idle'
  | 'switching_chain'
  | 'waiting_for_transaction'
  | 'transaction_in_progress'
  | 'view_transaction';

interface UseSweepTokensApiReturn {
  isSweeping: boolean;
  isSweepingTxInProgress: boolean;
  sweepError: string | null;
  sweepSuccess: boolean;
  hasTokensToSweep: boolean;
  sweepTokens: () => Promise<void>;
  txHash: Hex | undefined;
  isTransactionReceiptLoading: boolean;
  isTransactionReceiptSuccess: boolean;
  sweepStep: SweepStep;
  sweepStepButtonKey: ParseKeys<'translation'>;
  sweepableTokens: SweepableTokenDto[];
  smartAccountAddress: string | null;
  targetChainId: number | null;
}

/**
 * Custom hook to handle token sweeping functionality using the backend API
 */
export const useSweepTokensApi = (
  projectData: ProjectData,
): UseSweepTokensApiReturn => {
  const [isSweeping, setIsSweeping] = useState(false);
  const [isSweepingTxInProgress, setIsSweepingTxInProgress] = useState(false);
  const [sweepError, setSweepError] = useState<string | null>(null);
  const [sweepSuccess, setSweepSuccess] = useState(false);
  const [hasTokensToSweepState, setHasTokensToSweepState] = useState(false);
  const [txHash, setTxHash] = useState<Hex | undefined>(undefined);
  const [hasCheckedTokens, setHasCheckedTokens] = useState(false);
  const [sweepStep, setSweepStep] = useState<SweepStep>('idle');
  const [sweepableTokens, setSweepableTokens] = useState<SweepableTokenDto[]>(
    [],
  );
  const [smartAccountAddress, setSmartAccountAddress] = useState<string | null>(
    null,
  );
  const [targetChainId, setTargetChainId] = useState<number | null>(null);
  const [isTransactionReceiptSuccess, setIsTransactionReceiptSuccess] =
    useState(false);
  const [isTransactionReceiptLoading, setIsTransactionReceiptLoading] =
    useState(false);

  const { account } = useAccount();
  const address = account?.address;
  const chainId = account?.chainId;
  const { switchChainAsync } = useSwitchChain();
  const { data: walletClient } = useWalletClient({
    account: address as Hex,
    chainId,
    query: {
      enabled: !!address && !!chainId,
    },
  });

  // Function to get step text
  const getStepButtonTextKey = (step: SweepStep): ParseKeys<'translation'> => {
    switch (step) {
      case 'idle':
        return 'widget.sweepTokensCard.button.claim';
      case 'switching_chain':
        return 'widget.sweepTokensCard.button.switchChain';
      case 'waiting_for_transaction':
        return 'widget.sweepTokensCard.button.waitingForTransaction';
      case 'transaction_in_progress':
        return 'widget.sweepTokensCard.button.transactionInProgress';
      case 'view_transaction':
        return 'widget.sweepTokensCard.button.viewTransaction';
      default:
        return 'widget.sweepTokensCard.button.claim';
    }
  };

  // Memoized step text
  const sweepStepButtonKey = useMemo(
    () => getStepButtonTextKey(sweepStep),
    [sweepStep],
  );

  // Check for sweepable tokens on component mount
  useEffect(() => {
    const checkTokensToSweep = async () => {
      if (hasCheckedTokens || !address || !projectData) {
        return;
      }

      setHasCheckedTokens(true);

      try {
        const response = await sweepApiService.checkSweepableTokens({
          walletAddress: address,
          chainId: chainId,
        });

        const { data } = response;

        setHasTokensToSweepState(data.hasTokensToSweep);
        setSweepableTokens(data.sweepableTokens);
        setSmartAccountAddress(data.smartAccountAddress);
        setTargetChainId(data.targetChainId);
        setSweepStep('idle');
      } catch (error) {
        setHasTokensToSweepState(false);
        setSweepableTokens([]);
        setSweepStep('idle');
      }
    };

    checkTokensToSweep();
  }, [address, chainId, projectData, hasCheckedTokens]);

  useEffect(() => {
    const checkTransactionStatus = async () => {
      let biconomyTxStatus;
      let biconomyTxMessage;
      setIsTransactionReceiptLoading(true);
      try {
        await retryWithTimeout(async () => {
          // Check explorer status to see if we should retry
          const result = await fetch(
            `${getDefaultMEENetworkUrl()}/explorer/${txHash}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'x-api-key': config.NEXT_PUBLIC_BICONOMY_API_KEY,
              },
            },
          );

          const data = await result.json();
          const metaStatus = await parseTransactionStatus(data.userOps);

          if (!metaStatus.isFinalised) {
            throw new Error('Transaction still processing, retrying...');
          }

          biconomyTxStatus = metaStatus.status;
          biconomyTxMessage = metaStatus.message;

          throw new RetryStoppedError(
            'Transaction has final status, no retry needed',
          );
        }, 10_000);
      } catch (error) {
        if (biconomyTxStatus === 'MINED_SUCCESS') {
          setSweepStep('view_transaction');
          setIsSweepingTxInProgress(false);
          setIsTransactionReceiptSuccess(true);
          setIsTransactionReceiptLoading(false);
          setSweepSuccess(true);
          setSweepError(null);
          return;
        }

        setSweepStep('idle');
        setIsSweepingTxInProgress(false);
        setIsTransactionReceiptLoading(false);
        setIsTransactionReceiptSuccess(false);
        setSweepSuccess(false);
        setSweepError(biconomyTxMessage ?? (error as Error).message ?? null);
      }
    };

    if (txHash && !sweepSuccess) {
      checkTransactionStatus();
    }
  }, [txHash, sweepSuccess]);

  const sweepTokens = useCallback(async () => {
    if (!address) {
      setSweepError('Wallet not connected');
      return;
    }

    if (!projectData) {
      setSweepError('Project data not available');
      return;
    }

    if (!hasTokensToSweepState) {
      setSweepError('No tokens available for sweeping');
      return;
    }

    setIsSweeping(true);
    setSweepError(null);
    setSweepSuccess(false);

    try {
      // Step 1: Check if we need to switch chains
      if (targetChainId && targetChainId !== chainId) {
        setSweepStep('switching_chain');
        try {
          await switchChainAsync({ chainId: targetChainId });
        } catch (switchError) {
          setSweepError('Failed to switch to the required chain for sweeping');
          return;
        }
      }

      // Step 2: Get sweep instructions
      setSweepStep('waiting_for_transaction');
      const response = await sweepApiService.getSweepQuote({
        walletAddress: address,
        chainId: targetChainId || chainId,
      });

      // Extract data from the wrapped response (backend uses TransformInterceptor)
      const quoteResponse = response;
      const { data } = quoteResponse;

      const transactionMessage = data.transactionData.message;

      if (!walletClient) {
        throw new Error('Wallet client not available');
      }

      const signedTransactionMessage = await walletClient.signMessage({
        message: transactionMessage,
      });

      setSweepStep('transaction_in_progress');
      setIsSweepingTxInProgress(true);

      const executeResponse = await sweepApiService.executeSweep({
        walletAddress: address as Hex,
        chainId: targetChainId || chainId,
        signedMessage: signedTransactionMessage,
      });

      const { data: executeData } = executeResponse;

      const transactionHash = executeData.transactionHash as Hex;

      setTxHash(transactionHash);
    } catch (error) {
      console.error(error);
      setSweepError(error instanceof Error ? error.message : 'Sweep failed');
      setSweepStep('idle');
      setIsSweepingTxInProgress(false);
    } finally {
      setIsSweeping(false);
    }
  }, [
    address,
    chainId,
    projectData,
    hasTokensToSweepState,
    targetChainId,
    switchChainAsync,
  ]);

  return {
    isSweeping,
    isSweepingTxInProgress,
    sweepError,
    sweepSuccess,
    hasTokensToSweep: hasTokensToSweepState,
    sweepTokens,
    txHash,
    isTransactionReceiptLoading,
    isTransactionReceiptSuccess,
    sweepStep,
    sweepStepButtonKey,
    sweepableTokens,
    smartAccountAddress,
    targetChainId,
  };
};
