// Ethereum
const ETH_ETHEREUM = {
  address: '0x0000000000000000000000000000000000000000',
  chainId: 1,
  symbol: 'ETH',
  decimals: 18,
  name: 'ETH',
  logoURI:
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
};
const ETH_WETH = {
  address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  chainId: 1,
  symbol: 'WETH',
  decimals: 18,
  name: 'WETH',
  logoURI:
    'https://static.debank.com/image/eth_token/logo_url/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2/61844453e63cf81301f845d7864236f6.png',
};
const ETH_USDT = {
  address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  chainId: 1,
  symbol: 'USDT',
  decimals: 6,
  name: 'USDT',
  logoURI:
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
};
const ETH_USDC = {
  address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  chainId: 1,
  symbol: 'USDC',
  decimals: 6,
  name: 'USD Coin',
  logoURI:
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
};
const ETH_DAI = {
  address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  chainId: 1,
  symbol: 'DAI',
  decimals: 18,
  name: 'DAI Stablecoin',
  logoURI:
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
};
const ETH_WBTC = {
  address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
  chainId: 1,
  symbol: 'WBTC',
  decimals: 8,
  name: 'WBTC',
  logoURI:
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png',
};

export const ethereum_popular_tokens = [
  ETH_ETHEREUM,
  ETH_WETH,
  ETH_USDT,
  ETH_USDC,
  ETH_DAI,
  ETH_WBTC,
];

// Arbitrum
const ARB_ETHEREUM = {
  address: '0x0000000000000000000000000000000000000000',
  chainId: 42161,
  symbol: 'ETH',
  decimals: 18,
  name: 'ETH',
  logoURI:
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
};
const ARB_WETH = {
  address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
  chainId: 42161,
  symbol: 'WETH',
  decimals: 18,
  name: 'WETH',
  logoURI:
    'https://static.debank.com/image/era_token/logo_url/0x5aea5775959fbc2557cc8789bc1bf90a239d9a91/61844453e63cf81301f845d7864236f6.png',
};
const ARB_USDT = {
  address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
  chainId: 42161,
  symbol: 'USDT',
  decimals: 6,
  name: 'USDT',
  logoURI:
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
};
const ARB_USDC = {
  address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
  chainId: 42161,
  symbol: 'USDC',
  decimals: 6,
  name: 'USD Coin',
  logoURI:
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
};
const ARB_DAI = {
  address: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
  chainId: 42161,
  symbol: 'DAI',
  decimals: 18,
  name: 'DAI Stablecoin',
  logoURI:
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
};
const ARB_WBTC = {
  address: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
  chainId: 42161,
  symbol: 'WBTC',
  decimals: 8,
  name: 'WBTC',
  logoURI:
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png',
};
const ARB_ARBITRUM = {
  address: '0x912CE59144191C1204E64559FE8253a0e49E6548',
  chainId: 42161,
  symbol: 'ARB',
  decimals: 18,
  name: 'Arbitrum',
  logoURI:
    'https://static.debank.com/image/coin/logo_url/arbitrum/854f629937ce94bebeb2cd38fb336de7.png',
};

export const arb_popular_tokens = [
  ARB_ETHEREUM,
  ARB_WETH,
  ARB_USDT,
  ARB_USDC,
  ARB_DAI,
  ARB_WBTC,
  ARB_ARBITRUM,
];

