import { TransactionResponse } from '@ethersproject/providers'
import { constants } from 'ethers'

import { ExecuteSwapParams, getChainById } from '../types'
import { oneInch } from './1Inch'
import { checkAllowance } from './allowance.execute'
import Lifi from './LIFI/Lifi'
import notifications, { NotificationType } from './notifications'
import { createAndPushProcess, initStatus, setStatusDone, setStatusFailed } from './status'
import { personalizeStep } from './utils'

export class OneInchExecutionManager {
  shouldContinue: boolean = true

  setShouldContinue = (val: boolean) => {
    this.shouldContinue = val
  }

  executeSwap = async ({ signer, step, srcAmount, updateStatus }: ExecuteSwapParams) => {
    // setup
    const { action, execution } = step
    const fromChain = getChainById(action.fromChainId)
    const { status, update } = initStatus(updateStatus, execution)
    if (!this.shouldContinue) return status
    if (action.fromToken.id !== constants.AddressZero) {
      const contractAddress = await oneInch.getContractAddress()
      await checkAllowance(
        signer,
        fromChain,
        action.fromToken,
        srcAmount.toFixed(0),
        contractAddress,
        update,
        status,
      )
    }

    // https://github.com/ethers-io/ethers.js/issues/1435#issuecomment-814963932

    // Swap via 1inch
    // -> set status
    const swapProcess = createAndPushProcess('swapProcess', update, status, 'Swap via 1inch')
    // -> swapping
    if (!this.shouldContinue) return status
    let tx: TransactionResponse
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
    swapProcess.message = 'Swap via paraswap - Wait for'
    update(status)

    // -> waiting
    let receipt
    try {
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
    const parsedReceipt = oneInch.parseReceipt(tx, receipt)
    swapProcess.message = 'Swapped:'
    status.fromAmount = parsedReceipt.fromAmount
    status.toAmount = parsedReceipt.toAmount
    status.gasUsed = (status.gasUsed || 0) + parsedReceipt.gasUsed
    status.status = 'DONE'
    setStatusDone(update, status, swapProcess)
    notifications.showNotification(NotificationType.SWAP_SUCCESSFUL)

    // DONE
    return status
  }
}
