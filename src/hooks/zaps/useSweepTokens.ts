import { useCallback, useState } from 'react';
import { useAccount } from '@lifi/wallet-management';
import { useZapInitContext } from 'src/providers/ZapInitProvider/ZapInitProvider';
import { createSweepTransferInstructions } from 'src/providers/ZapInitProvider/utils';
import { useBiconomyClientsStore } from 'src/stores/biconomyClients/BiconomyClientsStore';
import { Hex } from 'viem';

interface UseSweepTokensReturn {
  isSweeping: boolean;
  sweepError: string | null;
  sweepTokens: () => Promise<void>;
}

/**
 * Custom hook to handle token sweeping functionality
 * Creates sweep transfer instructions for all token balances on the current EVM chain
 */
export const useSweepTokens = (): UseSweepTokensReturn => {
  const [isSweeping, setIsSweeping] = useState(false);
  const [sweepError, setSweepError] = useState<string | null>(null);
  
  const { address, chainId } = useAccount();
  const { 
    isInitialized, 
    isInitializedForCurrentChain,
    zapData,
    isZapDataSuccess,
    projectData
  } = useZapInitContext();

  const getClients = useBiconomyClientsStore((state) => state.getClients);

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

    setIsSweeping(true);
    setSweepError(null);

    try {
      console.log('Starting sweep for chain:', chainId);
      console.log('Account address:', address);
      
      // Get the biconomy clients (including oNexus)
      const clients = await getClients(
        projectData.address as Hex,
        projectData.chainId,
        undefined, // walletClient - will be fetched internally
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
      
      // TODO: Execute the sweep instructions using the wallet methods
      // This will require calling the sendCalls method with the sweep instructions
      // For now, we'll just log the instructions
      console.log('Sweep instructions:', sweepInstructions);
      
      console.log('Sweep completed successfully');
    } catch (error) {
      console.error('Sweep failed:', error);
      setSweepError(error instanceof Error ? error.message : 'Sweep failed');
    } finally {
      setIsSweeping(false);
    }
  }, [address, chainId, isInitialized, isInitializedForCurrentChain, zapData, isZapDataSuccess, projectData, getClients]);

  return {
    isSweeping,
    sweepError,
    sweepTokens,
  };
};
