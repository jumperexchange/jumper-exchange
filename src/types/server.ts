import { ChainKey } from ".";

// types from server
export interface SwapAction extends ActionBase {
  type: 'swap'
  fromToken: Token
  toToken: Token

  fromAmount: number
  toAmount: number
}

export interface CrossAction extends ActionBase {
  type: 'cross'
  toChainKey: ChainKey
  amount: number
  token: Token
}
export interface Token {
  symbol: string
}

export interface ActionBase {
  type: string
  chainKey: ChainKey
}