// Optimism
const OP_ETHEREUM = {
  address: '0x0000000000000000000000000000000000000000',
  chainId: 10,
  symbol: 'ETH',
  decimals: 18,
  name: 'ETH',
  logoURI:
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
};
const OP_WETH = {
  address: '0x4200000000000000000000000000000000000006',
  chainId: 10,
  symbol: 'WETH',
  decimals: 18,
  name: 'Wrapped ETH',
  logoURI:
    'https://static.debank.com/image/op_token/logo_url/0x4200000000000000000000000000000000000006/61844453e63cf81301f845d7864236f6.png',
};
const OP_USDT = {
  address: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
  chainId: 10,
  symbol: 'USDT',
  decimals: 6,
  name: 'USDT',
  logoURI:
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
};
const OP_USDCE = {
  address: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607',
  chainId: 10,
  symbol: 'USDC.e',
  decimals: 6,
  name: 'Bridged USD Coin',
  logoURI:
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
};
const OP_DAI = {
  address: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
  chainId: 10,
  symbol: 'DAI',
  decimals: 18,
  name: 'DAI Stablecoin',
  logoURI:
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
};
const OP_WBTC = {
  address: '0x68f180fcCe6836688e9084f035309E29Bf0A2095',
  chainId: 10,
  symbol: 'WBTC',
  decimals: 8,
  name: 'WBTC',
  logoURI:
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png',
};
const OP_OPTIMISM = {
  address: '0x4200000000000000000000000000000000000042',
  chainId: 10,
  symbol: 'OP',
  decimals: 18,
  name: 'Optimism',
  logoURI:
    'https://static.debank.com/image/op_token/logo_url/0x4200000000000000000000000000000000000042/029a56df18f88f4123120fdcb6bea40b.png',
  priceUSD: '3.173',
};

export const op_popular_tokens = [
  OP_ETHEREUM,
  OP_WETH,
  OP_USDT,
  OP_USDCE,
  OP_DAI,
  OP_WBTC,
  OP_OPTIMISM,
];

// Polygon
const MATIC_POLYGON = {
  address: '0x0000000000000000000000000000000000000000',
  chainId: 137,
  symbol: 'MATIC',
  decimals: 18,
  name: 'MATIC',
  logoURI:
    'https://static.debank.com/image/matic_token/logo_url/matic/6f5a6b6f0732a7a235131bd7804d357c.png',
};
const MATIC_WMATIC = {
  address: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
  chainId: 137,
  symbol: 'WMATIC',
  decimals: 18,
  name: 'WMATIC',
  logoURI:
    'https://static.debank.com/image/matic_token/logo_url/0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270/f6e604ba0324726a3d687c618aa4f163.png',
};
const MATIC_USDT = {
  address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
  chainId: 137,
  symbol: 'USDT',
  decimals: 6,
  name: 'USDT',
  logoURI:
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
};
const MATIC_USDCE = {
  address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
  chainId: 137,
  symbol: 'USDC.e',
  decimals: 6,
  name: 'Bridged USD Coin',
  logoURI:
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
};
const MATIC_DAI = {
  address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
  chainId: 137,
  symbol: 'DAI',
  decimals: 18,
  name: '(PoS) DAI Stablecoin',
  logoURI:
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
};
const MATIC_WBTC = {
  address: '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6',
  chainId: 137,
  symbol: 'WBTC',
  decimals: 8,
  name: 'WBTC',
  logoURI:
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png',
};
const MATIC_WETH = {
  address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
  chainId: 137,
  symbol: 'WETH',
  decimals: 18,
  name: 'Wrapped Ether',
  logoURI:
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
};

export const matic_popular_tokens = [
  MATIC_POLYGON,
  MATIC_WMATIC,
  MATIC_USDT,
  MATIC_USDCE,
  MATIC_DAI,
  MATIC_WBTC,
  MATIC_WETH,
];

// Binance Smart Chain
const BSC_BNB = {
  address: '0x0000000000000000000000000000000000000000',
  chainId: 56,
  symbol: 'BNB',
  decimals: 18,
  name: 'BNB',
  logoURI:
    'https://assets.coingecko.com/coins/images/825/small/binance-coin-logo.png?1547034615',
};
const BSC_WBNB = {
  address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
  chainId: 56,
  symbol: 'WBNB',
  decimals: 18,
  name: 'WBNB',
  logoURI:
    'https://static.debank.com/image/coin/logo_url/bnb/9784283a36f23a58982fc964574ea530.png',
};
const BSC_USDT = {
  address: '0x55d398326f99059fF775485246999027B3197955',
  chainId: 56,
  symbol: 'USDT',
  decimals: 18,
  name: 'USDT',
  logoURI:
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
};
const BSC_USDC = {
  address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
  chainId: 56,
  symbol: 'USDC',
  decimals: 18,
  name: 'USD Coin',
  logoURI:
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
};
const BSC_DAI = {
  address: '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3',
  chainId: 56,
  symbol: 'DAI',
  decimals: 18,
  name: 'DAI Stablecoin',
  logoURI:
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
};
const BSC_WETH = {
  address: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8',
  chainId: 56,
  symbol: 'WETH',
  decimals: 18,
  name: 'WETH',
  logoURI:
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
};

