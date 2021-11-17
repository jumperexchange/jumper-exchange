import { constants } from 'ethers'

import { ExecuteSwapParams, getChainById } from '../types'
import { checkAllowance } from './allowance.execute'
import Lifi from './LIFI/Lifi'
import notifications, { NotificationType } from './notifications'
import { createAndPushProcess, initStatus, setStatusDone, setStatusFailed } from './status'
import * as uniswap from './uniswaps'
import { personalizeStep } from './utils'

export class UniswapExecutionManager {
  shouldContinue: boolean = true

  setShouldContinue = (val: boolean) => {
    this.shouldContinue = val
  }
  executeSwap = async ({
    signer,
    step,
    srcAmount,
    updateStatus,
  }: ExecuteSwapParams) => {
    // setup
    const { action, estimate, execution } = step
    const fromChain = getChainById(action.fromChainId)
    const { status, update } = initStatus(updateStatus, execution)

    if (!this.shouldContinue) return status
    if (action.fromToken.id !== constants.AddressZero) {
      await checkAllowance(
        signer,
        fromChain,
        action.fromToken,
        srcAmount.toFixed(),
        estimate.data.routerAddress,
        update,
        status,
      )
    }

    // Swap via Uniswap
    // -> set status
    const swapProcess = createAndPushProcess('swapProcess', update, status, 'Submit Swap', {
      status: 'ACTION_REQUIRED',
    })

    // -> swapping
    if (!this.shouldContinue) return status
    let tx
    try {
      if (swapProcess.txHash) {
        tx = await signer.provider.getTransaction(swapProcess.txHash)
      } else {
        const personalizedStep = await personalizeStep(signer, step)
        const { tx: transaction } = await Lifi.getStepTransaction(personalizedStep)
        tx = await signer.sendTransaction(transaction)
      }
    } catch (e: any) {
      // -> set status
      if (e.message) swapProcess.errorMessage = e.message
      if (e.code) swapProcess.errorCode = e.code
      setStatusFailed(update, status, swapProcess)
      throw e
    }

    // -> set status
    swapProcess.status = 'PENDING'
    swapProcess.txHash = tx.hash
    swapProcess.txLink = fromChain.metamask.blockExplorerUrls[0] + 'tx/' + swapProcess.txHash
    swapProcess.message = 'Swap - Wait for'
    update(status)

    // -> waiting
    let receipt
    try {
      tx = await signer.provider.getTransaction(swapProcess.txHash)
      receipt = await signer.provider.waitForTransaction(swapProcess.txHash)
    } catch (e: any) {
      // -> set status
      if (e.message) swapProcess.errorMessage = e.message
      if (e.code) swapProcess.errorCode = e.code
      setStatusFailed(update, status, swapProcess)
      notifications.showNotification(NotificationType.SWAP_ERROR)
      throw e
    }

    // -> set status
    swapProcess.message = 'Swapped:'
    const parsedReceipt = uniswap.parseReceipt(tx, receipt)
    setStatusDone(update, status, swapProcess, {
      fromAmount: parsedReceipt.fromAmount,
      toAmount: parsedReceipt.toAmount,
      gasUsed: (status.gasUsed || 0) + parsedReceipt.gasUsed,
    })

    // -> set status
    status.fromAmount = parsedReceipt.fromAmount
    status.toAmount = parsedReceipt.toAmount
    status.gasUsed = (status.gasUsed || 0) + parsedReceipt.gasUsed
    status.status = 'DONE'
    update(status)
    notifications.showNotification(NotificationType.SWAP_SUCCESSFUL)

    // DONE
    return status
  }
}
