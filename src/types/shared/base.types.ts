export enum CoinKey {
  ETH = 'ETH',
  MATIC = 'MATIC',
  BNB = 'BNB',
  DAI = 'DAI',
  FTM = 'FTM',
  OKT = 'OKT',
  AVAX = 'AVAX',
  HT = 'HT',
  ONE = 'ONE',

  // Stable coins
  USDT = 'USDT',
  USDC = 'USDC',

  // Testnet
  TEST = 'TEST',
}

export enum ChainKey {
  ETH = 'eth',
  POL = 'pol',
  BSC = 'bsc',
  DAI = 'dai',
  OKT = 'okt',
  FTM = 'ftm',
  AVA = 'ava',
  ARB = 'arb',
  HEC = 'hec',
  OPT = 'opt',
  ONE = 'one',

  // Testnets
  ROP = 'rop',
  RIN = 'rin',
  GOR = 'gor',
  KOV = 'kov',
  MUM = 'mum',
  ARBT = 'arbt',
  OPTT = 'optt',
  BSCT = 'bsct',
  HECT = 'hect',
  ONET = 'onet',
}

export enum ChainId {
  ETH = 1,
  POL = 137,
  BSC = 56,
  DAI = 100,
  OKT = 66,
  FTM = 250,
  AVA = 43114,
  ARB = 42161,
  HEC = 128,
  OPT = 10,
  ONE = 1666600000,

  // Testnets
  ROP = 3,
  RIN = 4,
  GOR = 5,
  KOV = 42,
  MUM = 80001,
  ARBT = 421611,
  OPTT = 69,
  BSCT = 97,
  HECT = 256,
  ONET = 1666700000,
}

export interface Token {
  id: string
  symbol: string
  decimals: number
  chainId: number
  name: string
  chainKey: ChainKey
  key: CoinKey
  logoURI: string
}

export interface Coin {
  key: CoinKey
  name: string
  logoURI: string
  verified: boolean
  chains: {
    [ChainKey: string]: Token
  }
}
