import { useCallback } from 'react';
import { EVMAddress } from 'src/types/internal';
import { getWalletClient } from 'wagmi/actions';
import { useConfig } from 'wagmi';
import { useBiconomyClientsStore } from 'src/stores/biconomyClients/BiconomyClientsStore';

interface WalletClientParams {
  address: EVMAddress;
  chainId: number;
  projectAddress: EVMAddress;
  projectChainId: number;
}

export const useWalletClientInitialization = () => {
  const wagmiConfig = useConfig();
  const { getClients } = useBiconomyClientsStore();

  const initializeClients = useCallback(
    async ({
      address,
      chainId,
      projectAddress,
      projectChainId,
    }: WalletClientParams) => {
      try {
        const walletClient = await getWalletClient(wagmiConfig, {
          account: address,
          chainId,
        });

        if (!walletClient) {
          throw new Error('Failed to get wallet client');
        }

        // Note: getClients would need to be passed as parameter or imported
        const biconomyClients = await getClients(
          projectAddress,
          chainId,
          projectChainId,
          walletClient,
        );

        return { walletClient, biconomyClients };
      } catch (error) {
        console.error('Failed to initialize clients:', error);
        return { walletClient: null, biconomyClients: null };
      }
    },
    [wagmiConfig],
  );

  return { initializeClients };
};