export const bsc_popular_tokens = [
  BSC_BNB,
  BSC_WBNB,
  BSC_USDT,
  BSC_USDC,
  BSC_DAI,
  BSC_WETH,
];

// zkSync
const ZKSYNC_ETHEREUM = {
  address: '0x0000000000000000000000000000000000000000',
  chainId: 324,
  symbol: 'ETH',
  decimals: 18,
  name: 'ETH',
  logoURI:
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
};
const ZKSYNC_WETH = {
  address: '0x5AEa5775959fBC2557Cc8789bC1bf90A239D9a91',
  chainId: 324,
  symbol: 'WETH',
  decimals: 18,
  name: 'Wrapped Ether',
  logoURI:
    'https://static.debank.com/image/era_token/logo_url/0x5aea5775959fbc2557cc8789bc1bf90a239d9a91/61844453e63cf81301f845d7864236f6.png',
};
const ZKSYNC_USDT = {
  address: '0x493257fD37EDB34451f62EDf8D2a0C418852bA4C',
  chainId: 324,
  symbol: 'USDT',
  decimals: 6,
  name: 'USDT',
  logoURI:
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
};
const ZKSYNC_USDC = {
  address: '0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4',
  chainId: 324,
  symbol: 'USDC',
  decimals: 6,
  name: 'USD Coin',
  logoURI:
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
};

export const zksync_popular_tokens = [
  ZKSYNC_ETHEREUM,
  ZKSYNC_WETH,
  ZKSYNC_USDT,
  ZKSYNC_USDC,
];

// Polygon ZK
const POLZK_ETHEREUM = {
  address: '0x0000000000000000000000000000000000000000',
  chainId: 1101,
  symbol: 'ETH',
  decimals: 18,
  name: 'ETH',
  logoURI:
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
};
const POLZK_WETH = {
  address: '0x4F9A0e7FD2Bf6067db6994CF12E4495Df938E6e9',
  chainId: 1101,
  symbol: 'WETH',
  decimals: 18,
  name: 'Wrapped Ether',
  logoURI:
    'https://static.debank.com/image/pze_token/logo_url/0x4f9a0e7fd2bf6067db6994cf12e4495df938e6e9/61844453e63cf81301f845d7864236f6.png',
};
const POLZK_USDC = {
  address: '0xA8CE8aee21bC2A48a5EF670afCc9274C7bbbC035',
  chainId: 1101,
  symbol: 'USDC',
  decimals: 6,
  name: 'USD Coin',
  logoURI:
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
};
const POLZK_DAI = {
  address: '0xC5015b9d9161Dca7e18e32f6f25C4aD850731Fd4',
  chainId: 1101,
  symbol: 'DAI',
  decimals: 18,
  name: 'Dai Stablecoin',
  logoURI:
    'https://static.debank.com/image/tomb_token/logo_url/0xb92c63c2e9f72946cd483e6f554c682216904ec0/61b18dee6896c6dab0684a78d0eee10a.png',
};
const POLZK_USDT = {
  address: '0x1E4a5963aBFD975d8c9021ce480b42188849D41d',
  chainId: 1101,
  symbol: 'USDT',
  decimals: 6,
  name: 'USDT',
  logoURI:
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
};
const POLZK_MATIC = {
  address: '0xa2036f0538221a77A3937F1379699f44945018d0',
  chainId: 1101,
  symbol: 'MATIC',
  decimals: 18,
  name: 'Matic Token',
  logoURI:
    'https://static.debank.com/image/pze_token/logo_url/0xa2036f0538221a77a3937f1379699f44945018d0/20aac20baa9069bd39342edd8c5cc801.png',
};

