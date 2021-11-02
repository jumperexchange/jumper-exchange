import { JsonRpcSigner, TransactionResponse } from '@ethersproject/providers'
import { Execution, getChainById, SwapAction, SwapEstimate } from '@lifinance/types'
import BigNumber from 'bignumber.js'
import { constants } from 'ethers'

import { checkAllowance } from './allowance.execute'
import notifications, { NotificationType } from './notifications'
import * as paraswap from './paraswap'
import { createAndPushProcess, initStatus, setStatusDone, setStatusFailed } from './status'

export const executeParaswap = async (
  signer: JsonRpcSigner,
  swapAction: SwapAction,
  swapEstimate: SwapEstimate,
  srcAmount: BigNumber,
  srcAddress: string,
  destAddress: string,
  updateStatus?: Function,
  initialStatus?: Execution,
  // eslint-disable-next-line max-params
) => {
  // setup
  const fromChain = getChainById(swapAction.chainId)
  const { status, update } = initStatus(updateStatus, initialStatus)

  if (swapAction.token.id !== constants.AddressZero) {
    const contractAddress = await paraswap.getContractAddress(swapAction.chainId)
    await checkAllowance(
      signer,
      fromChain,
      swapAction.token,
      swapAction.amount,
      contractAddress,
      update,
      status,
    )
  }

  // Swap via Paraswap
  // -> set status
  const swapProcess = createAndPushProcess(update, status, 'Swap via Paraswap')

  // -> swapping
  let tx: TransactionResponse
  try {
    const transaction = await paraswap.transfer(
      swapAction,
      swapEstimate,
      srcAmount,
      srcAddress,
      destAddress,
    )
    tx = await signer.sendTransaction(transaction)
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
  swapProcess.message = (
    <>
      Swap via paraswap - Wait for{' '}
      <a href={swapProcess.txLink} target="_blank" rel="nofollow noreferrer">
        Tx
      </a>
    </>
  )
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
  const parsedReceipt = paraswap.parseReceipt(tx, receipt)
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
