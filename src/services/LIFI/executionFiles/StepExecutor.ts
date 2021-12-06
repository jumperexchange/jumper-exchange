import { JsonRpcSigner } from '@ethersproject/providers'

import { CrossStep, Execution, LifiStep, Step, SwapStep } from '../types'
import { AnySwapExecutionManager } from './bridges/anyswap.execute'
import { CbridgeExecutionManager } from './bridges/cbridge.execute'
import { HopExecutionManager } from './bridges/hop.execute'
import { HorizonExecutionManager } from './bridges/horizon.execute'
import { NXTPExecutionManager } from './bridges/nxtp.execute'
import { oneinch } from './exchanges/oneinch'
import { paraswap } from './exchanges/paraswap'
import { SwapExecutionManager } from './exchanges/swap.execute'
import { uniswap } from './exchanges/uniswaps'

export class StepExecutor {
  swapExecutionManager = new SwapExecutionManager()
  nxtpExecutionManager = new NXTPExecutionManager()
  hopExecutionManager = new HopExecutionManager()
  horizonExecutionManager = new HorizonExecutionManager()
  cbridgeExecutionManager = new CbridgeExecutionManager()
  anySwapExecutionManager = new AnySwapExecutionManager()

  stopStepExecution = () => {
    this.swapExecutionManager.setShouldContinue(false)
    this.nxtpExecutionManager.setShouldContinue(false)
    this.hopExecutionManager.setShouldContinue(false)
    this.horizonExecutionManager.setShouldContinue(false)
  }

  executeStep = async (
    signer: JsonRpcSigner,
    step: Step,
    updateStatus: Function,
  ): Promise<Step> => {
    switch (step.type) {
      case 'lifi':
      case 'cross':
        await this.executeCross(signer, step, updateStatus)
        break
      case 'swap':
        await this.executeSwap(signer, step, updateStatus)
        break
      default:
        throw new Error('Unsupported step type')
    }

    return step
  }

  private executeSwap = async (signer: JsonRpcSigner, step: SwapStep, updateStatus: Function) => {
    const swapParams = {
      signer: signer,
      step,
      updateStatus: (status: Execution) => updateStatus(step, status),
    }

    switch (step.tool) {
      case 'paraswap':
        return await this.swapExecutionManager.execute({
          ...swapParams,
          parseReceipt: paraswap.parseReceipt,
        })
      case '1inch':
        return await this.swapExecutionManager.execute({
          ...swapParams,
          parseReceipt: oneinch.parseReceipt,
        })
      default:
        return await this.swapExecutionManager.execute({
          ...swapParams,
          parseReceipt: uniswap.parseReceipt,
        })
    }
  }

  private executeCross = async (
    signer: JsonRpcSigner,
    step: CrossStep | LifiStep,
    updateStatus: Function,
  ) => {
    const crossParams = {
      signer: signer,
      step,
      updateStatus: (status: Execution) => updateStatus(step, status),
    }

    switch (step.tool) {
      case 'nxtp':
        return await this.nxtpExecutionManager.execute(crossParams)
      case 'hop':
        return await this.hopExecutionManager.execute(crossParams)
      case 'horizon':
        return await this.horizonExecutionManager.execute(crossParams)
      case 'cbridge':
        return await this.cbridgeExecutionManager.execute(crossParams)
      case 'anyswapV3':
      case 'anyswapV4':
      case 'anyswap':
        return await this.anySwapExecutionManager.execute(crossParams)
      default:
        throw new Error('Should never reach here, bridge not defined')
    }
  }
}
