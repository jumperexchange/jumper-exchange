/**
 * Network configuration shape for blockchain networks.
 */
export interface NetworkConfig {
  chainId: string;
  currencySymbol: string;
  networkName: string;
  rpcUrl: string;
}

/**
 * Network constants for common blockchain environments.
 */
export const networks: Record<string, NetworkConfig> = {
  baseSepolia: {
    chainId: '84532',
    currencySymbol: 'ETH',
    networkName: 'Base Sepolia Testnet',
    rpcUrl: 'https://sepolia.base.org',
  },
  optimism: {
    chainId: '10',
    currencySymbol: 'ETH',
    networkName: 'Optimism',
    rpcUrl: 'https://mainnet.optimism.io',
  },
};
