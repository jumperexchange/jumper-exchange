import { ChainId } from '@lifi/sdk';

// Constants for contribution amounts based on transaction volume
export const CONTRIBUTION_AMOUNTS = {
  DEFAULT: [0.5, 1, 2] as number[],
  HIGH_VOLUME: [5, 10, 15] as number[],
  MEDIUM_VOLUME: [2, 10, 15] as number[],
  LOW_VOLUME: [1, 5, 10] as number[],
} as const;

export const VOLUME_THRESHOLDS = {
  HIGH: 100000,
  MEDIUM: 10000,
  LOW: 1000,
} as const;

// Minimum USD amount required to show contribution
export const MIN_CONTRIBUTION_USD = 10;

// Percentage of users that should see the contribution (AB test)
export const CONTRIBUTION_AB_TEST_PERCENTAGE = 0.1;

export const USD_CURRENCY_SYMBOL = '$';

export const NUM_DECIMAL_PLACES = 2;

// Contribution fee addresses for different chains
export const contributionFeeAddresses: Record<number, string> = {
  [ChainId.ETH]: '0x3610486BD4975F5C3dC838A36E897bF97fAE15DD', // Ethereum
  [ChainId.OPT]: '0x3610486BD4975F5C3dC838A36E897bF97fAE15DD', // Optimism
  [ChainId.BSC]: '0x3610486BD4975F5C3dC838A36E897bF97fAE15DD', // BNB
  [ChainId.DAI]: '0x3610486BD4975F5C3dC838A36E897bF97fAE15DD', // Gnosis
  [ChainId.UNI]: '0x3610486BD4975F5C3dC838A36E897bF97fAE15DD', // Unichain
  [ChainId.FRA]: '0x3610486BD4975F5C3dC838A36E897bF97fAE15DD', // Fraxtal
  [ChainId.PZE]: '0x3610486BD4975F5C3dC838A36E897bF97fAE15DD', // Polygon zkEVM
  [ChainId.MNT]: '0x3610486BD4975F5C3dC838A36E897bF97fAE15DD', // Mantle
  [ChainId.BAS]: '0x3610486BD4975F5C3dC838A36E897bF97fAE15DD', // Base
  [ChainId.MOD]: '0x3610486BD4975F5C3dC838A36E897bF97fAE15DD', // Mode
  [ChainId.ARB]: '0x3610486BD4975F5C3dC838A36E897bF97fAE15DD', // Arbitrum
  [ChainId.CEL]: '0x3610486BD4975F5C3dC838A36E897bF97fAE15DD', // Celo
  [ChainId.AVA]: '0x3610486BD4975F5C3dC838A36E897bF97fAE15DD', // Avalanche
  [ChainId.INK]: '0x3610486BD4975F5C3dC838A36E897bF97fAE15DD', // Ink
  [ChainId.LNA]: '0x3610486BD4975F5C3dC838A36E897bF97fAE15DD', // Linea
  [ChainId.BER]: '0x3610486BD4975F5C3dC838A36E897bF97fAE15DD', // Berachain
  // [ChainId.BLA]: '0x3610486BD4975F5C3dC838A36E897bF97fAE15DD', // Blast --> Safe Deprecated will have to use EOA
  [ChainId.SCL]: '0x3610486BD4975F5C3dC838A36E897bF97fAE15DD', // Scroll
  // [ChainId.ZOR]: '0x3610486BD4975F5C3dC838A36E897bF97fAE15DD', // Zora --> not supported by SDK
  [ChainId.AUR]: '0x3610486BD4975F5C3dC838A36E897bF97fAE15DD', // Aurora
  [ChainId.SOL]: '78rW1rpLE8C4g4hgCn45eJV2KGE1NotGzhWhxDfcrjx7', // Solana
  [ChainId.POL]: '0x3610486BD4975F5C3dC838A36E897bF97fAE15DD', // Polygon
  [ChainId.ERA]: '0xAf1530FD608F4Babb956B3A04Fb1a44BD1B8d2aB', // zkSync
  [ChainId.MOR]: '0x784bBEa6a21c379d597dD5B9640620FAC22737B6', // Moonriver
  [ChainId.MOO]: '0x784bBEa6a21c379d597dD5B9640620FAC22737B6', // Moonbeam
  [ChainId.FUS]: '0x6E4bAf9C36d737896331b9860Dd464cCB3D71Cf5', // Fuse
  [ChainId.BOB]: '0xDcC507bfcdB41034151a6d08C695d7b9C0cB4257', // Boba
  [ChainId.MAM]: '0xb3764e28852C8eFE251f05003E47810B9EC85f84', // Metis
  [ChainId.LSK]: '0x3610486BD4975F5C3dC838A36E897bF97fAE15DD', // Lisk
  [ChainId.SEI]: '0x784bBEa6a21c379d597dD5B9640620FAC22737B6', // Sei
  [ChainId.IMX]: '0xFc4A04f2A4f7f7B95703ADfDd0692dA1Dcc6e6AC', // Immutable zkEVM
  [ChainId.SON]: '0x3610486BD4975F5C3dC838A36E897bF97fAE15DD', // Sonic
  [ChainId.GRA]: '0x807668Bef8dfEC5B53feE2974c9A796509934e91', // Gravity
  [ChainId.TAI]: '0x784bBEa6a21c379d597dD5B9640620FAC22737B6', // Taiko
  [ChainId.SOE]: '0x3610486BD4975F5C3dC838A36E897bF97fAE15DD', // Soneium
  [ChainId.SWL]: '0x3610486BD4975F5C3dC838A36E897bF97fAE15DD', // Swellchain
  // [ChainId.BTC]: '', // Bitcoin (no address provided)
  [ChainId.CRN]: '0x2DF47C2Ec46dA7290c017Df9401C46978EB14095', // Corn
  [ChainId.LNS]: '0x7e1Eb89553c3e252A6ab6ee075690966eEDb35A0', // Lens
  [ChainId.CRO]: '0x75602feb8d98fB04Dd416CE266A00DCB28837848', // Cronos
  [ChainId.ABS]: '0x2C8DC431b167272fDD6B77d320022b8F589855ef', // Abstract
  [ChainId.RSK]: '0x8307ad88FDa43bD9E109A10943b4F0E791BEDEDb', // Rootstock
  [ChainId.WCC]: '0x3610486BD4975F5C3dC838A36E897bF97fAE15DD', // World chain
  // [ChainId.KAI]: '', // Kaia chain (no address provided)
  // [ChainId.SUP]: '' // Superposition (no address provided)
};
