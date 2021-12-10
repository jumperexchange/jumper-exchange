import { ChainId, ChainKey, CoinKey, findDefaultToken, Token } from '@lifinance/types'

export const defaultTokens: { [ChainKey: string]: Array<Token> } = {
  [ChainKey.ETH]: [
    findDefaultToken(CoinKey.ETH, ChainId.ETH),
    findDefaultToken(CoinKey.USDC, ChainId.ETH),
    findDefaultToken(CoinKey.USDT, ChainId.ETH),
    findDefaultToken(CoinKey.MATIC, ChainId.ETH),
    findDefaultToken(CoinKey.WBTC, ChainId.ETH),
  ],
  [ChainKey.BSC]: [
    findDefaultToken(CoinKey.BNB, ChainId.BSC),
    findDefaultToken(CoinKey.USDC, ChainId.BSC),
    findDefaultToken(CoinKey.USDT, ChainId.BSC),
    findDefaultToken(CoinKey.DAI, ChainId.BSC),
    // findDefaultToken(CoinKey.WBTC, ChainId.BSC),
  ],
  [ChainKey.POL]: [
    findDefaultToken(CoinKey.MATIC, ChainId.POL),
    findDefaultToken(CoinKey.USDC, ChainId.POL),
    findDefaultToken(CoinKey.USDT, ChainId.POL),
    findDefaultToken(CoinKey.DAI, ChainId.POL),
    findDefaultToken(CoinKey.WBTC, ChainId.POL),
  ],
  [ChainKey.DAI]: [
    findDefaultToken(CoinKey.DAI, ChainId.DAI),
    findDefaultToken(CoinKey.USDC, ChainId.DAI),
    findDefaultToken(CoinKey.USDT, ChainId.DAI),
    findDefaultToken(CoinKey.MATIC, ChainId.DAI),
    findDefaultToken(CoinKey.WBTC, ChainId.DAI),
  ],
  [ChainKey.FTM]: [
    findDefaultToken(CoinKey.FTM, ChainId.FTM),
    findDefaultToken(CoinKey.USDC, ChainId.FTM),
    findDefaultToken(CoinKey.USDT, ChainId.FTM),
    findDefaultToken(CoinKey.DAI, ChainId.FTM),
    findDefaultToken(CoinKey.WBTC, ChainId.FTM),
  ],
  [ChainKey.ARB]: [
    findDefaultToken(CoinKey.ETH, ChainId.ARB),
    findDefaultToken(CoinKey.USDC, ChainId.ARB),
    findDefaultToken(CoinKey.USDT, ChainId.ARB),
    findDefaultToken(CoinKey.DAI, ChainId.ARB),
    findDefaultToken(CoinKey.WBTC, ChainId.ARB),
  ],
  [ChainKey.OPT]: [
    findDefaultToken(CoinKey.ETH, ChainId.OPT),
    findDefaultToken(CoinKey.USDC, ChainId.OPT),
    findDefaultToken(CoinKey.USDT, ChainId.OPT),
    findDefaultToken(CoinKey.DAI, ChainId.OPT),
    findDefaultToken(CoinKey.WBTC, ChainId.OPT),
  ],
  [ChainKey.ONE]: [
    findDefaultToken(CoinKey.ONE, ChainId.ONE),
    findDefaultToken(CoinKey.BNB, ChainId.ONE),
    findDefaultToken(CoinKey.ETH, ChainId.ONE),
    findDefaultToken(CoinKey.WBTC, ChainId.ONE),
  ],
  [ChainKey.AVA]: [
    findDefaultToken(CoinKey.AVAX, ChainId.AVA),
    findDefaultToken(CoinKey.USDC, ChainId.AVA),
    findDefaultToken(CoinKey.USDT, ChainId.AVA),
    findDefaultToken(CoinKey.DAI, ChainId.AVA),
    findDefaultToken(CoinKey.WBTC, ChainId.AVA),
  ],
  [ChainKey.MOR]: [
    findDefaultToken(CoinKey.MOVR, ChainId.MOR),
    findDefaultToken(CoinKey.USDC, ChainId.MOR),
    findDefaultToken(CoinKey.USDT, ChainId.MOR),
    // findDefaultToken(CoinKey.WBTC, ChainId.MOR),
  ],
  [ChainKey.OKT]: [
    findDefaultToken(CoinKey.OKT, ChainId.OKT),
    findDefaultToken(CoinKey.USDC, ChainId.OKT),
    findDefaultToken(CoinKey.USDT, ChainId.OKT),
  ],
  [ChainKey.HEC]: [
    findDefaultToken(CoinKey.HT, ChainId.HEC),
    findDefaultToken(CoinKey.USDC, ChainId.HEC),
    findDefaultToken(CoinKey.USDT, ChainId.HEC),
  ],

  // Testnet
  [ChainKey.GOR]: [
    findDefaultToken(CoinKey.ETH, ChainId.GOR),
    findDefaultToken(CoinKey.TEST, ChainId.GOR),
    findDefaultToken(CoinKey.USDC, ChainId.GOR),
    // findDefaultToken(CoinKey.USDT, ChainId.GOR),
    findDefaultToken(CoinKey.DAI, ChainId.GOR),
  ],
  [ChainKey.RIN]: [
    findDefaultToken(CoinKey.ETH, ChainId.RIN),
    findDefaultToken(CoinKey.TEST, ChainId.RIN),
    findDefaultToken(CoinKey.USDC, ChainId.RIN),
    findDefaultToken(CoinKey.USDT, ChainId.RIN),
    findDefaultToken(CoinKey.DAI, ChainId.RIN),
  ],
  [ChainKey.ROP]: [
    findDefaultToken(CoinKey.ETH, ChainId.ROP),
    findDefaultToken(CoinKey.TEST, ChainId.ROP),
    findDefaultToken(CoinKey.USDC, ChainId.ROP),
    findDefaultToken(CoinKey.USDT, ChainId.ROP),
    findDefaultToken(CoinKey.DAI, ChainId.ROP),
  ],
  [ChainKey.KOV]: [findDefaultToken(CoinKey.ETH, ChainId.KOV)],
  [ChainKey.MUM]: [
    findDefaultToken(CoinKey.MATIC, ChainId.MUM),
    findDefaultToken(CoinKey.TEST, ChainId.MUM),
    findDefaultToken(CoinKey.USDC, ChainId.MUM),
    // findDefaultToken(CoinKey.USDT, ChainId.MUM),
    findDefaultToken(CoinKey.DAI, ChainId.MUM),
  ],
  [ChainKey.BSCT]: [findDefaultToken(CoinKey.BNB, ChainId.BSCT)],
  [ChainKey.ONET]: [
    findDefaultToken(CoinKey.ONE, ChainId.ONET),
    findDefaultToken(CoinKey.ETH, ChainId.ONET),
    findDefaultToken(CoinKey.BNB, ChainId.ONET),
  ],
}
