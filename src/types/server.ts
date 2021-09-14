import { AuctionResponse } from "@connext/nxtp-utils";
import { Token } from '.'

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
  chainId: number
  amount: string
  token: Token
}

export interface DepositAction extends ActionBase {
  type: 'deposit'
}

export interface WithdrawAction extends ActionBase {
  type: 'withdraw'
  toAddress: string
}

export interface SwapAction extends ActionBase {
  type: 'swap'
  tool: string
  toToken: Token
}

export interface CrossAction extends ActionBase {
  type: 'cross'
  tool: string
  toChainId: number
  toToken: Token
  toAddress: string
}
