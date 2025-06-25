import { getWalletClient } from '@wagmi/core';
import { EVM, type EVMProvider } from '@lifi/sdk';
import type { Config } from 'wagmi';
import type { Client } from 'viem';

// Types from the ZapWidget component
interface WalletCall {
  to: `0x${string}`;
  data: `0x${string}`;
  value?: string;
}

interface WalletMethodArgs {
  method: string;
  params?: unknown[];
}

interface WalletSendCallsArgs extends WalletMethodArgs {
  method: 'wallet_sendCalls';
  account: {
    address: string;
    type: string;
  };
  calls: WalletCall[];
}

interface WalletGetCallsStatusArgs extends WalletMethodArgs {
  method: 'wallet_getCallsStatus';
  params: [string]; // hash
}

interface WalletCapabilitiesArgs extends WalletMethodArgs {
  method: 'wallet_getCapabilities';
  params?: never;
}

// Return types for the handlers
interface CapabilitiesResponse {
  atomic: { status: 'supported' | 'ready' | 'unsupported' };
}

interface CallsStatusResponse {
  atomic: boolean;
  chainId?: string;
  id: string;
  status: number;
  receipts: Array<{
    transactionHash: `0x${string}`;
    status: 'success' | 'reverted';
  }>;
}

interface SendCallsResponse {
  id: string;
}

export interface CustomEVMProviderHandlers {
  wagmiConfig: Config;
  getCapabilities: (client: Client, args: WalletCapabilitiesArgs) => Promise<CapabilitiesResponse>;
  getCallsStatus: (client: Client, args: WalletGetCallsStatusArgs) => Promise<CallsStatusResponse>;
  sendCalls: (client: Client, args: WalletSendCallsArgs) => Promise<SendCallsResponse>;
}

export function createCustomEVMProvider({
  wagmiConfig,
  getCapabilities,
  getCallsStatus,
  sendCalls,
}: CustomEVMProviderHandlers): EVMProvider {
  // Create base EVM provider
  const baseProvider = EVM({
    getWalletClient: async () => {
      const client = await getWalletClient(wagmiConfig);
      return client.extend((client: Client) => ({
        getCapabilities: (args: WalletCapabilitiesArgs) => getCapabilities(client, args),
        getCallsStatus: (args: WalletGetCallsStatusArgs) => getCallsStatus(client, args),
        sendCalls: (args: WalletSendCallsArgs) => sendCalls(client, args),
      }));
    }
  });

  return baseProvider;
} 