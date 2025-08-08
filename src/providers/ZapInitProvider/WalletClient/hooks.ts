import { useCallback } from 'react';
import { EVMAddress } from 'src/types/internal';
import { getWalletClient } from '@wagmi/core';
import { useConfig, useWalletClient } from 'wagmi';
import { useBiconomyClientsStore } from 'src/stores/biconomyClients/BiconomyClientsStore';
import { useAccount } from '@lifi/wallet-management';

interface WalletClientParams {
  address?: EVMAddress;
  chainId?: number;
  projectAddress: EVMAddress;
  projectChainId: number;
}

export const useWalletClientInitialization = () => {
  const wagmiConfig = useConfig();
  const { getClients } = useBiconomyClientsStore();
  const { account } = useAccount();
  const { address, chainId } = account;
  const { data: fallbackWalletClient } = useWalletClient({
    account: address as EVMAddress,
    chainId,
    query: {
      enabled: !!address && !!chainId,
    },
  });

  const initializeClients = useCallback(
    async ({
      address,
      chainId,
      projectAddress,
      projectChainId,
    }: WalletClientParams) => {
      try {
        let walletClient = fallbackWalletClient;
        let currentChainId = fallbackWalletClient?.chain?.id;

        console.warn(
          'initializeClients based on these wallet client values',
          address,
          chainId,
          fallbackWalletClient?.chain?.id,
          fallbackWalletClient?.account.address,
          fallbackWalletClient,
        );

        if (
          address &&
          chainId &&
          (fallbackWalletClient?.account.address !== address ||
            fallbackWalletClient?.chain?.id !== chainId)
        ) {
          currentChainId = chainId;
          walletClient = await getWalletClient(wagmiConfig, {
            account: address,
            chainId,
          });
        }

        // Note: getClients would need to be passed as parameter or imported
        const biconomyClients = await getClients(
          projectAddress,
          projectChainId,
          walletClient,
          currentChainId,
        );

        return { walletClient, biconomyClients };
      } catch (error) {
        console.error('Failed to initialize clients:', error);
        return { walletClient: null, biconomyClients: null };
      }
    },
    [
      wagmiConfig,
      fallbackWalletClient?.account.address,
      fallbackWalletClient?.chain?.id,
    ],
  );

  return { initializeClients };
};