export const polzk_popular_tokens = [
  POLZK_ETHEREUM,
  POLZK_WETH,
  POLZK_USDC,
  POLZK_DAI,
  POLZK_USDT,
  POLZK_MATIC,
];

// Base
const BASE_ETHEREUM = {
  address: '0x0000000000000000000000000000000000000000',
  chainId: 8453,
  symbol: 'ETH',
  decimals: 18,
  name: 'ETH',
  logoURI:
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
};
const BASE_WETH = {
  address: '0x4200000000000000000000000000000000000006',
  chainId: 8453,
  symbol: 'WETH',
  decimals: 18,
  name: 'Wrapped Ether',
  logoURI:
    'https://static.debank.com/image/coin/logo_url/eth/d61441782d4a08a7479d54aea211679e.png',
};
const BASE_USDBC = {
  address: '0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA',
  chainId: 8453,
  symbol: 'USDbC',
  decimals: 6,
  name: 'USD Base Coin',
  logoURI:
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
};
const BASE_USDC = {
  address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  chainId: 8453,
  symbol: 'USDC',
  decimals: 6,
  name: 'USD Coin',
  logoURI:
    'https://static.debank.com/image/coin/logo_url/usdc/e87790bfe0b3f2ea855dc29069b38818.png',
};
const BASE_DAI = {
  address: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb',
  chainId: 8453,
  symbol: 'DAI',
  decimals: 18,
  name: 'DAI Stablecoin',
  logoURI:
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
};

export const base_popular_tokens = [
  BASE_ETHEREUM,
  BASE_WETH,
  BASE_USDBC,
  BASE_USDC,
  BASE_DAI,
];

// Avalanche
const AVAX_AVALANCHE = {
  address: '0x0000000000000000000000000000000000000000',
  chainId: 43114,
  symbol: 'AVAX',
  decimals: 18,
  name: 'AVAX',
  logoURI:
    'https://static.debank.com/image/avax_token/logo_url/avax/0b9c84359c84d6bdd5bfda9c2d4c4a82.png',
};
const AVAX_WAVAX = {
  address: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7',
  chainId: 43114,
  symbol: 'WAVAX',
  decimals: 18,
  name: 'Wrapped AVAX',
  logoURI:
    'https://static.debank.com/image/avax_token/logo_url/0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7/753d82f0137617110f8dec56309b4065.png',
};
const AVAX_USDTE = {
  address: '0xc7198437980c041c805A1EDcbA50c1Ce5db95118',
  chainId: 43114,
  symbol: 'USDT.e',
  decimals: 6,
  name: 'Tether USD',
  logoURI:
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
};
const AVAX_USDC = {
  address: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E',
  chainId: 43114,
  symbol: 'USDC',
  decimals: 6,
  name: 'USD Coin',
  logoURI:
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
};
const AVAX_DAIE = {
  address: '0xd586E7F844cEa2F87f50152665BCbc2C279D8d70',
  chainId: 43114,
  symbol: 'DAI.e',
  decimals: 18,
  name: 'DAI Stablecoin',
  logoURI:
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
};
const AVAX_WBTC = {
  address: '0x50b7545627a5162F82A992c33b87aDc75187B218',
  chainId: 43114,
  symbol: 'WBTC',
  decimals: 8,
  name: 'WBTC',
  logoURI:
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png',
};
const AVAX_WETHE = {
  address: '0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB',
  chainId: 43114,
  symbol: 'WETH.e',
  decimals: 18,
  name: 'Wrapped Ether',
  logoURI:
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
};
const AVAX_USDCE = {
  address: '0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664',
  chainId: 43114,
  symbol: 'USDC.e',
  decimals: 6,
  name: 'Bridged USD Coin',
  logoURI:
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
};

export const avax_popular_tokens = [
  AVAX_AVALANCHE,
  AVAX_WAVAX,
  AVAX_USDTE,
  AVAX_USDC,
  AVAX_DAIE,
  AVAX_WBTC,
  AVAX_WETHE,
  AVAX_USDCE,
];

