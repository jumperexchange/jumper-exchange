import { getWalletClient, switchChain, getConnectorClient } from '@wagmi/core';
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

interface WalletWaitForCallsStatusArgs extends WalletMethodArgs {
  method: 'wallet_waitForCallsStatus';
  id: string;
  timeout?: number;
}

// Return types for the handlers
interface CapabilitiesResponse {
  atomic: { status: 'supported' | 'ready' | 'unsupported' };
}

interface CallsStatusResponse {
  atomic: boolean;
  chainId?: string;
  id: string;
  status: string; // 'success' | 'failed' - string status as expected by LiFi SDK
  statusCode: number; // 200 | 400 - numeric status code
  receipts: Array<{
    transactionHash: `0x${string}`;
    status: 'success' | 'reverted';
  }>;
}

interface SendCallsResponse {
  id: string;
}

type WaitForCallsStatusResponse = CallsStatusResponse;

export interface CustomEVMProviderHandlers {
  wagmiConfig: Config;
  getCapabilities: (client: Client, args: WalletCapabilitiesArgs) => Promise<CapabilitiesResponse>;
  getCallsStatus: (client: Client, args: WalletGetCallsStatusArgs) => Promise<CallsStatusResponse>;
  sendCalls: (client: Client, args: WalletSendCallsArgs) => Promise<SendCallsResponse>;
  waitForCallsStatus: (client: Client, args: WalletWaitForCallsStatusArgs) => Promise<WaitForCallsStatusResponse>;
}

export function createCustomEVMProvider({
  wagmiConfig,
  getCapabilities,
  getCallsStatus,
  waitForCallsStatus,
  sendCalls,
}: CustomEVMProviderHandlers): EVMProvider {
  // Create base EVM provider
  const baseProvider = EVM({
    getWalletClient: async () => {
      const client = await getWalletClient(wagmiConfig);
      return client.extend((client: Client) => ({
        getCapabilities: (args: WalletCapabilitiesArgs) => getCapabilities(client, args),
        getCallsStatus: (args: WalletGetCallsStatusArgs) => getCallsStatus(client, args),
        waitForCallsStatus: (args: WalletWaitForCallsStatusArgs) => waitForCallsStatus(client, args),
        sendCalls: (args: WalletSendCallsArgs) => sendCalls(client, args),
      }));
    },
    switchChain: async (chainId: number) => {
      const chain = await switchChain(wagmiConfig, { chainId });
      return getConnectorClient(wagmiConfig, { chainId: chain.id });
    },
  });

  return baseProvider;
} 