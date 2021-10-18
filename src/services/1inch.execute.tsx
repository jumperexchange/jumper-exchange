import { JsonRpcSigner } from '@ethersproject/providers'
import BigNumber from 'bignumber.js'
import { constants } from 'ethers'
import { Execution, getChainById, SwapAction, SwapEstimate } from '../types'
import { oneInch } from './1Inch'
import { checkAllowance } from './allowance.execute'
import notifications, { NotificationType } from './notifications'
import { createAndPushProcess, initStatus, setStatusDone, setStatusFailed } from './status'

export const executeOneInchSwap = async (signer: JsonRpcSigner, swapAction: SwapAction, swapEstimate: SwapEstimate, srcAmount: BigNumber, srcAddress: string, destAddress: string, updateStatus?: Function, initialStatus?: Execution) => {

  // setup
  const fromChain = getChainById(swapAction.chainId)
  const { status, update } = initStatus(updateStatus, initialStatus)

  if (swapAction.token.id !== constants.AddressZero) {
    const contractAddress = await oneInch.getContractAddress()
    await checkAllowance(signer, fromChain, swapAction.token, swapAction.amount, contractAddress, update, status)
  }

  // Swap via 1inch
  // -> set status
  const swapProcess = createAndPushProcess(update, status, 'Swap via 1inch', { status: 'ACTION_REQUIRED' })

  // -> swapping
  let tx
  try {
    const userAddress = await signer.getAddress()
    const call = await oneInch.buildTransaction(swapAction.chainId, swapAction.token.id, swapAction.toToken.id, srcAmount.toString(), userAddress, destAddress, swapAction.slippage)
    tx = await signer.sendTransaction(call)
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
  swapProcess.message = <>Swap via 1inch - Wait for <a href={swapProcess.txLink} target="_blank" rel="nofollow noreferrer">Tx</a></>
  update(status)

  // -> waiting
  let receipt
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
  const parsedReceipt = oneInch.parseReceipt(tx, receipt)
  swapProcess.message = <>Swapped: <a href={swapProcess.txLink} target="_blank" rel="nofollow noreferrer">Tx</a></>
  status.fromAmount = parsedReceipt.fromAmount
  status.toAmount = parsedReceipt.toAmount
  status.gasUsed = (status.gasUsed || 0) + parsedReceipt.gasUsed
  status.status = 'DONE'
  setStatusDone(update, status, swapProcess)
  notifications.showNotification(NotificationType.SWAP_SUCCESSFUL)

  // DONE
  return status
}
