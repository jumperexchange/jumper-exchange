import { useCallback, useState, useEffect } from 'react';
import { useAccount } from '@lifi/wallet-management';
import { useWalletClient, useSwitchChain } from 'wagmi';
import { useZapInitContext } from 'src/providers/ZapInitProvider/ZapInitProvider';
import { createSweepTransferInstructions, hasTokensToSweep } from 'src/providers/ZapInitProvider/utils';
import { useBiconomyClientsStore } from 'src/stores/biconomyClients/BiconomyClientsStore';
import { Hex } from 'viem';
import { MultichainSmartAccount } from '@biconomy/abstractjs';
import { ChainId, Token, getTokenBalances, getTokens, ChainType } from '@lifi/sdk';

interface UseSweepTokensReturn {
  isSweeping: boolean;
  sweepError: string | null;
  sweepSuccess: boolean;
  hasTokensToSweep: boolean;
  sweepTokens: () => Promise<void>;
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

    console.log(`Target chain for sweep: ${maxTokensChain} (${maxTokensCount} tokens)`);
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
export const useSweepTokens = (): UseSweepTokensReturn => {
  const [isSweeping, setIsSweeping] = useState(false);
  const [sweepError, setSweepError] = useState<string | null>(null);
  const [sweepSuccess, setSweepSuccess] = useState(false);
  const [hasTokensToSweepState, setHasTokensToSweepState] = useState(false);
  
  const { account } = useAccount();
  const address = account?.address;
  const chainId = account?.chainId;
  const { 
    isInitialized, 
    isInitializedForCurrentChain,
    zapData,
    isZapDataSuccess,
    projectData
  } = useZapInitContext();

  const { data: walletClient } = useWalletClient({
    account: address as Hex,
    chainId,
    query: {
      enabled: !!address && !!chainId,
    },
  });

  const { switchChainAsync } = useSwitchChain();
  const getClients = useBiconomyClientsStore((state) => state.getClients);

  // Check if there are tokens to sweep when dependencies change
  useEffect(() => {
    const checkTokensToSweep = async () => {
      if (!address || !chainId || !isInitialized || !isInitializedForCurrentChain || !zapData || !isZapDataSuccess || !projectData || !walletClient) {
        setHasTokensToSweepState(false);
        return;
      }

      try {
        const clients = await getClients(
          projectData.address as Hex,
          projectData.chainId,
          walletClient, // Pass the actual wallet client
          undefined, // provider - will be fetched internally
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

        setHasTokensToSweepState(hasTokens);
      } catch (error) {
        console.error('Error checking tokens to sweep:', error);
        setHasTokensToSweepState(false);
      }
    };

    checkTokensToSweep();
  }, [address, chainId, isInitialized, isInitializedForCurrentChain, zapData, isZapDataSuccess, projectData, walletClient, getClients]);

  const sweepTokens = useCallback(async () => {
    if (!address || !chainId) {
      setSweepError('Wallet not connected');
      return;
    }

    if (!isInitialized || !isInitializedForCurrentChain) {
      setSweepError('Zap system not initialized for current chain');
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

    try {
      console.log('Starting sweep for chain:', chainId);
      console.log('Account address:', address);
      
      // Get the biconomy clients (including oNexus)
      const clients = await getClients(
        projectData.address as Hex,
        projectData.chainId,
        walletClient, // Pass the actual wallet client
        undefined, // provider - will be fetched internally
        false, // isEmbeddedWallet
        chainId
      );

      if (!clients) {
        throw new Error('Failed to initialize biconomy clients');
      }

      const { oNexus } = clients;
      
      // Determine the target chain for sweeping (chain with most tokens)
      const targetChainId = await getTargetChainForSweep(oNexus, chainId);
      
      // Check if we need to switch chains
      if (targetChainId !== chainId) {
        console.log(`Switching from chain ${chainId} to chain ${targetChainId} for sweep`);
        try {
          await switchChainAsync({ chainId: targetChainId });
          console.log(`Successfully switched to chain ${targetChainId}`);
        } catch (switchError) {
          console.error('Failed to switch chain:', switchError);
          setSweepError('Failed to switch to the required chain for sweeping');
          return;
        }
      }
      
      // Create sweep transfer instructions for all token balances
      const sweepInstructions = await createSweepTransferInstructions(oNexus, targetChainId);
      
      if (sweepInstructions.length === 0) {
        console.log('No tokens to sweep');
        return;
      }

      console.log(`Created ${sweepInstructions.length} sweep instructions`);
      
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

      console.log('Executing sweep quote...');
      const quote = await meeClient.getQuote(sweepQuoteParams);
      
      console.log('Executing sweep transaction...');
      const execution = await meeClient.executeQuote({ quote });
      
      console.log('Sweep transaction hash:', execution.hash);
      console.log('Sweep completed successfully');
      setSweepSuccess(true);
    } catch (error) {
      console.error('Sweep failed:', error);
      setSweepError(error instanceof Error ? error.message : 'Sweep failed');
    } finally {
      setIsSweeping(false);
    }
  }, [address, chainId, isInitialized, isInitializedForCurrentChain, zapData, isZapDataSuccess, projectData, walletClient, getClients, switchChainAsync]);

  return {
    isSweeping,
    sweepError,
    sweepSuccess,
    hasTokensToSweep: hasTokensToSweepState,
    sweepTokens,
  };
};
