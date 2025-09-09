import { useCallback, useState, useEffect } from 'react';
import { useAccount } from '@lifi/wallet-management';
import { useWalletClient } from 'wagmi';
import { useZapInitContext } from 'src/providers/ZapInitProvider/ZapInitProvider';
import { createSweepTransferInstructions, hasTokensToSweep } from 'src/providers/ZapInitProvider/utils';
import { useBiconomyClientsStore } from 'src/stores/biconomyClients/BiconomyClientsStore';
import { Hex } from 'viem';

interface UseSweepTokensReturn {
  isSweeping: boolean;
  sweepError: string | null;
  hasTokensToSweep: boolean;
  sweepTokens: () => Promise<void>;
}

/**
 * Custom hook to handle token sweeping functionality
 * Creates sweep transfer instructions for all token balances on the current EVM chain
 */
export const useSweepTokens = (): UseSweepTokensReturn => {
  const [isSweeping, setIsSweeping] = useState(false);
  const [sweepError, setSweepError] = useState<string | null>(null);
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
      
      // Create sweep transfer instructions for all token balances
      const sweepInstructions = await createSweepTransferInstructions(oNexus, chainId);
      
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
        cleanUps: [], // No cleanups needed for sweep operations
        feeToken: {
          address: '0x0000000000000000000000000000000000000000' as Hex, // Use native token for fees
          chainId: chainId,
          gasRefundAddress: address as Hex,
        },
        trigger: {
          tokenAddress: '0x0000000000000000000000000000000000000000' as Hex,
          amount: BigInt(0), // No specific amount for sweep
          chainId: chainId,
        },
        lowerBoundTimestamp: Math.ceil(Date.now() / 1000),
        upperBoundTimestamp: Math.ceil(Date.now() / 1000) + 300, // 5 minutes timeout
      };

      console.log('Executing sweep quote...');
      const quote = await meeClient.getFusionQuote(sweepQuoteParams);
      
      console.log('Executing sweep transaction...');
      const execution = await meeClient.executeFusionQuote({ fusionQuote: quote });
      
      console.log('Sweep transaction hash:', execution.hash);
      console.log('Sweep completed successfully');
    } catch (error) {
      console.error('Sweep failed:', error);
      setSweepError(error instanceof Error ? error.message : 'Sweep failed');
    } finally {
      setIsSweeping(false);
    }
  }, [address, chainId, isInitialized, isInitializedForCurrentChain, zapData, isZapDataSuccess, projectData, walletClient, getClients]);

  return {
    isSweeping,
    sweepError,
    hasTokensToSweep: hasTokensToSweepState,
    sweepTokens,
  };
};
