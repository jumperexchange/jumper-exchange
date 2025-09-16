import { useCallback, useState, useEffect, useMemo } from 'react';
import { useAccount } from '@lifi/wallet-management';
import { useWalletClient, useSwitchChain, useConfig } from 'wagmi';
import { createSweepTransferInstructions, hasTokensToSweep } from 'src/providers/ZapInitProvider/utils';
import { useBiconomyClientsStore } from 'src/stores/biconomyClients/BiconomyClientsStore';
import { useZapData } from './useZapData';
import { ProjectData } from 'src/types/questDetails';
import { Hex } from 'viem';
import { MultichainSmartAccount } from '@biconomy/abstractjs';
import { ChainId, Token, getTokenBalances, getTokens, ChainType } from '@lifi/sdk';
import { getConnectorClient } from 'wagmi/actions';
import { useWaitForTransactionReceipt } from 'wagmi';
import { formatUnits } from 'viem';

type SweepStep = 
  | 'idle'
  | 'initializing'
  | 'determining_chain'
  | 'switching_chain'
  | 'creating_instructions'
  | 'getting_quote'
  | 'executing'
  | 'completed';

interface SweepableToken {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  chainId: number;
  amount: string;
  logoURI?: string;
}

interface UseSweepTokensReturn {
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
}

/**
 * Determines the target chain for sweeping by finding the chain with the most tokens to sweep
 * @param oNexus - The multichain smart account
 * @param currentChainId - The current wallet chain ID
 * @returns The chain ID to use for sweeping
 */
const getTargetChainForSweep = async (
  oNexus: MultichainSmartAccount,
  currentChainId: number
): Promise<number> => {
  try {
    // Get all available tokens for EVM chains only
    const tokensResponse = await getTokens({
      chainTypes: [ChainType.EVM],
    });
    
    // Get the smart account address
    const accountAddress = oNexus.addressOn(currentChainId, true);
    
    // Check all EVM chains for tokens to sweep
    const allEVMChains = Object.keys(tokensResponse.tokens).map(Number);
    let maxTokensChain = currentChainId;
    let maxTokensCount = 0;
    
    for (const evmChainId of allEVMChains) {
      const chainTokens = tokensResponse.tokens[evmChainId];
      if (!chainTokens || chainTokens.length === 0) {
        continue;
      }
      
      // Get token balances for the account on this chain
      const tokenBalances = await getTokenBalances(accountAddress, chainTokens);
      
      // Count tokens with non-zero balance
      const tokensWithBalance = tokenBalances.filter(
        (balance) => balance.amount && balance.amount > BigInt(0) && balance.address !== '0x0000000000000000000000000000000000000000'
      );

      if (tokensWithBalance.length > maxTokensCount) {
        maxTokensCount = tokensWithBalance.length;
        maxTokensChain = evmChainId;
      }
    }

    return maxTokensChain;
  } catch (error) {
    console.error('Error determining target chain for sweep:', error);
    return currentChainId; // Fallback to current chain
  }
};

/**
 * Custom hook to handle token sweeping functionality
 * Creates sweep transfer instructions for all token balances on the current EVM chain
 */
