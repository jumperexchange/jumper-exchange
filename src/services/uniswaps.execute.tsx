
import { JsonRpcSigner, TransactionReceipt, TransactionResponse } from '@ethersproject/providers'
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
    const allowanceProcess = createAndPushProcess('allowanceProcess', update, status, 'Set Allowance')
    // -> check allowance
    try {
      if (allowanceProcess.txHash ) {
        await signer.provider.waitForTransaction(allowanceProcess.txHash)
      } else if (allowanceProcess.message === 'Already Approved') {
        setStatusDone(update, status, allowanceProcess)
      } else {
        const contractAddress = uniswap.getContractAddress(chainId)
        const approved = await getApproved(signer, srcToken.id, contractAddress)

        if (srcAmount.gt(approved)) {
          const approveTx = await setApproval(signer, srcToken.id, contractAddress, srcAmount.toString())

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
    } catch (e: any) {
      // -> set status
      if (e.message) allowanceProcess.errorMessage = e.message
      if (e.code) allowanceProcess.errorCode = e.code
      setStatusFailed(update, status, allowanceProcess)
      throw e
    }
    setStatusDone(update, status, allowanceProcess)
  }



  // Swap via Uniswap
  // -> set status
  // const swapProcess = createAndPushProcess(update, status, `Swap via Uniswap`) //TODO: display actual uniswap clone
  const swapProcess = createAndPushProcess('swapProcess', update, status, 'Swap via Uniswap', { status: 'ACTION_REQUIRED' })
  // -> swapping
  let tx
  try {
    if(swapProcess.txHash) {
      tx = await signer.provider.getTransaction(swapProcess.txHash)
    } else {
      tx = await uniswap.swap(signer, chainId, srcToken.id, destToken.id, destAddress, srcAmount.toString(), path)
      swapProcess.txHash = tx.hash
      update(status)
    }
  } catch (e: any) {
    // -> set status
    if (e.message) swapProcess.errorMessage = e.message
    if (e.code) swapProcess.errorCode = e.code
    setStatusFailed(update, status, swapProcess)
    throw e
  }
  setStatusDone(update, status, swapProcess)


  // Wait for transaction
  // -> set status
  const waitingProcess = createAndPushProcess('waitingProcess', update, status, 'Wait for Transaction')
  waitingProcess.txHash = tx.hash
  update(status)
  // -> waiting
  let receipt
  try {
    tx = await signer.provider.getTransaction(waitingProcess.txHash)
    receipt = await signer.provider.waitForTransaction(waitingProcess.txHash)
  } catch (e: any) {
    // -> set status
    if (e.message) waitingProcess.errorMessage = e.message
    if (e.code) waitingProcess.errorCode = e.code
    setStatusFailed(update, status, waitingProcess)
    notifications.showNotification(NotificationType.SWAP_ERROR)
    throw e
  }

  // -> set status
  const parsedReceipt = uniswap.parseReceipt(tx as TransactionResponse, receipt as TransactionReceipt)
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
