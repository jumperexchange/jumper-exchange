
import { JsonRpcSigner } from '@ethersproject/providers'
import BigNumber from 'bignumber.js'
import { constants } from 'ethers'
import { Execution, getChainById, Token } from '../types'
import notifications, { NotificationType } from './notifications'

import { createAndPushProcess, initStatus, setStatusDone, setStatusFailed } from './status'
import * as uniswap from './uniswaps'
import { getApproved, setApproval } from './utils'

export const executeUniswap = async (chainId: number, signer: JsonRpcSigner, srcToken: Token, destToken: Token, srcAmount: BigNumber, srcAddress: string, destAddress: string, path: Array<string>, updateStatus?: Function, initialStatus?: Execution) => {

  // setup
  const fromChain = getChainById(chainId)
  const { status, update } = initStatus(updateStatus, initialStatus)

  if (srcToken.id !== constants.AddressZero) {
    // Ask user to set allowance
    // -> set status
    const allowanceProcess = createAndPushProcess(update, status, 'Set Allowance')


    // -> check allowance
    try {
      const contractAddress = uniswap.getContractAddress(chainId)
      const approved = await getApproved(signer, srcToken.id, contractAddress)

      if (srcAmount.gt(approved)) {
        const approveTx = await setApproval(signer, srcToken.id, contractAddress, srcAmount.toFixed(0))

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
    } catch (e: any) {
      // -> set status
      if (e.message) allowanceProcess.errorMessage = e.message
      if (e.code) allowanceProcess.errorCode = e.code
      setStatusFailed(update, status, allowanceProcess)
      throw e
    }
  }


  // Swap via Uniswap
  // -> set status
  // const swapProcess = createAndPushProcess(update, status, `Swap via Uniswap`) //TODO: display actual uniswap clone
  const swapProcess = createAndPushProcess(update, status, 'Swap via Uniswap', { status: 'ACTION_REQUIRED' })

  // -> swapping
  let tx
  try {
    tx = await uniswap.swap(signer, chainId, srcToken.id, destToken.id, destAddress, srcAmount.toString(), path)
  } catch (e: any) {
    // -> set status
    if (e.message) swapProcess.errorMessage = e.message
    if (e.code) swapProcess.errorCode = e.code
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
    if (e.message) waitingProcess.errorMessage = e.message
    if (e.code) waitingProcess.errorCode = e.code
    setStatusFailed(update, status, waitingProcess)
    notifications.showNotification(NotificationType.SWAP_ERROR)
    throw e
  }

  // -> set status
  const parsedReceipt = uniswap.parseReceipt(tx, receipt)
  setStatusDone(update, status, waitingProcess, {
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
