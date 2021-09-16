export enum CoinKey {
  ETH = 'ETH',
  MATIC = 'MATIC',
  BNB = 'BNB',
  DAI = 'DAI',
  USDT = 'USDT',
  USDC = 'USDC',
  UNI = 'UNI',
  LINK = 'LINK',
  AAVE = 'AAVE',
  FTM = 'FTM',
  OKT = 'OKT',
  AVAX = 'AVAX',

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

  // Testnets
  ROP = 'rop',
  RIN = 'rin',
  GOR = 'gor',
  MUM = 'mum',
  ARBT = 'arbt',
  OPTT = 'optt',
  BSCT = 'bsct',
  HECT = 'hect',
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

  // Testnets
  ROP = 3,
  RIN = 4,
  GOR = 5,
  MUM = 80001,
  ARBT = 421611,
  OPTT = 69,
  BSCT = 97,
  HECT = 256,
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
