'use client';
import {
  createMeeClient,
  getMEEVersion,
  MeeClient,
  MEEVersion,
  MultichainSmartAccount,
  toMultichainNexusAccount,
} from '@biconomy/abstractjs';
import { createWalletClient, custom, http, publicActions } from 'viem';
import { chains } from '../../const/chains/chains';
import { createWithEqualityFn } from 'zustand/traditional';
import { retryWithBackoff } from 'src/utils/retryWithBackoff';
import { UseWalletClientReturnType } from 'wagmi';
import { EVMAddress } from 'src/types/internal';
import { getShuffledRPCForChain } from 'src/utils/rpc/getShuffledRPCForChain';
import envConfig from 'src/config/env-config';

export type BiconomyClients = {
  meeClient: MeeClient;
  oNexus: MultichainSmartAccount;
};

type WalletKey = `${EVMAddress}-${number}`;
type ClientKey = `${EVMAddress}-${number}-${EVMAddress}`;
type ChainKey = `${number}`;

interface BiconomyClientsState {
  clientsMap: Map<ClientKey, Map<ChainKey, BiconomyClients>>;
  toAddressMap: Map<ClientKey, EVMAddress>;
  validateClient: (params: {
    projectAddress?: EVMAddress;
    projectChainId?: number;
    walletAddress?: EVMAddress;
  }) => params is {
    projectAddress: EVMAddress;
    projectChainId: number;
    walletAddress: EVMAddress;
  };
  validateChain: (params: {
    currentChainId?: number;
  }) => params is { currentChainId: number };
  hasClient: (
    projectAddress?: EVMAddress,
    projectChainId?: number,
    walletAddress?: EVMAddress,
  ) => boolean;
  hasChainClients: (
    projectAddress?: EVMAddress,
    projectChainId?: number,
    walletAddress?: EVMAddress,
    currentChainId?: number,
  ) => boolean;
  getClients: (
    projectAddress?: EVMAddress,
    destinationChainId?: number,
    walletClient?: UseWalletClientReturnType['data'],
    provider?: any,
    isEmbeddedWallet?: boolean,
    currentChainId?: number,
  ) => Promise<BiconomyClients | null>;
  getToAddress: (
    projectAddress?: EVMAddress,
    destinationChainId?: number,
    walletAddress?: EVMAddress,
  ) => EVMAddress | undefined;
}

const getClientKey = (
  projectAddress: EVMAddress,
  projectChainId: number,
  walletAddress: EVMAddress,
): ClientKey => `${projectAddress}-${projectChainId}-${walletAddress}`;

const getChainKey = (currentChainId: number): ChainKey => `${currentChainId}`;

const findChain = (chainId: number) =>
  Object.values(chains).find((chain) => chain.id === chainId);

const MEE_CLIENT_CONFIG = {
  apiKey: envConfig.NEXT_PUBLIC_BICONOMY_API_KEY,
} as const;