// Linea
const LINEA_ETHEREUM = {
  address: '0x0000000000000000000000000000000000000000',
  chainId: 59144,
  symbol: 'ETH',
  decimals: 18,
  name: 'ETH',
  logoURI:
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
};
const LINEA_WETH = {
  address: '0xe5D7C2a44FfDDf6b295A15c148167daaAf5Cf34f',
  chainId: 59144,
  symbol: 'WETH',
  decimals: 18,
  name: 'Wrapped Ether',
  logoURI:
    'https://static.debank.com/image/mtr_token/logo_url/0x79a61d3a28f8c8537a3df63092927cfa1150fb3c/61844453e63cf81301f845d7864236f6.png',
};
const LINEA_USDT = {
  address: '0xA219439258ca9da29E9Cc4cE5596924745e12B93',
  chainId: 59144,
  symbol: 'USDT',
  decimals: 6,
  name: 'USDT',
  logoURI:
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
};
const LINEA_USDCE = {
  address: '0x176211869cA2b568f2A7D4EE941E073a821EE1ff',
  chainId: 59144,
  symbol: 'USDC',
  decimals: 6,
  name: 'USDC.e',
  logoURI:
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
};
const LINEA_DAI = {
  address: '0x4AF15ec2A0BD43Db75dd04E62FAA3B8EF36b00d5',
  chainId: 59144,
  symbol: 'DAI',
  decimals: 18,
  name: 'Dai Stablecoin',
  logoURI:
    'https://static.debank.com/image/eth_token/logo_url/0x6b175474e89094c44da98b954eedeac495271d0f/549c4205dbb199f1b8b03af783f35e71.png',
};

export const linea_popular_tokens = [
  LINEA_ETHEREUM,
  LINEA_WETH,
  LINEA_USDT,
  LINEA_USDCE,
  LINEA_DAI,
];

// Gnosis
const GNO_XDAI = {
  address: '0x0000000000000000000000000000000000000000',
  chainId: 100,
  symbol: 'xDAI',
  decimals: 18,
  name: 'xDAI Native Token',
  logoURI:
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
};
const GNO_WXDAI = {
  address: '0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d',
  chainId: 100,
  symbol: 'WXDAI',
  decimals: 18,
  name: 'WXDAI',
  logoURI:
    'https://static.debank.com/image/xdai_token/logo_url/0xe91d153e0b41518a2ce8dd3d7944fa863463a97d/3fedab836c5425fc3fc2eb542c34c81a.png',
};
const GNO_GNOSIS = {
  address: '0x9C58BAcC331c9aa871AFD802DB6379a98e80CEdb',
  chainId: 100,
  symbol: 'GNO',
  decimals: 18,
  name: 'Gnosis Token on xDai',
  logoURI:
    'https://static.debank.com/image/xdai_token/logo_url/0x9c58bacc331c9aa871afd802db6379a98e80cedb/69e5fedeca09913fe078a8dca5b7e48c.png',
};
const GNO_USDC = {
  address: '0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83',
  chainId: 100,
  symbol: 'USDC',
  decimals: 6,
  name: 'USD Coin',
  logoURI:
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
};
const GNO_USDT = {
  address: '0x4ECaBa5870353805a9F068101A40E0f32ed605C6',
  chainId: 100,
  symbol: 'USDT',
  decimals: 6,
  name: 'USDT',
  logoURI:
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
};
const GNO_WETH = {
  address: '0x6A023CCd1ff6F2045C3309768eAd9E68F978f6e1',
  chainId: 100,
  symbol: 'WETH',
  decimals: 18,
  name: 'Wrapped Ether',
  logoURI:
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
};
const GNO_WBTC = {
  address: '0x8e5bBbb09Ed1ebdE8674Cda39A0c169401db4252',
  chainId: 100,
  symbol: 'WBTC',
  decimals: 8,
  name: 'WBTC',
  logoURI:
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png',
};

export const gnosis_popular_tokens = [
  GNO_XDAI,
  GNO_WXDAI,
  GNO_GNOSIS,
  GNO_USDC,
  GNO_USDT,
  GNO_WETH,
  GNO_WBTC,
];

