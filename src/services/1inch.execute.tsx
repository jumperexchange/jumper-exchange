import { JsonRpcSigner } from '@ethersproject/providers'
import { AnyRecord } from 'dns'
import { getChainById } from '../types/lists'
import { Execution } from '../types/server'
import { oneInch } from './1Inch'
import { createAndPushProcess, initStatus, setStatusDone, setStatusFailed } from './status'

export const executeOneInchSwap = async (chainId: number, signer: JsonRpcSigner, srcToken: string, destToken: string, srcAmount: number, srcAddress: string, destAddress: string, updateStatus?: Function, initialStatus?: Execution) => {

  // setup
  const { status, update } = initStatus(updateStatus, initialStatus)

  // Ask user to set allowance
  // -> set status
  const allowanceProcess = createAndPushProcess(update, status, 'Set Allowance')

  // -> check allowance
  try {
    await oneInch.setAllowance(chainId, srcAmount, srcToken, signer)
  } catch (e:any) {
    // -> set status
    if (e.message) allowanceProcess.errorMessage = e.message
    if (e.code) allowanceProcess.errorCode = e.code
    setStatusFailed(update, status, allowanceProcess)
    throw e
  }

  // -> set status
  setStatusDone(update, status, allowanceProcess)

  // Swap via 1inch
  // -> set status
  const swapProcess = createAndPushProcess(update, status, 'Swap via 1inch', { status: 'ACTION_REQUIRED' })

  // -> swapping
  let tx
  try {
    tx = await oneInch.transfer(signer, chainId, srcToken, destToken, srcAmount, destAddress)
  } catch (e:any) {
    // -> set status
    if (e.message) allowanceProcess.errorMessage = e.message
    if (e.code) allowanceProcess.errorCode = e.code
    setStatusFailed(update, status, swapProcess)
    throw e
  }

  // -> set status
  const fromChain = getChainById(chainId)
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
    if (e.message) allowanceProcess.errorMessage = e.message
    if (e.code) allowanceProcess.errorCode = e.code
    setStatusFailed(update, status, swapProcess)
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

  // DONE
  return status
}
