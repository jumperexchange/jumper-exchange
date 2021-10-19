
import { JsonRpcSigner } from '@ethersproject/providers'
import { constants } from 'ethers'
import { Execution, getChainById, SwapAction, SwapEstimate } from '../types'
import { checkAllowance } from './allowance.execute'
import notifications, { NotificationType } from './notifications'
import { createAndPushProcess, initStatus, setStatusDone, setStatusFailed } from './status'
import * as uniswap from './uniswaps'

export const executeUniswap = async (signer: JsonRpcSigner, swapAction: SwapAction, swapEstimate: SwapEstimate, srcAddress: string, destAddress: string, updateStatus?: Function, initialStatus?: Execution) => {

  // setup
  const fromChain = getChainById(swapAction.chainId)
  const { status, update } = initStatus(updateStatus, initialStatus)

  if (swapAction.token.id !== constants.AddressZero) {
    const contractAddress = uniswap.getContractAddress(swapAction.chainId)
    await checkAllowance(signer, fromChain, swapAction.token, swapAction.amount, contractAddress, update, status)
  }

  // Swap via Uniswap
  // -> set status
  // const swapProcess = createAndPushProcess(update, status, `Swap via Uniswap`) //TODO: display actual uniswap clone
  const swapProcess = createAndPushProcess('swapProcess', update, status, 'Submit Swap', { status: 'ACTION_REQUIRED' })

  // -> swapping
  let tx
  try {
    if(swapProcess.txHash){
      tx = await signer.provider.getTransaction(swapProcess.txHash)
    } else{
      const call = await uniswap.getSwapCall(swapAction, swapEstimate, srcAddress, destAddress)
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
  swapProcess.message = <>Swap - Wait for <a href={swapProcess.txLink} target="_blank" rel="nofollow noreferrer">Tx</a></>
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
  swapProcess.message = <>Swapped: <a href={swapProcess.txLink} target="_blank" rel="nofollow noreferrer">Tx</a></>
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
