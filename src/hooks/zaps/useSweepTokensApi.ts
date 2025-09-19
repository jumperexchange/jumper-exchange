import { useCallback, useState, useEffect, useMemo } from 'react';
import { useAccount } from '@lifi/wallet-management';
import { useSwitchChain, useWalletClient } from 'wagmi';
import { useWaitForTransactionReceipt } from 'wagmi';
import { ProjectData } from 'src/types/questDetails';
import { sweepApiService } from 'src/services/sweepApi';
import { biconomyService } from 'src/services/biconomyService';
import {
  SweepableToken,
  CheckSweepableTokensResponse,
  SweepQuoteResponse,
  SweepExecuteResponse,
} from 'src/types/sweep';

// Helper function to get EVM provider from wallet connector
const getEVMProvider = async (connector: any) => {
  if (connector && 'getProvider' in connector) {
    return await connector.getProvider();
  }
  return window.ethereum;
};

type SweepStep = 
  | 'idle'
  | 'checking_tokens'
  | 'switching_chain'
  | 'getting_quote'
  | 'executing'
  | 'completed';

interface UseSweepTokensApiReturn {
  isSweeping: boolean;
  sweepError: string | null;
  sweepSuccess: boolean;
  hasTokensToSweep: boolean;
  sweepTokens: () => Promise<void>;
  txHash: `0x${string}` | undefined;
  isTransactionReceiptLoading: boolean;
  isTransactionReceiptSuccess: boolean;
  refreshTokenCheck: () => void;
  sweepStep: SweepStep;
  sweepStepText: string;
  sweepableTokens: SweepableToken[];
  smartAccountAddress: string | null;
  targetChainId: number | null;
}

/**
 * Custom hook to handle token sweeping functionality using the backend API
 */
export const useSweepTokensApi = (projectData: ProjectData): UseSweepTokensApiReturn => {
  const [isSweeping, setIsSweeping] = useState(false);
  const [sweepError, setSweepError] = useState<string | null>(null);
  const [sweepSuccess, setSweepSuccess] = useState(false);
  const [hasTokensToSweepState, setHasTokensToSweepState] = useState(false);
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined);
  const [hasCheckedTokens, setHasCheckedTokens] = useState(false);
  const [sweepStep, setSweepStep] = useState<SweepStep>('idle');
  const [sweepableTokens, setSweepableTokens] = useState<SweepableToken[]>([]);
  const [smartAccountAddress, setSmartAccountAddress] = useState<string | null>(null);
  const [targetChainId, setTargetChainId] = useState<number | null>(null);
  
  const { account } = useAccount();
  const address = account?.address;
  const chainId = account?.chainId;
  const { switchChainAsync } = useSwitchChain();
  const { data: walletClient } = useWalletClient({
    account: address as `0x${string}`,
    chainId,
    query: {
      enabled: !!address && !!chainId,
    },
  });

  // Function to get step text
  const getStepText = (step: SweepStep): string => {
    switch (step) {
      case 'idle':
        return 'Sweep';
      case 'checking_tokens':
        return 'Checking tokens...';
      case 'switching_chain':
        return 'Switching chain...';
      case 'getting_quote':
        return 'Getting sweep quote...';
      case 'executing':
        return 'Executing sweep...';
      case 'completed':
        return 'Sweep completed';
      default:
        return 'Sweep';
    }
  };

  // Memoized step text
  const sweepStepText = useMemo(() => getStepText(sweepStep), [sweepStep]);

  // Track transaction receipt
  const {
    isLoading: isTransactionReceiptLoading,
    isSuccess: isTransactionReceiptSuccess,
  } = useWaitForTransactionReceipt({
    chainId: targetChainId || projectData?.chainId,
    hash: txHash,
    confirmations: 5,
    pollingInterval: 1_000,
    query: {
      enabled: !!(targetChainId || projectData?.chainId) && !!txHash,
    },
  });

  // Check for sweepable tokens on component mount
  useEffect(() => {
    const checkTokensToSweep = async () => {
      if (hasCheckedTokens || !address || !projectData) {
        return;
      }

      setHasCheckedTokens(true);
      setSweepStep('checking_tokens');

      try {
        const response: CheckSweepableTokensResponse = await sweepApiService.checkSweepableTokens({
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
        console.error('Error checking tokens to sweep:', error);
        setHasTokensToSweepState(false);
        setSweepableTokens([]);
        setSweepStep('idle');
      }
    };

    checkTokensToSweep();
  }, [address, chainId, projectData, hasCheckedTokens]);

  // Function to manually refresh token check
  const refreshTokenCheck = useCallback(() => {
    setHasCheckedTokens(false);
    setHasTokensToSweepState(false);
    setSweepableTokens([]);
    setSmartAccountAddress(null);
    setTargetChainId(null);
  }, []);

  // Handle transaction success
  useEffect(() => {
    if (isTransactionReceiptSuccess) {
      setSweepSuccess(true);
      setSweepError(null);
      setSweepStep('completed');
      // Refresh token check after successful sweep
      refreshTokenCheck();
    }
  }, [isTransactionReceiptSuccess, refreshTokenCheck]);

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
          console.error('Failed to switch chain:', switchError);
          setSweepError('Failed to switch to the required chain for sweeping');
          return;
        }
      }

      // Step 2: Get sweep instructions
      setSweepStep('getting_quote');
      const response = await sweepApiService.getSweepQuote({
        walletAddress: address,
        chainId: targetChainId || chainId,
      });

      console.log('API response received:', response);
      console.log('Response keys:', Object.keys(response));

      // Extract data from the wrapped response (backend uses TransformInterceptor)
      const quoteResponse: SweepQuoteResponse = response;
      const { data } = quoteResponse;

      console.log('Quote response data:', data);
      console.log('Quote from backend:', data.quote);

      // Validate quote
      if (!data.quote) {
        console.error('Invalid quote structure:', {
          quote: data.quote,
          type: typeof data.quote
        });
        throw new Error('No valid quote received from backend');
      }

      // Step 3: Execute the pre-generated quote on frontend
      setSweepStep('executing');
      
      if (!walletClient) {
        throw new Error('Wallet client not available');
      }
      
      // Get the provider from the wallet
      const provider = await getEVMProvider(account.connector);
      
      // Execute the pre-generated quote (this will prompt for wallet signature)
      const transactionHash = await biconomyService.executeSweep(
        walletClient,
        provider,
        targetChainId || chainId,
        data.quote
      );

      setTxHash(transactionHash as `0x${string}`);
      setSweepStep('completed');
    } catch (error) {
      console.error('Sweep failed:', error);
      setSweepError(error instanceof Error ? error.message : 'Sweep failed');
      setSweepStep('idle');
    } finally {
      setIsSweeping(false);
    }
  }, [address, chainId, projectData, hasTokensToSweepState, targetChainId, switchChainAsync]);

  return {
    isSweeping,
    sweepError,
    sweepSuccess,
    hasTokensToSweep: hasTokensToSweepState,
    sweepTokens,
    txHash,
    isTransactionReceiptLoading,
    isTransactionReceiptSuccess,
    refreshTokenCheck,
    sweepStep,
    sweepStepText,
    sweepableTokens,
    smartAccountAddress,
    targetChainId,
  };
};
