import { useCallback } from 'react';
import { EVMAddress } from 'src/types/internal';
// import { getWalletClient } from '@wagmi/core';
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

        if (
          !address ||
          !chainId ||
          fallbackWalletClient?.account.address !== address ||
          fallbackWalletClient?.chain?.id !== chainId
        ) {
          throw new Error(
            'Wallet client is not initialized or is not on the correct chain',
          );
          // @Note: We need to update the sendParams to use only the route chainId and address for this to work
          // walletClient = await getWalletClient(wagmiConfig, {
          //   account: address,
          //   chainId,
          // });
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
    [wagmiConfig, fallbackWalletClient],
  );

  return { initializeClients };
};