export const useBiconomyClientsStore =
  createWithEqualityFn<BiconomyClientsState>(
    (set, get) => ({
      clientsMap: new Map(),
      toAddressMap: new Map(),

      validateClient: (params: {
        projectAddress?: EVMAddress;
        projectChainId?: number;
        walletAddress?: EVMAddress;
      }): params is {
        projectAddress: EVMAddress;
        projectChainId: number;
        walletAddress: EVMAddress;
      } => {
        if (!params.projectAddress) {
          console.warn('Missing projectAddress, skipping initialization');
          return false;
        }

        if (!params.projectChainId) {
          console.warn('Missing projectChainId, skipping initialization');
          return false;
        }

        if (!params.walletAddress) {
          console.warn('Missing walletAddress, skipping initialization');
          return false;
        }

        return true;
      },

      validateChain: (params: {
        currentChainId?: number;
      }): params is { currentChainId: number } => {
        if (!params.currentChainId) {
          console.warn('Missing currentChainId, skipping initialization');
          return false;
        }

        return true;
      },

      hasClient: (projectAddress, projectChainId, walletAddress) => {
        if (
          !get().validateClient({
            projectAddress,
            projectChainId,
            walletAddress,
          })
        ) {
          return false;
        }

        const clientKey = getClientKey(
          projectAddress!,
          projectChainId!,
          walletAddress!,
        );
        return get().clientsMap.has(clientKey);
      },

      hasChainClients: (
        projectAddress,
        projectChainId,
        walletAddress,
        currentChainId,
      ) => {
        if (
          !get().validateClient({
            projectAddress,
            projectChainId,
            walletAddress,
          })
        ) {
          return false;
        }
        if (!get().validateChain({ currentChainId })) {
          return false;
        }

        const clientKey = getClientKey(
          projectAddress!,
          projectChainId!,
          walletAddress!,
        );
        const chainKey = getChainKey(currentChainId!);
        const projectClients = get().clientsMap.get(clientKey);
        return projectClients?.has(chainKey) ?? false;
      },

      getToAddress: (
        projectAddress?: EVMAddress,
        projectChainId?: number,
        walletAddress?: EVMAddress,
      ) => {
        if (
          !get().validateClient({
            projectAddress,
            projectChainId,
            walletAddress,
          })
        ) {
          return;
        }

        const toAddressKey = getClientKey(
          projectAddress!,
          projectChainId!,
          walletAddress!,
        );

        const toAddress = get().toAddressMap.get(toAddressKey);

        if (toAddress) {
          return toAddress;
        }

        return;
      },

      getClients: async (
        projectAddress,
        projectChainId,
        walletClient,
        provider,
        isEmbeddedWallet,
        currentChainId,
      ) => {
        if (!walletClient) {
          console.warn('Wallet client is undefined, skipping initialization');
          return null;
        }

        if (
          !get().validateClient({
            projectAddress,
            projectChainId,
            walletAddress: walletClient?.account?.address,
          })
        ) {
          return null;
        }
        if (
          !get().validateChain({
            currentChainId,
          })
        ) {
          return null;
        }

        const walletAddress = walletClient.account.address;
        const clientKey = getClientKey(
          projectAddress!,
          projectChainId!,
          walletAddress!,
        );
        const chainKey = getChainKey(currentChainId!);

        // Check if clients already exist
        const clientClients = get().clientsMap.get(clientKey);
        const existingClients = clientClients?.get(chainKey);
        if (existingClients) {
          console.log(
            `Existing clients found, returning them for ${clientKey}-${chainKey}`,
          );
          return existingClients;
        }

        // Find chains
        const currentChain = findChain(currentChainId!);
        const depositChain = findChain(projectChainId!);

        if (!currentChain || !depositChain) {
          console.error('Chain not found', {
            currentChainId,
            projectChainId,
          });
          return null;
        }

        // Initialize new clients
        try {
          const usedChains = [currentChain, depositChain];
          const { oNexus, meeClient } = await retryWithBackoff(async () => {
            const chainConfigurations = usedChains.map((chain) => {
              const rpcUrl = getShuffledRPCForChain(chain.id);
              console.warn(`Using RPC ${rpcUrl} for chain ${chain.id}`);
              return {
                chain: chain,
                transport: http(rpcUrl || undefined),
                version: getMEEVersion(MEEVersion.V2_1_0),
              };
            });

            const oNexusInit = await toMultichainNexusAccount({
              signer: createWalletClient({
                account: walletClient.account.address as EVMAddress,
                chain: walletClient.chain,
                transport: custom(provider, { key: 'jumper-custom-zap' }),
              }),
              // accountAddress: isEmbeddedWallet
              //   ? walletClient.account.address
              //   : undefined,
              chainConfigurations,
            });

            oNexusInit.deployments.forEach((deployment) => {
              deployment.walletClient = createWalletClient({
                account: deployment.walletClient.account.address as EVMAddress,
                chain: deployment.walletClient.chain,
                transport: custom(provider, { key: 'jumper-custom-zap' }),
              }).extend(publicActions);
            });

            const meeClientInit = await createMeeClient({
              account: oNexusInit,
              ...MEE_CLIENT_CONFIG,
            });

            return { oNexus: oNexusInit, meeClient: meeClientInit };
          });

          const clients = { meeClient, oNexus };

          console.log(
            `Initialised Biconomy clients, setting state for ${clientKey}-${chainKey}`,
          );

          set((state) => {
            // Create new Map to ensure state change detection
            const newClientsMap = new Map(state.clientsMap);

            // Ensure project map exists
            if (!newClientsMap.has(clientKey)) {
              newClientsMap.set(clientKey, new Map());
            }

            // Add wallet clients to project
            const clientMap = newClientsMap.get(clientKey)!;
            const newClientMap = new Map(clientMap);
            newClientMap.set(chainKey, clients);
            newClientsMap.set(clientKey, newClientMap);

            const newToAddressMap = new Map(state.toAddressMap);
            const toAddressKey = getClientKey(
              projectAddress!,
              projectChainId!,
              walletAddress!,
            );
            // Add to address to map
            if (!newToAddressMap.has(toAddressKey)) {
              newToAddressMap.set(
                toAddressKey,
                clients.oNexus.addressOn(projectChainId!, true) as EVMAddress,
              );
            }

            return {
              ...state,
              clientsMap: newClientsMap,
              toAddressMap: newToAddressMap,
            };
          });

          return clients;
        } catch (error) {
          console.error('Failed to initialize Biconomy clients:', error);
          return null;
        }
      },
    }),
    Object.is,
  );
