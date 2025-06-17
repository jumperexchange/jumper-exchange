import { getWalletClient, switchChain } from '@wagmi/core';

export interface CustomEVMProviderHandlers {
  wagmiConfig: any;
  getCapabilities: (client: any, args: any) => Promise<any>;
  getCallsStatus: (client: any, args: any) => Promise<any>;
  sendCalls: (client: any, args: any) => Promise<any>;
  waitForCallsStatus: (client: any, args: any) => Promise<any>;
  getWagmiConnectorClient: (wagmiConfig: any, args: any) => any;
}

export function createCustomEVMProvider({
  wagmiConfig,
  getCapabilities,
  getCallsStatus,
  sendCalls,
  waitForCallsStatus,
  getWagmiConnectorClient,
}: CustomEVMProviderHandlers) {
  return {
    getWalletClient: async () => {
      const client = await getWalletClient(wagmiConfig);
      return client.extend((client: any) => ({
        getCapabilities: (args: any) => getCapabilities(client, args),
        getCallsStatus: (args: any) => getCallsStatus(client, args),
        sendCalls: (args: any) => sendCalls(client, args),
        waitForCallsStatus: (args: any) => waitForCallsStatus(client, args),
      }));
    },
    switchChain: async (chainId: number) => {
      const chain = await switchChain(wagmiConfig, { chainId });
      return getWagmiConnectorClient(wagmiConfig, { chainId: chain.id });
    },
  };
} 