// Fantom
const FTM_FANTOM = {
  address: '0x0000000000000000000000000000000000000000',
  chainId: 250,
  symbol: 'FTM',
  decimals: 18,
  name: 'FTM',
  logoURI:
    'https://static.debank.com/image/ftm_token/logo_url/ftm/33fdb9c5067e94f3a1b9e78f6fa86984.png',
};
const FTM_WFTM = {
  address: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83',
  chainId: 250,
  symbol: 'wFTM',
  decimals: 18,
  name: 'wFTM',
  logoURI:
    'https://static.debank.com/image/ftm_token/logo_url/0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83/2b7d91858f9c62aafc8d7778b9c22f57.png',
};
const FTM_USDC = {
  address: '0x28a92dde19D9989F39A49905d7C9C2FAc7799bDf',
  chainId: 250,
  symbol: 'USDC',
  decimals: 6,
  name: 'LayerZero USDC Token',
  logoURI:
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
  priceUSD: '1',
};

export const ftm_popular_tokens = [FTM_FANTOM, FTM_WFTM, FTM_USDC];

// Moonbeam
const GLMR_MOONBEAM = {
  address: '0x0000000000000000000000000000000000000000',
  chainId: 1284,
  symbol: 'GLMR',
  decimals: 18,
  name: 'GLMR',
  logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/6836.png',
};
const GLMR_WGLMR = {
  address: '0xAcc15dC74880C9944775448304B263D191c6077F',
  chainId: 1284,
  symbol: 'WGLMR',
  decimals: 18,
  name: 'Wrapped GLMR',
  logoURI:
    'https://static.debank.com/image/mobm_token/logo_url/0xacc15dc74880c9944775448304b263d191c6077f/a8442077d76b258297181c3e6eb8c9cc.png',
};
const GLMR_USDC = {
  address: '0x818ec0A7Fe18Ff94269904fCED6AE3DaE6d6dC0b',
  chainId: 1284,
  symbol: 'USDC',
  decimals: 6,
  name: 'USD Coin',
  logoURI:
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
};
const GLMR_WETH = {
  address: '0xfA9343C3897324496A05fC75abeD6bAC29f8A40f',
  chainId: 1284,
  symbol: 'WETH',
  decimals: 18,
  name: 'WETH',
  logoURI:
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
};
const GLMR_WBTC = {
  address: '0x922D641a426DcFFaeF11680e5358F34d97d112E1',
  chainId: 1284,
  symbol: 'WBTC',
  decimals: 8,
  name: 'WBTC',
  logoURI:
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png',
};

export const glmr_popular_tokens = [
  GLMR_MOONBEAM,
  GLMR_WGLMR,
  GLMR_USDC,
  GLMR_WETH,
  GLMR_WBTC,
];

// Fuse
const FUSE_FUSE = {
  address: '0x0000000000000000000000000000000000000000',
  chainId: 122,
  symbol: 'FUSE',
  decimals: 18,
  name: 'FUSE',
  logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5634.png',
};
const FUSE_WFUSE = {
  address: '0x0BE9e53fd7EDaC9F859882AfdDa116645287C629',
  chainId: 122,
  symbol: 'WFUSE',
  decimals: 18,
  name: 'Wrapped Fuse',
  logoURI: 'https://fuselogo.s3.eu-central-1.amazonaws.com/wfuse.png',
};
const FUSE_USDC = {
  address: '0x620fd5fa44BE6af63715Ef4E65DDFA0387aD13F5',
  chainId: 122,
  symbol: 'USDC',
  decimals: 6,
  name: 'USD Coin',
  logoURI:
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
};
const FUSE_USDT = {
  address: '0xFaDbBF8Ce7D5b7041bE672561bbA99f79c532e10',
  chainId: 122,
  symbol: 'USDT',
  decimals: 6,
  name: 'USDT',
  logoURI:
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
};
const FUSE_WETH = {
  address: '0xa722c13135930332Eb3d749B2F0906559D2C5b99',
  chainId: 122,
  symbol: 'WETH',
  decimals: 18,
  name: 'WETH',
  logoURI:
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
};
const FUSE_WBTC = {
  address: '0x33284f95ccb7B948d9D352e1439561CF83d8d00d',
  chainId: 122,
  symbol: 'WBTC',
  decimals: 8,
  name: 'WBTC',
  logoURI:
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png',
  priceUSD: '65643.4',
};

