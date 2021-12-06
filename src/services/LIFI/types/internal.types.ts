import { JsonRpcSigner } from '@ethersproject/providers'
import { CrossStep, LifiStep, SwapStep, Token } from '@lifinance/types'
import BigNumber from 'bignumber.js'

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
  signer: JsonRpcSigner
  step: SwapStep
  parseReceipt: (...args: any[]) => ParsedReceipt
  updateStatus?: Function
}

export type ExecuteCrossParams = {
  signer: JsonRpcSigner
  step: CrossStep | LifiStep
  updateStatus?: Function
}
