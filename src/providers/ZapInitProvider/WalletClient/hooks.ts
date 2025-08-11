import { useCallback } from 'react';
import { EVMAddress } from 'src/types/internal';
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
  const { data: walletClient } = useWalletClient({
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
        console.warn(
          'initializeClients based on these wallet client values',
          walletClient?.chain?.id,
          walletClient?.account.address,
        );

        if (
          address &&
          chainId &&
          (walletClient?.account.address !== address ||
            walletClient?.chain?.id !== chainId)
        ) {
          throw new Error(
            'Current wallet client is initialized on different chain or address',
          );
        }

        // Note: getClients would need to be passed as parameter or imported
        const biconomyClients = await getClients(
          projectAddress,
          projectChainId,
          walletClient,
          chainId,
        );

        return { walletClient, biconomyClients };
      } catch (error) {
        console.error('Failed to initialize clients:', error);
        return { walletClient: null, biconomyClients: null };
      }
    },
    [wagmiConfig, walletClient?.account.address, walletClient?.chain?.id],
  );

  return { initializeClients };
};
