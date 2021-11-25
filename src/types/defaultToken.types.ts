import { ChainKey, CoinKey, findDefaultCoinOnChain, Token } from '@lifinance/types'

export const defaultTokens: { [ChainKey: string]: Array<Token> } = {
  [ChainKey.ETH]: [
    findDefaultCoinOnChain(CoinKey.ETH, ChainKey.ETH),
    findDefaultCoinOnChain(CoinKey.USDC, ChainKey.ETH),
    findDefaultCoinOnChain(CoinKey.USDT, ChainKey.ETH),
    findDefaultCoinOnChain(CoinKey.MATIC, ChainKey.ETH),
  ],
  [ChainKey.BSC]: [
    findDefaultCoinOnChain(CoinKey.BNB, ChainKey.BSC),
    findDefaultCoinOnChain(CoinKey.USDC, ChainKey.BSC),
    findDefaultCoinOnChain(CoinKey.USDT, ChainKey.BSC),
    findDefaultCoinOnChain(CoinKey.DAI, ChainKey.BSC),
  ],
  [ChainKey.POL]: [
    findDefaultCoinOnChain(CoinKey.MATIC, ChainKey.POL),
    findDefaultCoinOnChain(CoinKey.USDC, ChainKey.POL),
    findDefaultCoinOnChain(CoinKey.USDT, ChainKey.POL),
    findDefaultCoinOnChain(CoinKey.DAI, ChainKey.POL),
  ],
  [ChainKey.DAI]: [
    findDefaultCoinOnChain(CoinKey.DAI, ChainKey.DAI),
    findDefaultCoinOnChain(CoinKey.USDC, ChainKey.DAI),
    findDefaultCoinOnChain(CoinKey.USDT, ChainKey.DAI),
    findDefaultCoinOnChain(CoinKey.MATIC, ChainKey.DAI),
  ],
  [ChainKey.FTM]: [
    findDefaultCoinOnChain(CoinKey.FTM, ChainKey.FTM),
    findDefaultCoinOnChain(CoinKey.USDC, ChainKey.FTM),
    findDefaultCoinOnChain(CoinKey.USDT, ChainKey.FTM),
    findDefaultCoinOnChain(CoinKey.DAI, ChainKey.FTM),
  ],
  [ChainKey.ARB]: [
    findDefaultCoinOnChain(CoinKey.ETH, ChainKey.ARB),
    findDefaultCoinOnChain(CoinKey.USDC, ChainKey.ARB),
    findDefaultCoinOnChain(CoinKey.USDT, ChainKey.ARB),
    findDefaultCoinOnChain(CoinKey.DAI, ChainKey.ARB),
  ],
  [ChainKey.OPT]: [
    findDefaultCoinOnChain(CoinKey.ETH, ChainKey.OPT),
    findDefaultCoinOnChain(CoinKey.USDC, ChainKey.OPT),
    findDefaultCoinOnChain(CoinKey.USDT, ChainKey.OPT),
    findDefaultCoinOnChain(CoinKey.DAI, ChainKey.OPT),
  ],
  [ChainKey.ONE]: [
    findDefaultCoinOnChain(CoinKey.ONE, ChainKey.ONE),
    findDefaultCoinOnChain(CoinKey.BNB, ChainKey.ONE),
    findDefaultCoinOnChain(CoinKey.ETH, ChainKey.ONE),
  ],
  [ChainKey.AVA]: [
    findDefaultCoinOnChain(CoinKey.AVAX, ChainKey.AVA),
    findDefaultCoinOnChain(CoinKey.USDC, ChainKey.AVA),
    findDefaultCoinOnChain(CoinKey.USDT, ChainKey.AVA),
    findDefaultCoinOnChain(CoinKey.DAI, ChainKey.AVA),
  ],
  [ChainKey.MOR]: [
    findDefaultCoinOnChain(CoinKey.MOVR, ChainKey.MOR),
    findDefaultCoinOnChain(CoinKey.USDC, ChainKey.MOR),
    findDefaultCoinOnChain(CoinKey.USDT, ChainKey.MOR),
  ],
  [ChainKey.OKT]: [
    findDefaultCoinOnChain(CoinKey.OKT, ChainKey.OKT),
    findDefaultCoinOnChain(CoinKey.USDC, ChainKey.OKT),
    findDefaultCoinOnChain(CoinKey.USDT, ChainKey.OKT),
  ],
  [ChainKey.HEC]: [
    findDefaultCoinOnChain(CoinKey.HT, ChainKey.HEC),
    findDefaultCoinOnChain(CoinKey.USDC, ChainKey.HEC),
    findDefaultCoinOnChain(CoinKey.USDT, ChainKey.HEC),
  ],

  // Testnet
  [ChainKey.GOR]: [
    findDefaultCoinOnChain(CoinKey.ETH, ChainKey.GOR),
    findDefaultCoinOnChain(CoinKey.TEST, ChainKey.GOR),
    findDefaultCoinOnChain(CoinKey.USDC, ChainKey.GOR),
    // findDefaultCoinOnChain(CoinKey.USDT, ChainKey.GOR),
    findDefaultCoinOnChain(CoinKey.DAI, ChainKey.GOR),
  ],
  [ChainKey.RIN]: [
    findDefaultCoinOnChain(CoinKey.ETH, ChainKey.RIN),
    findDefaultCoinOnChain(CoinKey.TEST, ChainKey.RIN),
    findDefaultCoinOnChain(CoinKey.USDC, ChainKey.RIN),
    findDefaultCoinOnChain(CoinKey.USDT, ChainKey.RIN),
    findDefaultCoinOnChain(CoinKey.DAI, ChainKey.RIN),
  ],
  [ChainKey.ROP]: [
    findDefaultCoinOnChain(CoinKey.ETH, ChainKey.ROP),
    findDefaultCoinOnChain(CoinKey.TEST, ChainKey.ROP),
    findDefaultCoinOnChain(CoinKey.USDC, ChainKey.ROP),
    findDefaultCoinOnChain(CoinKey.USDT, ChainKey.ROP),
    findDefaultCoinOnChain(CoinKey.DAI, ChainKey.ROP),
  ],
  [ChainKey.KOV]: [findDefaultCoinOnChain(CoinKey.ETH, ChainKey.KOV)],
  [ChainKey.MUM]: [
    findDefaultCoinOnChain(CoinKey.MATIC, ChainKey.MUM),
    findDefaultCoinOnChain(CoinKey.TEST, ChainKey.MUM),
    findDefaultCoinOnChain(CoinKey.USDC, ChainKey.MUM),
    // findDefaultCoinOnChain(CoinKey.USDT, ChainKey.MUM),
    findDefaultCoinOnChain(CoinKey.DAI, ChainKey.MUM),
  ],
  [ChainKey.BSCT]: [findDefaultCoinOnChain(CoinKey.BNB, ChainKey.BSCT)],
  [ChainKey.ONET]: [
    findDefaultCoinOnChain(CoinKey.ONE, ChainKey.ONET),
    findDefaultCoinOnChain(CoinKey.ETH, ChainKey.ONET),
    findDefaultCoinOnChain(CoinKey.BNB, ChainKey.ONET),
  ],
}
