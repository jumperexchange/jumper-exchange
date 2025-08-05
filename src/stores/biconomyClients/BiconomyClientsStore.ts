'use client';
import {
  createMeeClient,
  MeeClient,
  MultichainSmartAccount,
  toMultichainNexusAccount,
} from '@biconomy/abstractjs';
import { http } from 'viem';
import { chains } from '../../const/chains/chains';
import { createWithEqualityFn } from 'zustand/traditional';
import { retryWithBackoff } from 'src/utils/retryWithBackoff';
import { UseWalletClientReturnType } from 'wagmi';
import { EVMAddress } from 'src/types/internal';

type BiconomyClients = {
  meeClient: MeeClient;
  oNexus: MultichainSmartAccount;
};

type ProjectKey = `${EVMAddress}-${number}`;
type WalletKey = `${EVMAddress}-${number}`;

interface BiconomyClientsState {
  clientsMap: Map<ProjectKey, Map<WalletKey, BiconomyClients>>;
  validateProject: (params: {
    projectAddress?: EVMAddress;
    projectChainId?: number;
  }) => params is { projectAddress: EVMAddress; projectChainId: number };
  validateWallet: (params: {
    currentChainId?: number;
    walletAddress?: EVMAddress;
  }) => params is { currentChainId: number; walletAddress: EVMAddress };
  hasProjectClients: (
    projectAddress?: EVMAddress,
    projectChainId?: number,
  ) => boolean;
  hasWalletClients: (
    projectAddress?: EVMAddress,
    projectChainId?: number,
    walletAddress?: EVMAddress,
    currentChainId?: number,
  ) => boolean;
  getClients: (
    projectAddress?: EVMAddress,
    sourceChainId?: number,
    destinationChainId?: number,
    walletClient?: UseWalletClientReturnType['data'],
  ) => Promise<BiconomyClients | null>;
  getToAddress: (
    projectAddress?: EVMAddress,
    sourceChainId?: number,
    destinationChainId?: number,
    walletAddress?: EVMAddress,
  ) => EVMAddress;
}

const getProjectKey = (
  projectAddress: EVMAddress,
  projectChainId: number,
): ProjectKey => `${projectAddress}-${projectChainId}`;

const getWalletKey = (
  walletAddress: EVMAddress,
  currentChainId: number,
): WalletKey => `${walletAddress}-${currentChainId}`;

const findChain = (chainId: number) =>
  Object.values(chains).find((chain) => chain.id === chainId);

const BICONOMY_CONFIG = {
  factoryAddress: '0x0000006648ED9B2B842552BE63Af870bC74af837',
  implementationAddress: '0x00000000383e8cBe298514674Ea60Ee1d1de50ac',
  bootStrapAddress: '0x0000003eDf18913c01cBc482C978bBD3D6E8ffA3',
} as const;

const MEE_CLIENT_CONFIG = {
  // @TODO: add api key
  // apiKey: process.env.NEXT_PUBLIC_BICONOMY_API_KEY,
} as const;

