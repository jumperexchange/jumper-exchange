'use client';
import { type FC, type PropsWithChildren, useEffect } from 'react';
import { EVMProvider } from './EVMProvider';
import { SVMProvider } from './SVMProvider';
import { UTXOProvider } from './UTXOProvider';
import { createConfig, EVM, Solana, UTXO } from '@lifi/sdk';
import { publicRPCList } from '@/const/rpcList';

// Extend the Window interface to include ethereum optional property
declare global {
  interface Window {
    ethereum?: any; // Use `any` for simplicity in this temporary patch
  }
}

export const WalletProviderZap: FC<PropsWithChildren> = ({ children }) => {
  useEffect(() => {
    // --- TEMPORARY PATCH START ---
    // WARNING: Modifying window.ethereum is generally discouraged.
    // This is a temporary hack to intercept EIP-1193 requests.
    console.warn(
      '[PATCH] Applying temporary patch to window.ethereum.request for wallet_getCapabilities and wallet_sendCalls.',
    );
    if (window.ethereum && typeof window.ethereum.request === 'function') {
      const originalRequest = window.ethereum.request;
      window.ethereum.request = async (args: {
        method: string;
        params?: any[];
      }) => {
        // Intercept wallet_getCapabilities
        if (args.method === 'wallet_getCapabilities') {
          console.log(
            '[PATCHED] Intercepted wallet_getCapabilities call. Args:',
            args,
          );
          const mockCapabilities = {
            '0x1': { // Ethereum Mainnet
              atomic: {
                status: 'supported',
              },
            },
            '0x2105': { // Base Mainnet
              atomic: {
                status: 'supported',
              },
            },
          };
          console.log(
            '[PATCHED] Returning hardcoded EIP-5792 capabilities:',
            mockCapabilities,
          );
          return Promise.resolve(mockCapabilities);
        }
        // Intercept wallet_sendCalls
        else if (args.method === 'wallet_sendCalls') {
          console.log(
            '[PATCHED] Intercepted wallet_sendCalls call. Args:',
            args,
          );
          const mockBundleId = 'mock-bundle-id-123';
          console.log(
            '[PATCHED] Returning mock bundle ID for wallet_sendCalls:',
            mockBundleId,
          );
          // Return a mock bundle ID string (as per EIP-5792 spec)
          return Promise.resolve(mockBundleId);
        }
        // Pass through all other methods
        else {
          return originalRequest(args);
        }
      };
      console.log('[PATCH] window.ethereum.request patched successfully.');
    } else {
      console.warn(
        '[PATCH] window.ethereum or window.ethereum.request not found. Cannot apply patch.',
      );
    }
    // --- TEMPORARY PATCH END ---

    // Initialize LiFi SDK Config (after patch)
    createConfig({
      apiKey: process.env.NEXT_PUBLIC_LIFI_API_KEY,
      apiUrl: process.env.NEXT_PUBLIC_ZAP_API_URL,
      providers: [EVM(), Solana(), UTXO()],
      integrator: process.env.NEXT_PUBLIC_WIDGET_INTEGRATOR,
      rpcUrls: {
        ...JSON.parse(process.env.NEXT_PUBLIC_CUSTOM_RPCS),
        ...publicRPCList,
      },
      preloadChains: true,
    });
  }, []);

  return (
    <EVMProvider>
      <UTXOProvider>
        <SVMProvider>{children}</SVMProvider>
      </UTXOProvider>
    </EVMProvider>
  );
};
