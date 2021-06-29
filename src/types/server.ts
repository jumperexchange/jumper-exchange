import { ChainKey, Token } from '.'

export interface BaseEstimate {
  fromAmount: number
  toAmount: number
  fees: {
    included: boolean
    percentage: number | null
    token: Token
    amount: number
  }
}

export interface DepositEstimate extends BaseEstimate { }
export interface SwapEstimate extends BaseEstimate {
  path: Array<string>
}
export interface CrossEstimate extends BaseEstimate { }
export interface WithdrawEstimate extends BaseEstimate { }

export type Estimate = SwapEstimate | DepositEstimate | CrossEstimate | WithdrawEstimate


export interface Execution {

}
export type Action = DepositAction | WithdrawAction | SwapAction | CrossAction


export interface TranferStep {
  action: Action
  estimate?: Estimate
  execution?: Execution
}


interface ActionBase {
  type: string
  chainKey: ChainKey
}

export interface DepositAction extends ActionBase {
  type: 'deposit'
  amount: number
  token: Token
}

export interface WithdrawAction extends ActionBase {
  type: 'withdraw'
  amount: number
  token: Token
}

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
  fromToken: Token
  toToken: Token
}
