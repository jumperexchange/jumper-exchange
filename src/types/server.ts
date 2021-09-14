import { AuctionResponse } from "@connext/nxtp-utils";
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
  type: 'swap'
  data: any
}
export interface CrossEstimate extends BaseEstimate {
  quote: AuctionResponse
}
export interface WithdrawEstimate extends BaseEstimate { }

export type Estimate = SwapEstimate | DepositEstimate | CrossEstimate | WithdrawEstimate



export type Status = 'NOT_STARTED' | 'ACTION_REQUIRED' | 'PENDING' | 'FAILED' | 'DONE'
export interface Process {
  startedAt: number
  doneAt?: number
  failedAt?: number
  errorMessage?: any
  errorCode?: any
  message: any
  status: Status

  // additional information
  [key: string]: any
}
export interface Execution {
  status: Status
  process: Array<Process>
  fromAmount?: number
  toAmount?: number
}
export const emptyExecution : Execution = {
  status: 'NOT_STARTED',
  process: []
}

export type Action = DepositAction | WithdrawAction | SwapAction | CrossAction


export interface TranferStep {
  action: Action
  estimate?: Estimate
  execution?: Execution
  id?: string
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
  tool: string
  fromChainId: number
  fromToken: Token
  toToken: Token
  fromAmount: string
  // toAmount: string
}

// export interface SwapAction extends ActionBase {
//   type: 'swap'
//   fromToken: Token
//   toToken: Token

//   fromAmount: number
//   toAmount: number
// }

// export interface ParaswapAction extends ActionBase {
//   type: 'paraswap'
//   fromToken: Token
//   toToken: Token

//   fromAmount: number
//   toAmount: number
//   target: 'wallet' | 'channel'
// }

// export interface OneInchAction extends ActionBase {
//   type: '1inch'
//   fromToken: Token
//   toToken: Token

//   fromAmount: number
//   toAmount: number
//   target: 'wallet' | 'channel'
// }


export interface CrossAction extends ActionBase {
  type: 'cross'
  tool: string
  fromChainId: number
  toChainId: number
  fromAmount: string
  fromToken: Token
  toToken: Token
  toAddress: string
}
