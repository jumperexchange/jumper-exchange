import { JsonRpcSigner, TransactionResponse } from '@ethersproject/providers'
import BigNumber from 'bignumber.js'
import { constants } from 'ethers'

import { Action, Estimate, Execution, getChainById } from '../types'
import { oneInch } from './1Inch'
import { checkAllowance } from './allowance.execute'
import notifications, { NotificationType } from './notifications'
import { createAndPushProcess, initStatus, setStatusDone, setStatusFailed } from './status'

export class OneInchExecutionManager {
  shouldContinue: boolean = true

  setShouldContinue = (val: boolean) => {
    this.shouldContinue = val
  }

  executeSwap = async (
    signer: JsonRpcSigner,
    action: Action,
    estimate: Estimate,
    srcAmount: BigNumber,
    srcAddress: string,
    destAddress: string,
    updateStatus?: Function,
    initialStatus?: Execution,
    // eslint-disable-next-line max-params
  ) => {
    // setup
    const fromChain = getChainById(action.fromChainId)
    const { status, update } = initStatus(updateStatus, initialStatus)
    if (!this.shouldContinue) return status
    if (action.fromToken.id !== constants.AddressZero) {
      const contractAddress = await oneInch.getContractAddress()
      await checkAllowance(
        signer,
        fromChain,
        action.fromToken,
        srcAmount.toString(),
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
        const userAddress = await signer.getAddress()
        const call = await oneInch.buildTransaction(
          action.fromChainId,
          action.fromToken.id,
          action.toToken.id,
          srcAmount.toString(),
          userAddress,
          destAddress,
          action.slippage,
        )
        tx = await signer.sendTransaction(call)
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
