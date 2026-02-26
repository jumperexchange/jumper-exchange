/**
 * Custom wagmi connector for the Jumper Internal Wallet.
 *
 * Implements createConnector() so the Jumper Account appears in the
 * wallet selection menu managed by @lifi/wallet-management.
 *
 * The connector communicates with the UI via a store-mediated event pattern:
 * - connect() emits "connect requested" via the Zustand store
 * - The UI renders the sign-up/login modal
 * - The modal resolves a Promise when the user completes the flow
 */
import { createConnector } from 'wagmi';
import type { CreateConnectorFn } from 'wagmi';
import { getAddress } from 'viem';
import {
  JUMPER_WALLET_ADDRESS_KEY,
  JUMPER_WALLET_CONNECTOR_ID,
  JUMPER_WALLET_CONNECTOR_NAME,
} from '@/config/jumperWallet';
import {
  createJumperWalletProvider,
  type JumperWalletEIP1193Provider,
} from './jumperWalletProvider';

export interface JumperWalletConnectorCallbacks {
  /**
   * Called when the connector needs the user to connect (sign-up or login).
   * Should trigger the appropriate UI flow and resolve with the wallet address,
   * or null if the user cancelled.
   */
  onConnectRequest: () => Promise<`0x${string}` | null>;
}

let callbacks: JumperWalletConnectorCallbacks | null = null;
let providerInstance: JumperWalletEIP1193Provider | null = null;

/**
 * Set the callbacks for the connector.
 * Called by the Zustand store provider to wire up UI flows.
 */
export function setJumperWalletCallbacks(
  cb: JumperWalletConnectorCallbacks,
): void {
  callbacks = cb;
}

/**
 * Get the current EIP-1193 provider instance.
 * Used by the store to set/clear the account for signing.
 */
export function getJumperWalletProvider(): JumperWalletEIP1193Provider | null {
  return providerInstance;
}

export function jumperWalletConnector(): CreateConnectorFn {
  return createConnector((config) => {
    let connected = false;
    let currentAddress: `0x${string}` | null = null;

    return {
      id: JUMPER_WALLET_CONNECTOR_ID,
      name: JUMPER_WALLET_CONNECTOR_NAME,
      type: 'jumperWallet',

      async setup() {
        const stored = localStorage.getItem(JUMPER_WALLET_ADDRESS_KEY);
        if (stored) {
          currentAddress = stored as `0x${string}`;
        }
      },

      async connect({ chainId } = {}) {
        // If we don't have an address, trigger the UI flow
        if (!currentAddress) {
          if (!callbacks) {
            throw new Error('Jumper wallet callbacks not configured');
          }
          const address = await callbacks.onConnectRequest();
          if (!address) {
            throw new Error('User cancelled Jumper wallet connection');
          }
          currentAddress = address;
        }

        const chain =
          config.chains.find(
            (c) => c.id === (chainId ?? config.chains[0].id),
          ) ?? config.chains[0];

        // Create provider if needed
        if (!providerInstance) {
          providerInstance = createJumperWalletProvider({
            address: currentAddress,
            chainId: chain.id,
            rpcUrl: chain.rpcUrls.default.http[0],
          });
        }

        connected = true;
        localStorage.setItem(JUMPER_WALLET_ADDRESS_KEY, currentAddress);

        return {
          accounts: [getAddress(currentAddress)],
          chainId: chain.id,
        } as never;
      },

      async disconnect() {
        connected = false;
        providerInstance?.setAccount(null);
        providerInstance = null;
        currentAddress = null;
        localStorage.removeItem(JUMPER_WALLET_ADDRESS_KEY);
      },

      async getAccounts() {
        if (!currentAddress) {
          return [];
        }
        return [getAddress(currentAddress)];
      },

      async getChainId() {
        if (!providerInstance) {
          return config.chains[0].id;
        }
        const hexChainId = (await providerInstance.request({
          method: 'eth_chainId',
        })) as string;
        return Number(hexChainId);
      },

      async isAuthorized() {
        return !!localStorage.getItem(JUMPER_WALLET_ADDRESS_KEY);
      },

      async switchChain({ chainId }) {
        const chain = config.chains.find((c) => c.id === chainId);
        if (!chain) {
          throw new Error(`Chain ${chainId} not configured`);
        }

        providerInstance?.setChain(chainId, chain.rpcUrls.default.http[0]);
        config.emitter.emit('change', { chainId });

        return chain;
      },

      onAccountsChanged(accounts) {
        if (accounts.length === 0) {
          this.onDisconnect();
        } else {
          config.emitter.emit('change', {
            accounts: accounts.map((a) => getAddress(a)),
          });
        }
      },

      onChainChanged(chain) {
        config.emitter.emit('change', { chainId: Number(chain) });
      },

      async onDisconnect() {
        config.emitter.emit('disconnect');
        connected = false;
      },

      async getProvider() {
        if (!providerInstance) {
          const chain = config.chains[0];
          providerInstance = createJumperWalletProvider({
            address:
              currentAddress ?? '0x0000000000000000000000000000000000000000',
            chainId: chain.id,
            rpcUrl: chain.rpcUrls.default.http[0],
          });
        }
        return providerInstance;
      },
    };
  });
}