export const useSweepTokens = (projectData: ProjectData): UseSweepTokensReturn => {
  const [isSweeping, setIsSweeping] = useState(false);
  const [sweepError, setSweepError] = useState<string | null>(null);
  const [sweepSuccess, setSweepSuccess] = useState(false);
  const [hasTokensToSweepState, setHasTokensToSweepState] = useState(false);
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined);
  const [hasCheckedTokens, setHasCheckedTokens] = useState(false);
  const [sweepStep, setSweepStep] = useState<SweepStep>('idle');
  const [sweepableTokens, setSweepableTokens] = useState<SweepableToken[]>([]);
  
  const { account } = useAccount();
  const address = account?.address;
  const chainId = account?.chainId;
  const wagmiConfig = useConfig();
  
  // Use the new API hook to get zap data
  const { data: zapDataResponse, isSuccess: isZapDataSuccess } = useZapData({ projectData });
  const zapData = zapDataResponse?.data;

  const { data: walletClient } = useWalletClient({
    account: address as Hex,
    chainId,
    query: {
      enabled: !!address && !!chainId,
    },
  });

  const { switchChainAsync } = useSwitchChain();
  const getClients = useBiconomyClientsStore((state) => state.getClients);

  // Function to get step text
  const getStepText = (step: SweepStep): string => {
    switch (step) {
      case 'idle':
        return 'Sweep';
      case 'initializing':
        return 'Initializing...';
      case 'determining_chain':
        return 'Connecting to RPC...';
      case 'switching_chain':
        return 'Switching chain...';
      case 'creating_instructions':
        return 'Creating instructions...';
      case 'getting_quote':
        return 'Getting quote...';
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

  // Function to get sweepable tokens
  const getSweepableTokens = async (oNexus: MultichainSmartAccount, currentChainId: number): Promise<SweepableToken[]> => {
    try {
      // Get all available tokens for EVM chains only
      const tokensResponse = await getTokens({
        chainTypes: [ChainType.EVM],
      });
      
      // Get the smart account address
      const accountAddress = oNexus.addressOn(currentChainId, true);
      
      // Check all EVM chains for tokens to sweep
      const allEVMChains = Object.keys(tokensResponse.tokens).map(Number);
      const allSweepableTokens: SweepableToken[] = [];
      
      for (const evmChainId of allEVMChains) {
        const chainTokens = tokensResponse.tokens[evmChainId];
        if (!chainTokens || chainTokens.length === 0) {
          continue;
        }
        
        // Get token balances for the account on this chain
        const tokenBalances = await getTokenBalances(accountAddress, chainTokens);
        
        // Filter out tokens with zero balance and zero address
        const tokensWithBalance = tokenBalances.filter(
          (balance) => balance.amount && balance.amount > BigInt(0) && balance.address !== '0x0000000000000000000000000000000000000000'
        );

        // Convert to SweepableToken format
        const chainSweepableTokens = tokensWithBalance.map((tokenBalance) => {
          const token = chainTokens.find(t => t.address === tokenBalance.address);
          return {
            address: tokenBalance.address,
            symbol: token?.symbol || 'Unknown',
            name: token?.name || 'Unknown Token',
            decimals: token?.decimals || 18,
            chainId: evmChainId,
            amount: formatUnits(tokenBalance.amount || BigInt(0), token?.decimals || 18),
            logoURI: token?.logoURI,
          };
        });

        allSweepableTokens.push(...chainSweepableTokens);
      }

      return allSweepableTokens;
    } catch (error) {
      console.error('Error getting sweepable tokens:', error);
      return [];
    }
  };

  // Track transaction receipt
  const {
    isLoading: isTransactionReceiptLoading,
    isSuccess: isTransactionReceiptSuccess,
  } = useWaitForTransactionReceipt({
    chainId: projectData?.chainId,
    hash: txHash,
    confirmations: 5,
    pollingInterval: 1_000,
    query: {
      enabled: !!projectData?.chainId && !!txHash,
    },
  });

  // Check if there are tokens to sweep only once when page is loaded
  useEffect(() => {
    const checkTokensToSweep = async () => {
      // Only check if we haven't checked yet and all dependencies are ready
      if (hasCheckedTokens || !address || !chainId || !zapData || !isZapDataSuccess || !projectData || !walletClient || !wagmiConfig) {
        return;
      }

      setHasCheckedTokens(true);

      try {
        // Get the provider from wagmi config
        const provider = await getConnectorClient(wagmiConfig, { chainId });
        
        // Try to get clients, but handle the case where they can't be initialized
        const clients = await getClients(
          projectData.address as Hex,
          projectData.chainId,
          walletClient, // Pass the actual wallet client
          provider, // Pass the provider
          false, // isEmbeddedWallet
          chainId
        );

        if (!clients) {
          setHasTokensToSweepState(false);
          return;
        }

        const { oNexus } = clients;
        
        // Check for tokens to sweep across all chains (not just current chain)
        const hasTokens = await hasTokensToSweep(oNexus, chainId);
        
        // Get the actual tokens available for sweeping
        const tokens = await getSweepableTokens(oNexus, chainId);

        setHasTokensToSweepState(hasTokens);
        setSweepableTokens(tokens);
      } catch (error) {
        console.error('Error checking tokens to sweep:', error);
        // Don't set hasTokensToSweepState to false on error, just log it
        // This allows the sweep functionality to still work if the check fails
        setHasTokensToSweepState(false);
      }
    };

    checkTokensToSweep();
  }, [address, chainId, zapData, isZapDataSuccess, projectData, walletClient, wagmiConfig, getClients, hasCheckedTokens]);

  // Function to manually refresh token check
  const refreshTokenCheck = useCallback(() => {
    setHasCheckedTokens(false);
    setHasTokensToSweepState(false);
    setSweepableTokens([]);
  }, []);

  // Handle transaction success
  useEffect(() => {
    if (isTransactionReceiptSuccess) {
      setSweepSuccess(true);
      setSweepError(null);
      // Refresh token check after successful sweep
      refreshTokenCheck();
    }
  }, [isTransactionReceiptSuccess, refreshTokenCheck]);

  const sweepTokens = useCallback(async () => {
    if (!address || !chainId) {
      setSweepError('Wallet not connected');
      return;
    }

    if (!zapData || !isZapDataSuccess) {
      setSweepError('Zap data not available');
      return;
    }

    if (!projectData) {
      setSweepError('Project data not available');
      return;
    }

    if (!walletClient) {
      setSweepError('Wallet client not available');
      return;
    }

    setIsSweeping(true);
    setSweepError(null);
    setSweepSuccess(false);
    setSweepStep('initializing');

    try {
      // Get the provider from wagmi config
      setSweepStep('initializing');
      const provider = await getConnectorClient(wagmiConfig, { chainId });
      
      // Get the biconomy clients (including oNexus)
      const clients = await getClients(
        projectData.address as Hex,
        projectData.chainId,
        walletClient, // Pass the actual wallet client
        provider, // Pass the provider
        false, // isEmbeddedWallet
        chainId
      );

      if (!clients) {
        throw new Error('Biconomy clients not available. Please ensure your wallet is properly connected and try again.');
      }

      const { oNexus } = clients;
      
      // Determine the target chain for sweeping (chain with most tokens)
      setSweepStep('determining_chain');
      const targetChainId = await getTargetChainForSweep(oNexus, chainId);
      
      // Check if we need to switch chains
      if (targetChainId !== chainId) {
        setSweepStep('switching_chain');
        try {
          await switchChainAsync({ chainId: targetChainId });
        } catch (switchError) {
          console.error('Failed to switch chain:', switchError);
          setSweepError('Failed to switch to the required chain for sweeping');
          return;
        }
      }
      
      // Create sweep transfer instructions for all token balances
      setSweepStep('creating_instructions');
      const sweepInstructions = await createSweepTransferInstructions(oNexus, targetChainId);
      
      if (sweepInstructions.length === 0) {
        setSweepStep('completed');
        return;
      }
      
      // Execute the sweep instructions
      const { meeClient } = clients;
      
      // Create a simple quote for sweep operations
      const sweepQuoteParams = {
        instructions: sweepInstructions,
        feeToken: {
          address: '0x0000000000000000000000000000000000000000' as Hex, // Use native token for fees
          chainId: targetChainId, // Use the target chain ID
          gasRefundAddress: address as Hex,
        },
        lowerBoundTimestamp: Math.ceil(Date.now() / 1000),
        upperBoundTimestamp: Math.ceil(Date.now() / 1000) + 300, // 5 minutes timeout
      };

      setSweepStep('getting_quote');
      const quote = await meeClient.getQuote(sweepQuoteParams);
      
      setSweepStep('executing');
      const execution = await meeClient.executeQuote({ quote });
      
      setTxHash(execution.hash);
      setSweepStep('completed');
    } catch (error) {
      console.error('Sweep failed:', error);
      setSweepError(error instanceof Error ? error.message : 'Sweep failed');
      setSweepStep('idle');
    } finally {
      setIsSweeping(false);
    }
  }, [address, chainId, zapData, isZapDataSuccess, projectData, walletClient, wagmiConfig, getClients, switchChainAsync]);

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
  };
};