export const fuse_popular_tokens = [
  FUSE_FUSE,
  FUSE_WFUSE,
  FUSE_USDC,
  FUSE_USDT,
  FUSE_WETH,
  FUSE_WBTC,
];

// OKX
// const OKX_OKT = '0x0000000000000000000000000000000000000000';
// const OKX_WOKT = '0x8F8526dbfd6E38E3D8307702cA8469Bae6C56C15';
// const OKX_USDT = '0x382bB369d343125BfB2117af9c149795C6C65C50';
// const OKX_USDC = '0xc946DAf81b08146B1C7A8Da2A851Ddf2B3EAaf85';
// const OKX_DAIK = '0x21cDE7E32a6CAF4742d00d44B07279e7596d26B9';
// const OKX_ETHK = '0xEF71CA2EE68F45B9Ad6F72fbdb33d707b872315C';
// const OKX_WBTC = '0x506f731F7656e2FB34b587B912808f2a7aB640BD';

// export const okx_popular_tokens = [
//   OKX_OKT,
//   OKX_WOKT,
//   OKX_USDT,
//   OKX_USDC,
//   OKX_DAIK,
//   OKX_ETHK,
//   OKX_WBTC,
// ];

// Boba
const BOBA_ETHEREUM = {
  address: '0x0000000000000000000000000000000000000000',
  chainId: 288,
  symbol: 'ETH',
  decimals: 18,
  name: 'ETH',
  logoURI:
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
};
const BOBA_WETH = {
  address: '0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000',
  chainId: 288,
  symbol: 'WETH',
  decimals: 18,
  name: 'Wrapped ETH',
  logoURI:
    'https://static.debank.com/image/boba_token/logo_url/0xdeaddeaddeaddeaddeaddeaddeaddeaddead0000/b1947b38a90e559eb950453965714be4.png',
};
const BOBA_USDT = {
  address: '0x5DE1677344D3Cb0D7D465c10b72A8f60699C062d',
  chainId: 288,
  symbol: 'USDT',
  decimals: 6,
  name: 'USDT',
  logoURI:
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
};
const BOBA_USDC = {
  address: '0x66a2A913e447d6b4BF33EFbec43aAeF87890FBbc',
  chainId: 288,
  symbol: 'USDC',
  decimals: 6,
  name: 'USD Coin',
  logoURI:
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
};
const BOBA_DAI = {
  address: '0xf74195Bb8a5cf652411867c5C2C5b8C2a402be35',
  chainId: 288,
  symbol: 'DAI',
  decimals: 18,
  name: 'DAI Stablecoin',
  logoURI:
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
};
const BOBA_WBTC = {
  address: '0xdc0486f8bf31DF57a952bcd3c1d3e166e3d9eC8b',
  chainId: 288,
  symbol: 'WBTC',
  decimals: 8,
  name: 'WBTC',
  logoURI:
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png',
};
const BOBA_BOBA = {
  address: '0xa18bF3994C0Cc6E3b63ac420308E5383f53120D7',
  chainId: 288,
  symbol: 'BOBA',
  decimals: 18,
  name: 'Boba Token',
  logoURI:
    'https://static.debank.com/image/boba_token/logo_url/0xa18bf3994c0cc6e3b63ac420308e5383f53120d7/402a10db53def2a3647ea3edfba20cb1.png',
};

export const boba_popular_tokens = [
  BOBA_ETHEREUM,
  BOBA_WETH,
  BOBA_USDT,
  BOBA_USDC,
  BOBA_DAI,
  BOBA_WBTC,
  BOBA_BOBA,
];

