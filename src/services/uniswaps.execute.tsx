
import { JsonRpcSigner } from '@ethersproject/providers'
import BigNumber from 'bignumber.js'
import { Execution, getChainById } from '../types'
import localNotifications, { NotificationType } from './localNotifications'
import { createAndPushProcess, initStatus, setStatusDone, setStatusFailed } from './status'
import * as uniswap from './uniswaps'
import { getApproved, setApproval } from './utils'

export const executeUniswap = async (chainId: number, signer: JsonRpcSigner, srcToken: string, srcAmount: BigNumber, srcAddress: string, destAddress: string, path: Array<string>, updateStatus?: Function, initialStatus?: Execution) => {

  // setup
  const fromChain = getChainById(chainId)
  const { status, update } = initStatus(updateStatus, initialStatus)


  // Ask user to set allowance
  // -> set status
  console.log('set status')
  const allowanceProcess = createAndPushProcess(update, status, 'Set Allowance')

  // -> check allowance
  try {
    const contractAddress = uniswap.getContractAddress(chainId)
    const approved = await getApproved(signer, srcToken, contractAddress)

    if (srcAmount.gt(approved)) {
      const approveTx = await setApproval(signer, srcToken, contractAddress, srcAmount.toString())

      // update status
      allowanceProcess.status = 'PENDING'
      allowanceProcess.txHash = approveTx.hash
      allowanceProcess.txLink = fromChain.metamask.blockExplorerUrls[0] + 'tx/' + allowanceProcess.txHash
      allowanceProcess.message = <>Approve - Wait for <a href={allowanceProcess.txLink} target="_blank" rel="nofollow noreferrer">Tx</a></>
      update(status)

      // wait for transcation
      await approveTx.wait()

      // -> set status
      allowanceProcess.message = <>Approved (<a href={allowanceProcess.txLink} target="_blank" rel="nofollow noreferrer">Tx</a>)</>
    } else {
      allowanceProcess.message = 'Already Approved'
    }
    setStatusDone(update, status, allowanceProcess)
    console.log('set done')
  } catch (e: any) {
    // -> set status
    if (e.message) allowanceProcess.errorMessage = e.message
    if (e.code) allowanceProcess.errorCode = e.code
    setStatusFailed(update, status, allowanceProcess)
    throw e
  }


  // Swap via Uniswap
  // -> set status
  const swapProcess = createAndPushProcess(update, status, 'Swap via Uniswap')
  console.log('set next')

  // -> swapping
  let tx
  try {
    tx = await uniswap.swap(signer, chainId, destAddress, srcAmount.toString(), path)
  } catch (e: any) {
    // -> set status
    if (e.message) allowanceProcess.errorMessage = e.message
    if (e.code) allowanceProcess.errorCode = e.code
    setStatusFailed(update, status, swapProcess)
    throw e
  }

  // -> set status
  setStatusDone(update, status, swapProcess)


  // Wait for transaction
  // -> set status
  const waitingProcess = createAndPushProcess(update, status, 'Wait for Transaction')

  // -> waiting
  let receipt
  try {
    receipt = await tx.wait()
  } catch (e: any) {
    // -> set status
    if (e.message) allowanceProcess.errorMessage = e.message
    if (e.code) allowanceProcess.errorCode = e.code
    setStatusFailed(update, status, waitingProcess)
    localNotifications.showNotification(NotificationType.SWAP_ERROR)
    throw e
  }

  // -> set status
  const parsedReceipt = uniswap.parseReceipt(tx, receipt)
  setStatusDone(update, status, waitingProcess, {
    fromAmount: parsedReceipt.fromAmount,
    toAmount: parsedReceipt.toAmount,
    gasUsed: (status.gasUsed || 0) + parsedReceipt.gasUsed,
  })

  // // -> set status
  status.status = 'DONE'
  update(status)
  localNotifications.showNotification(NotificationType.SWAP_SUCCESSFUL)


  // DONE
  return status
}
