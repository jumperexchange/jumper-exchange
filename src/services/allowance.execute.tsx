import { JsonRpcSigner } from '@ethersproject/providers'
import BigNumber from 'bignumber.js'

import { Chain, Execution, Token } from '../types'
import { createAndPushProcess, setStatusDone, setStatusFailed } from './status'
import { getApproved, setApproval } from './utils'

export const checkAllowance = async (
  signer: JsonRpcSigner,
  chain: Chain,
  token: Token,
  amount: string,
  spenderAddress: string,
  update: Function,
  status: Execution,
  // eslint-disable-next-line max-params
) => {
  // Ask user to set allowance
  // -> set status
  const allowanceProcess = createAndPushProcess(
    'allowanceProcess',
    update,
    status,
    `Set Allowance for ${token.symbol}`,
  )

  // -> check allowance
  try {
    if (allowanceProcess.txHash) {
      await signer.provider.waitForTransaction(allowanceProcess.txHash)
      setStatusDone(update, status, allowanceProcess)
    } else if (allowanceProcess.message === 'Already Approved') {
      setStatusDone(update, status, allowanceProcess)
    } else {
      const approved = await getApproved(signer, token.id, spenderAddress)

      if (new BigNumber(amount).gt(approved)) {
        const approveTx = await setApproval(signer, token.id, spenderAddress, amount)

        // update status
        allowanceProcess.status = 'PENDING'
        allowanceProcess.txHash = approveTx.hash
        allowanceProcess.txLink =
          chain.metamask.blockExplorerUrls[0] + 'tx/' + allowanceProcess.txHash
        allowanceProcess.message = 'Approve - Wait for'
        update(status)

        // wait for transcation
        await approveTx.wait()

        // -> set status
        allowanceProcess.message = 'Approved:'
      } else {
        allowanceProcess.message = 'Already Approved'
      }
      setStatusDone(update, status, allowanceProcess)
    }
  } catch (e: any) {
    // -> set status
    if (e.message) allowanceProcess.errorMessage = e.message
    if (e.code) allowanceProcess.errorCode = e.code
    setStatusFailed(update, status, allowanceProcess)
    throw e
  }
}
