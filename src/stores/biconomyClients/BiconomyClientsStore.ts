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

export type BiconomyClients = {
  meeClient: MeeClient;
  oNexus: MultichainSmartAccount;
};

type ProjectKey = `${EVMAddress}-${number}`;
type WalletKey = `${EVMAddress}-${number}`;
type ToAddressKey = `${EVMAddress}-${number}-${EVMAddress}`;

interface BiconomyClientsState {
  clientsMap: Map<ProjectKey, Map<WalletKey, BiconomyClients>>;
  toAddressMap: Map<ToAddressKey, EVMAddress>;
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
    destinationChainId?: number,
    walletClient?: UseWalletClientReturnType['data'],
    currentChainId?: number,
  ) => Promise<BiconomyClients | null>;
  getToAddress: (
    projectAddress?: EVMAddress,
    destinationChainId?: number,
    walletAddress?: EVMAddress,
  ) => EVMAddress | undefined;
}

const getProjectKey = (
  projectAddress: EVMAddress,
  projectChainId: number,
): ProjectKey => `${projectAddress}-${projectChainId}`;

const getWalletKey = (
  walletAddress: EVMAddress,
  currentChainId: number,
): WalletKey => `${walletAddress}-${currentChainId}`;

const getToAddressKey = (
  projectAddress: EVMAddress,
  projectChainId: number,
  walletAddress: EVMAddress,
): ToAddressKey => `${projectAddress}-${projectChainId}-${walletAddress}`;

const findChain = (chainId: number) =>
  Object.values(chains).find((chain) => chain.id === chainId);

const BICONOMY_CONFIG = {
  factoryAddress: '0x0000006648ED9B2B842552BE63Af870bC74af837',
  implementationAddress: '0x00000000383e8cBe298514674Ea60Ee1d1de50ac',
  bootStrapAddress: '0x0000003eDf18913c01cBc482C978bBD3D6E8ffA3',
} as const;

const MEE_CLIENT_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_BICONOMY_API_KEY,
} as const;

export const useBiconomyClientsStore =
  createWithEqualityFn<BiconomyClientsState>(
    (set, get) => ({
      clientsMap: new Map(),
      toAddressMap: new Map(),

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
        projectChainId?: number,
        walletAddress?: EVMAddress,
      ) => {
        if (
          !get().validateProject({
            projectAddress,
            projectChainId,
          })
        ) {
          return;
        }

        if (!walletAddress) {
          return;
        }

        const toAddressKey = getToAddressKey(
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
        currentChainId,
      ) => {
        if (!walletClient) {
          console.warn('Wallet client is undefined, skipping initialization');
          return null;
        }

        if (
          !get().validateProject({
            projectAddress,
            projectChainId,
          })
        ) {
          return null;
        }
        if (
          !get().validateWallet({
            currentChainId,
            walletAddress: walletClient?.account?.address,
          })
        ) {
          return null;
        }

        const walletAddress = walletClient.account.address;
        const projectKey = getProjectKey(projectAddress!, projectChainId!);
        const walletKey = getWalletKey(walletAddress!, currentChainId!);

        // Check if clients already exist
        const projectClients = get().clientsMap.get(projectKey);
        const existingClients = projectClients?.get(walletKey);
        if (existingClients) {
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

            const newToAddressMap = new Map(state.toAddressMap);
            const toAddressKey = getToAddressKey(
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
