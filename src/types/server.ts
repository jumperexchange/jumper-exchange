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



export type Status = 'NOT_STARTED' | 'PENDING' | 'FAILED' | 'DONE'
export interface Process {
  startedAt: number
  doneAt?: number
  failedAt?: number
  message: string
  status: Status

  // additional information
  [key: string]: any
}
export interface Execution {
  status: Status
  process: Array<Process>
}
export const emptyExecution : Execution = {
  status: 'NOT_STARTED',
  process: []
}

export type Action = DepositAction | WithdrawAction | SwapAction | ParaswapAction | OneInchAction | CrossAction


export interface TranferStep {
  action: Action
  estimate?: Estimate
  execution?: Execution
}


interface ActionBase {
  type: string
  chainKey: ChainKey
  chainId: number
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
  recipient?: string
}

export interface SwapAction extends ActionBase {
  type: 'swap'
  fromToken: Token
  toToken: Token

  fromAmount: number
  toAmount: number
}

export interface ParaswapAction extends ActionBase {
  type: 'paraswap'
  fromToken: Token
  toToken: Token

  fromAmount: number
  toAmount: number
  target: 'wallet' | 'channel'
}

export interface OneInchAction extends ActionBase {
  type: '1inch'
  fromToken: Token
  toToken: Token

  fromAmount: number
  toAmount: number
  target: 'wallet' | 'channel'
}

export interface CrossAction extends ActionBase {
  type: 'cross'
  toChainKey: ChainKey
  amount: number
  fromToken: Token
  toToken: Token
}
