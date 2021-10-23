import { JsonRpcSigner } from '@ethersproject/providers'
import BigNumber from 'bignumber.js'
import { constants } from 'ethers'
import { Chain, Execution, Token } from '../types'
import { createAndPushProcess, setStatusDone, setStatusFailed } from './status'
import { getApproved, setApproval } from './utils'

export const checkAllowance = async (signer: JsonRpcSigner, chain: Chain, token: Token, amount: string, spenderAddress: string, update: Function, status: Execution, infinteApproval: boolean = false) => {
  // Ask user to set allowance
  // -> set status
  const allowanceProcess = createAndPushProcess(update, status, `Set Allowance for ${token.symbol}`)

  // -> check allowance
  try {
    const approved = await getApproved(signer, token.id, spenderAddress)

    if (new BigNumber(amount).gt(approved)) {
      const approveTx = await setApproval(signer, token.id, spenderAddress, infinteApproval ? amount : constants.MaxUint256.toString())

      // update status
      allowanceProcess.status = 'PENDING'
      allowanceProcess.txHash = approveTx.hash
      allowanceProcess.txLink = chain.metamask.blockExplorerUrls[0] + 'tx/' + allowanceProcess.txHash
      allowanceProcess.message = <>Approve - Wait for <a href={allowanceProcess.txLink} target="_blank" rel="nofollow noreferrer">Tx</a></>
      update(status)

      // wait for transcation
      await approveTx.wait()

      // -> set status
      allowanceProcess.message = <>Approved: <a href={allowanceProcess.txLink} target="_blank" rel="nofollow noreferrer">Tx</a></>
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
