import { CrossStep, Execution, LifiStep, Step, SwapStep, Token } from '@lifinance/types'
import BigNumber from 'bignumber.js'
import { Signer } from 'ethers'

export interface TokenWithAmounts extends Token {
  amount?: BigNumber
  amountRendered?: string
}

export interface ProgressStep {
  title: string
  description: string
}

export type ParsedReceipt = {
  fromAmount: string
  toAmount: string
  gasUsed: string
  gasPrice: string
  gasFee: string
}

export type ExecuteSwapParams = {
  signer: Signer
  step: SwapStep
  parseReceipt: (...args: any[]) => ParsedReceipt
  updateStatus?: UpdateExecution
}

export type ExecuteCrossParams = {
  signer: Signer
  step: CrossStep | LifiStep
  updateStatus?: UpdateExecution
}

export type UpdateStep = (step: Step, execution: Execution) => void
export type UpdateExecution = (execution: Execution) => void
