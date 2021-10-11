import { JsonRpcSigner } from '@ethersproject/providers'
import BigNumber from 'bignumber.js'
import { Execution, getChainById } from '../types'
import { oneInch } from './1Inch'
import { createAndPushProcess, initStatus, setStatusDone, setStatusFailed } from './status'
import { getApproved, setApproval } from './utils'
import { constants } from 'ethers';
import notifications, { NotificationType } from './notifications'

export const executeOneInchSwap = async (chainId: number, signer: JsonRpcSigner, srcToken: string, destToken: string, srcAmount: BigNumber, srcAddress: string, destAddress: string, updateStatus?: Function, initialStatus?: Execution) => {

  // setup
  const fromChain = getChainById(chainId)
  const { status, update } = initStatus(updateStatus, initialStatus)

  if (srcToken !== constants.AddressZero) {
    // Ask user to set allowance
    // -> set status
    const allowanceProcess = createAndPushProcess('allowanceProcess', update, status, 'Set Allowance for 1inch')

    // -> check allowance
    try {

      if (allowanceProcess.txHash) {
        await signer.provider.waitForTransaction(allowanceProcess.txHash)
      } else {
        const contractAddress = await oneInch.getContractAddress()
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
      }
    } catch (e:any) {
      // -> set status
      if (e.message) allowanceProcess.errorMessage = e.message
      if (e.code) allowanceProcess.errorCode = e.code
      setStatusFailed(update, status, allowanceProcess)
      throw e
    }
    setStatusDone(update, status, allowanceProcess)
  }

  // Swap via 1inch
  // -> set status
  const swapProcess = createAndPushProcess('swapProcess', update, status, 'Swap via 1inch')
  // -> swapping
  let tx
  try {
    if(swapProcess.txHash) {
      tx = await signer.provider.getTransaction(swapProcess.txHash)
    } else {
      swapProcess.status = 'ACTION_REQUIRED'
      update(status)
      tx = await oneInch.transfer(signer, chainId, srcToken, destToken, srcAmount.toString(), destAddress)
      swapProcess.status = 'PENDING'
      swapProcess.txHash = tx.hash
      swapProcess.txLink = fromChain.metamask.blockExplorerUrls[0] + 'tx/' + swapProcess.txHash
      swapProcess.message = <>Swap via 1inch - Wait for <a href={swapProcess.txLink} target="_blank" rel="nofollow noreferrer">Tx</a></>
      update(status)
    }
  } catch (e:any) {
    // -> set status
    if (e.message) swapProcess.errorMessage = e.message
    if (e.code) swapProcess.errorCode = e.code
    setStatusFailed(update, status, swapProcess)
    throw e
  }

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
  const parsedReceipt = oneInch.parseReceipt(tx, receipt)
  swapProcess.message = <>Swapped via 1inch (<a href={swapProcess.txLink} target="_blank" rel="nofollow noreferrer">Tx</a>)</>
  status.fromAmount = parsedReceipt.fromAmount
  status.toAmount = parsedReceipt.toAmount
  status.gasUsed = (status.gasUsed || 0) + parsedReceipt.gasUsed
  status.status = 'DONE'
  setStatusDone(update, status, swapProcess)
  notifications.showNotification(NotificationType.SWAP_SUCCESSFUL)

  // DONE
  return status
}
