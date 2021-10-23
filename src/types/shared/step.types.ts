import { Token } from './base.types'

export interface FeeCost {
  name: string
  description?: string
  included: boolean
  percentage: string | null
  token: Token
  amount: string
  amountUSD?: number
}

export interface GasCost {
  type: 'SUM' | 'APPROVE' | 'SEND'
  amount: string
  amountUSD?: number
  token: Token
}

// ESTIMATE
export interface BaseEstimate {
  type: string
  fromAmount: string
  toAmount: string
  feeCosts?: FeeCost[]
  gasCosts?: GasCost[]

  // TODO: remove old implementation
  fees?: {
    included: boolean
    percentage: string | null
    token: Token
    amount: string
  }
}

export interface DepositEstimate extends BaseEstimate { }

export interface SwapEstimate extends BaseEstimate {
  type: 'swap'
  toAmountMin: string,
  data: any
}

export interface CrossEstimate extends BaseEstimate {
  type: 'cross'
  data: any
}

export interface LiFiEstimate extends BaseEstimate {
  type: 'lifi'
  toAmountMin: string,
}

export interface WithdrawEstimate extends BaseEstimate { }

export interface FailedEstimate {
  type: 'error'
  error: string
  message: string
}

export type Estimate = SwapEstimate | DepositEstimate | CrossEstimate | WithdrawEstimate | LiFiEstimate

// EXECUTION
export type Status = 'NOT_STARTED' | 'ACTION_REQUIRED' | 'PENDING' | 'FAILED' | 'DONE'

type AcceptableMessages = string | any
export type ProcessMessage =
  AcceptableMessages | { message: AcceptableMessages, footer: AcceptableMessages }

export interface Process {
  startedAt: number
  doneAt?: number
  failedAt?: number
  errorMessage?: any
  errorCode?: any
  message: ProcessMessage
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

export const emptyExecution: Execution = {
  status: 'NOT_STARTED',
  process: []
}


// ACTION
interface ActionBase {
  type: string
  chainId: number
  amount: string
  token: Token
  address?: string
}

export interface DepositAction extends ActionBase {
  type: 'deposit'
}

export interface WithdrawAction extends ActionBase {
  type: 'withdraw'
  toAddress: string
  slippage: number
}

export interface SwapAction extends ActionBase {
  type: 'swap'
  tool: string
  toToken: Token
  slippage: number
  toAddress?: string
}

export interface CrossAction extends ActionBase {
  type: 'cross'
  tool: string
  toChainId: number
  toToken: Token
  toAddress?: string
}

export interface LiFiAction extends ActionBase {
  type: 'lifi'
  toChainId: number
  toToken: Token
  toAddress?: string
  slippage: number
}

export type Action = DepositAction | WithdrawAction | SwapAction | CrossAction | LiFiAction

// STEP
export interface StepBase {
  action: Action
  estimate?: Estimate
  execution?: Execution
  id?: string
}

export interface SwapStep extends StepBase {
  action: SwapAction
  estimate: SwapEstimate
}

export interface CrossStep extends StepBase {
  action: CrossAction
  estimate: CrossEstimate
}

export interface LiFiStep extends StepBase {
  action: LiFiAction
  estimate: LiFiEstimate
  includedSteps: Step[]
}

export type Step = SwapStep | CrossStep | LiFiStep
