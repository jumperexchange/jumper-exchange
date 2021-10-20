import { JsonRpcSigner, TransactionReceipt, TransactionResponse } from '@ethersproject/providers'
import BigNumber from 'bignumber.js'
import { constants } from 'ethers'
import { Execution, getChainById, SwapAction, SwapEstimate } from '../types'
import { checkAllowance } from './allowance.execute'
import notifications, { NotificationType } from './notifications'
import { paraswap } from './paraswap'
import { createAndPushProcess, initStatus, setStatusDone, setStatusFailed } from './status'


export class ParaswapExecutionManager {
  shouldContinue: boolean = true

  setShouldContinue  =  (val: boolean) => {
    this.shouldContinue = val
  }

  executeSwap = async (signer: JsonRpcSigner, swapAction: SwapAction, swapEstimate: SwapEstimate, srcAmount: BigNumber, srcAddress: string, destAddress: string, updateStatus?: Function, initialStatus?: Execution) => {

    // setup
    const fromChain = getChainById(swapAction.chainId)
    const { status, update } = initStatus(updateStatus, initialStatus)

    if(!this.shouldContinue) return status
    if (swapAction.token.id !== constants.AddressZero) {
      const contractAddress = await paraswap.getContractAddress(swapAction.chainId)
      await checkAllowance(signer, fromChain, swapAction.token, swapAction.amount, contractAddress, update, status)
    }

    // Swap via Paraswap
    // -> set status
    const swapProcess = createAndPushProcess('swapProcess', update, status, 'Swap via Paraswap')

    // -> swapping
    if(!this.shouldContinue) return status
    let tx: TransactionResponse
    try {
      if(swapProcess.txHash){
        tx = await signer.provider.getTransaction(swapProcess.txHash)
      } else {
        const transaction = await paraswap.buildTransaction(swapAction, swapEstimate, srcAmount, srcAddress, destAddress)
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
    swapProcess.message = <>Swap via Paraswap - Wait for <a href={swapProcess.txLink} target="_blank" rel="nofollow noreferrer">Tx</a></>
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
    swapProcess.message = <>Swapped: <a href={swapProcess.txLink} target="_blank" rel="nofollow noreferrer">Tx</a></>
    const parsedReceipt = paraswap.parseReceipt(tx as TransactionResponse, receipt as TransactionReceipt)
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
