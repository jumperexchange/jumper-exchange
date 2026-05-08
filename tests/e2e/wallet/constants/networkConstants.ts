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
  baseMainnet: {
    chainId: '8453',
    currencySymbol: 'ETH',
    networkName: 'Base',
    rpcUrl: 'https://mainnet.base.org',
  },
  baseSepolia: {
    chainId: '84532',
    currencySymbol: 'ETH',
    networkName: 'Base Sepolia Testnet',
    rpcUrl: 'https://sepolia.base.org',
  },
  hederaTestnet: {
    chainId: '296',
    currencySymbol: 'HBAR',
    networkName: 'Hedera Testnet',
    rpcUrl: 'https://testnet.hashio.io/api',
  },
  optimism: {
    chainId: '10',
    currencySymbol: 'ETH',
    networkName: 'Optimism',
    rpcUrl: 'https://mainnet.optimism.io',
  },
  polygon: {
    chainId: '137',
    currencySymbol: 'MATIC',
    networkName: 'Polygon',
    rpcUrl: 'https://polygon-rpc.com',
  },
  ronin: {
    chainId: '2021',
    currencySymbol: 'RON',
    networkName: 'Ronin',
    rpcUrl: 'https://ronin.roninchain.com',
  },
  sepolia: {
    chainId: '11155111',
    currencySymbol: 'ETH',
    networkName: 'Sepolia',
    rpcUrl: 'https://sepolia.infura.io/v3/your-api-key',
  },
  solana: {
    chainId: '',
    currencySymbol: '',
    networkName: 'Solana',
    rpcUrl: '',
  },
};