export const useBiconomyClientsStore =
  createWithEqualityFn<BiconomyClientsState>(
    (set, get) => ({
      clientsMap: new Map(),

      validateProject: (params: {
        projectAddress?: EVMAddress;
        projectChainId?: number;
      }): params is { projectAddress: EVMAddress; projectChainId: number } => {
        if (!params.projectAddress) {
          console.warn('Missing projectAddress, skipping initialization');
          return false;
        }

        if (!params.projectChainId) {
          console.warn('Missing projectChainId, skipping initialization');
          return false;
        }

        return true;
      },

      validateWallet: (params: {
        currentChainId?: number;
        walletAddress?: EVMAddress;
      }): params is { currentChainId: number; walletAddress: EVMAddress } => {
        if (!params.walletAddress) {
          console.warn('Missing walletAddress, skipping initialization');
          return false;
        }

        if (!params.currentChainId) {
          console.warn('Missing currentChainId, skipping initialization');
          return false;
        }

        return true;
      },

      hasProjectClients: (projectAddress, projectChainId) => {
        if (!get().validateProject({ projectAddress, projectChainId })) {
          return false;
        }

        const projectKey = getProjectKey(projectAddress!, projectChainId!);
        return get().clientsMap.has(projectKey);
      },

      hasWalletClients: (
        projectAddress,
        projectChainId,
        walletAddress,
        currentChainId,
      ) => {
        if (!get().validateProject({ projectAddress, projectChainId })) {
          return false;
        }
        if (!get().validateWallet({ currentChainId, walletAddress })) {
          return false;
        }

        const projectKey = getProjectKey(projectAddress!, projectChainId!);
        const walletKey = getWalletKey(walletAddress!, currentChainId!);
        const projectClients = get().clientsMap.get(projectKey);
        return projectClients?.has(walletKey) ?? false;
      },

      getToAddress: (
        projectAddress?: EVMAddress,
        sourceChainId?: number,
        destinationChainId?: number,
        walletAddress?: EVMAddress,
      ) => {
        const fallbackAddress = walletAddress || '0x';
        if (
          !get().validateProject({
            projectAddress,
            projectChainId: destinationChainId,
          })
        ) {
          return fallbackAddress;
        }
        if (
          !get().validateWallet({
            currentChainId: sourceChainId,
            walletAddress,
          })
        ) {
          return fallbackAddress;
        }

        const projectKey = getProjectKey(projectAddress!, destinationChainId!);
        const walletKey = getWalletKey(walletAddress!, sourceChainId!);

        // Get existing clients without initialization
        const projectClients = get().clientsMap.get(projectKey);
        const existingClients = projectClients?.get(walletKey);

        if (!existingClients) {
          return fallbackAddress;
        }

        return existingClients.oNexus.addressOn(
          destinationChainId!,
          true,
        ) as EVMAddress;
      },

      getClients: async (
        projectAddress,
        sourceChainId,
        destinationChainId,
        walletClient,
      ) => {
        if (!walletClient) {
          console.warn('Wallet client is undefined, skipping initialization');
          return null;
        }

        if (
          !get().validateProject({
            projectAddress,
            projectChainId: destinationChainId,
          })
        ) {
          return null;
        }
        if (
          !get().validateWallet({
            currentChainId: sourceChainId,
            walletAddress: walletClient?.account?.address,
          })
        ) {
          return null;
        }

        const walletAddress = walletClient.account.address;
        const projectKey = getProjectKey(projectAddress!, destinationChainId!);
        const walletKey = getWalletKey(walletAddress!, sourceChainId!);

        // Check if clients already exist
        const projectClients = get().clientsMap.get(projectKey);
        const existingClients = projectClients?.get(walletKey);
        if (existingClients) {
          return existingClients;
        }

        // Find chains
        const currentChain = findChain(sourceChainId!);
        const depositChain = findChain(destinationChainId!);

        if (!currentChain || !depositChain) {
          console.error('Chain not found', {
            sourceChainId,
            destinationChainId,
          });
          return null;
        }

        // Initialize new clients
        try {
          const { oNexus, meeClient } = await retryWithBackoff(async () => {
            const oNexusInit = await toMultichainNexusAccount({
              signer: walletClient,
              chains: [currentChain, depositChain],
              transports: [http(), http()],
              ...BICONOMY_CONFIG,
            });

            const meeClientInit = await createMeeClient({
              account: oNexusInit,
              ...MEE_CLIENT_CONFIG,
            });

            return { oNexus: oNexusInit, meeClient: meeClientInit };
          });

          const clients = { meeClient, oNexus };

          console.log('Initialised Biconomy clients, setting state');

          set((state) => {
            // Create new Map to ensure state change detection
            const newClientsMap = new Map(state.clientsMap);

            // Ensure project map exists
            if (!newClientsMap.has(projectKey)) {
              newClientsMap.set(projectKey, new Map());
            }

            // Add wallet clients to project
            const projectMap = newClientsMap.get(projectKey)!;
            const newProjectMap = new Map(projectMap);
            newProjectMap.set(walletKey, clients);
            newClientsMap.set(projectKey, newProjectMap);

            return {
              ...state,
              clientsMap: newClientsMap,
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