// Aurora
const AURORA_ETHEREUM = {
  address: '0x0000000000000000000000000000000000000000',
  chainId: 1313161554,
  symbol: 'AETH',
  decimals: 18,
  name: 'AETH',
  logoURI:
    'https://static.debank.com/image/aurora_token/logo_url/aurora/d61441782d4a08a7479d54aea211679e.png',
};
const AURORA_WETH = {
  address: '0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB',
  chainId: 1313161554,
  symbol: 'WETH',
  decimals: 18,
  name: 'WETH',
  logoURI:
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
};
const AURORA_USDT = {
  address: '0x4988a896b1227218e4A686fdE5EabdcAbd91571f',
  chainId: 1313161554,
  symbol: 'USDT',
  decimals: 6,
  name: 'USDT',
  logoURI:
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
};
const AURORA_USDCE = {
  address: '0xB12BFcA5A55806AaF64E99521918A4bf0fC40802',
  chainId: 1313161554,
  symbol: 'USDC',
  decimals: 6,
  name: 'USD Coin',
  logoURI:
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
};
const AURORA_WBTC = {
  address: '0xF4eB217Ba2454613b15dBdea6e5f22276410e89e',
  chainId: 1313161554,
  symbol: 'WBTC',
  decimals: 8,
  name: 'WBTC',
  logoURI:
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png',
};
const AURORA_AURORA = {
  address: '0x8BEc47865aDe3B172A928df8f990Bc7f2A3b9f79',
  chainId: 1313161554,
  symbol: 'AURORA',
  decimals: 18,
  name: 'Aurora',
  logoURI:
    'https://static.debank.com/image/aurora_token/logo_url/0x8bec47865ade3b172a928df8f990bc7f2a3b9f79/ec63b91b7247ce338caa842eb6439530.png',
};

export const aurora_popular_tokens = [
  AURORA_ETHEREUM,
  AURORA_WETH,
  AURORA_USDT,
  AURORA_USDCE,
  AURORA_WBTC,
  AURORA_AURORA,
];

// Solana
// const SOL_SOLANA = 'So11111111111111111111111111111111111111112';
// const SOL_USDC = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
// const SOL_USDT = 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB';
// const SOL_WSOL = 'So11111111111111111111111111111111111111112';

// export const sol_popular_tokens = [SOL_SOLANA, SOL_USDC, SOL_USDT, SOL_WSOL];

// Metis
const METIS_METIS = {
  address: '0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000',
  chainId: 1088,
  symbol: 'METIS',
  decimals: 18,
  name: 'METIS',
  logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/9640.png',
};
const METIS_WMETIS = {
  address: '0x75cb093E4D61d2A2e65D8e0BBb01DE8d89b53481',
  chainId: 1088,
  symbol: 'WMETIS',
  decimals: 18,
  name: 'Wrapped Metis',
  logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/9640.png',
};
const METIS_MUSDC = {
  address: '0xEA32A96608495e54156Ae48931A7c20f0dcc1a21',
  chainId: 1088,
  symbol: 'm.USDC',
  decimals: 6,
  name: 'Metis USDC',
  logoURI:
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
};
const METIS_MUSDT = {
  address: '0xbB06DCA3AE6887fAbF931640f67cab3e3a16F4dC',
  chainId: 1088,
  symbol: 'm.USDT',
  decimals: 6,
  name: 'Metis USDT',
  logoURI:
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
};
const METIS_MDAI = {
  address: '0x4c078361FC9BbB78DF910800A991C7c3DD2F6ce0',
  chainId: 1088,
  symbol: 'm.DAI',
  decimals: 18,
  name: 'Metis DAI',
  logoURI:
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
};
const METIS_WETH = {
  address: '0x420000000000000000000000000000000000000A',
  chainId: 1088,
  symbol: 'WETH',
  decimals: 18,
  name: 'WETH',
  logoURI:
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
};

export const metis_popular_tokens = [
  METIS_METIS,
  METIS_WMETIS,
  METIS_MUSDC,
  METIS_MUSDT,
  METIS_MDAI,
  METIS_WETH,
];
