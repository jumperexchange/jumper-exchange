import { TransactionReceipt, TransactionResponse } from '@ethersproject/providers'
import { constants } from 'ethers'

import { ExecuteSwapParams, getChainById } from '../types'
import { checkAllowance } from './allowance.execute'
import Lifi from './LIFI/Lifi'
import notifications, { NotificationType } from './notifications'
import { createAndPushProcess, initStatus, setStatusDone, setStatusFailed } from './status'
import { personalizeStep } from './utils'

export default class SwapExecutionManager {
  shouldContinue: boolean = true

  setShouldContinue = (val: boolean) => {
    this.shouldContinue = val
  }

  executeSwap = async ({ signer, step, parseReceipt, updateStatus }: ExecuteSwapParams) => {
    // setup
    const { action, execution, estimate } = step
    const fromChain = getChainById(action.fromChainId)
    const { status, update } = initStatus(updateStatus, execution)

    // Approval
    if (!this.shouldContinue) return status
    if (action.fromToken.id !== constants.AddressZero) {
      await checkAllowance(
        signer,
        fromChain,
        action.fromToken,
        action.fromAmount,
        estimate.approvalAddress,
        update,
        status,
      )
    }

    // Start Swap
    // -> set status
    const swapProcess = createAndPushProcess('swapProcess', update, status, 'Preparing Swap')

    // -> swapping
    let tx: TransactionResponse
    try {
      if (swapProcess.txHash) {
        // -> restore existing tx
        tx = await signer.provider.getTransaction(swapProcess.txHash)
      } else {
        if (!this.shouldContinue) return status // stop before user interaction is needed

        // -> get tx from backend
        const personalizedStep = await personalizeStep(signer, step)
        const { tx: transaction } = await Lifi.getStepTransaction(personalizedStep)

        // -> set status
        swapProcess.status = 'ACTION_REQUIRED'
        swapProcess.message = `Sign Transaction`
        update(status)

        // -> submit tx
        tx = await signer.sendTransaction(transaction)
      }
    } catch (e: any) {
      // -> set status
      if (e.message) swapProcess.errorMessage = e.message
      if (e.code) swapProcess.errorCode = e.code
      setStatusFailed(update, status, swapProcess)
      throw e
    }

    // Wait for Transaction
    // -> set status
    swapProcess.status = 'PENDING'
    swapProcess.txHash = tx.hash
    swapProcess.txLink = fromChain.metamask.blockExplorerUrls[0] + 'tx/' + swapProcess.txHash
    swapProcess.message = `Swapping - Wait for`
    update(status)

    // -> waiting
    let receipt: TransactionReceipt
    try {
      receipt = await tx.wait()
    } catch (e: any) {
      // -> set status
      if (e.message) swapProcess.errorMessage = e.message
      if (e.code) swapProcess.errorCode = e.code
      setStatusFailed(update, status, swapProcess)
      notifications.showNotification(NotificationType.SWAP_ERROR)
      throw e
    }

    // -> set status
    const parsedReceipt = parseReceipt(tx, receipt)
    swapProcess.message = 'Swapped:'
    status.fromAmount = parsedReceipt.fromAmount
    status.toAmount = parsedReceipt.toAmount
    // status.gasUsed = parsedReceipt.gasUsed
    status.status = 'DONE'
    setStatusDone(update, status, swapProcess)
    notifications.showNotification(NotificationType.SWAP_SUCCESSFUL)

    // DONE
    return status
  }
}
