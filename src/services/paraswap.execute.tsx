import { JsonRpcSigner } from '@ethersproject/providers'
import BigNumber from 'bignumber.js'
import * as paraswap from './paraswap'
import { Execution, getChainById, Token } from '../types'
import { createAndPushProcess, initStatus, setStatusDone, setStatusFailed } from './status'
import { getApproved, setApproval } from './utils'
import { constants } from 'ethers'

export const executeParaswap = async (chainId: number, signer: JsonRpcSigner, srcToken: Token, destToken: Token, srcAmount: BigNumber, srcAddress: string, destAddress: string, updateStatus?: Function, initialStatus?: Execution) => {

  // setup
  const fromChain = getChainById(chainId)
  const { status, update } = initStatus(updateStatus, initialStatus)

  if (srcToken.id !== constants.AddressZero) {
    // Ask user to set allowance
    // -> set status
    const allowanceProcess = createAndPushProcess(update, status, 'Set Allowance for Paraswap')

    // -> check allowance
    try {
      const contractAddress = await paraswap.getContractAddress(chainId) as string
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
      setStatusDone(update, status, allowanceProcess)
    } catch (e:any) {
      // -> set status
      if (e.message) allowanceProcess.errorMessage = e.message
      if (e.code) allowanceProcess.errorCode = e.code
      setStatusFailed(update, status, allowanceProcess)
      throw e
    }
  }

  // Swap via Paraswap
  // -> set status
  const swapProcess = createAndPushProcess(update, status, 'Swap via Paraswap')

  // -> swapping
  let tx
  try {
    tx = await paraswap.transfer(signer, chainId, srcAddress, srcToken.id, destToken.id, srcAmount.toString(), destAddress, srcToken.decimals, destToken.decimals)
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
    throw e
  }

  // -> set status
  const parsedReceipt = paraswap.parseReceipt(tx, receipt)
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

  // DONE
  return status
}
