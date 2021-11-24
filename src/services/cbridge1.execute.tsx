import { constants } from 'ethers'

import { ExecuteCrossParams, getChainById } from '../types'
import { checkAllowance } from './allowance.execute'
import cbridge1 from './cbridge1'
import Lifi from './LIFI/Lifi'
import notifications, { NotificationType } from './notifications'
import { createAndPushProcess, initStatus, setStatusDone } from './status'
import { personalizeStep } from './utils'

export class Cbridge1ExecutionManager {
  shouldContinue: boolean = true

  setShouldContinue = (val: boolean) => {
    this.shouldContinue = val
  }

  executeCross = async ({ signer, step, updateStatus }: ExecuteCrossParams) => {
    // setup
    const { action, execution, estimate } = step
    const { status, update } = initStatus(updateStatus, execution)
    const fromChain = getChainById(action.fromChainId)

    // STEP 1: Check Allowance ////////////////////////////////////////////////
    if (action.fromToken.id !== constants.AddressZero) {
      // Check Token Approval only if fromToken is not the native token => no approval needed in that case
      await checkAllowance(
        signer,
        fromChain,
        action.fromToken,
        action.fromAmount,
        estimate.approvalAddress,
        update,
        status,
        true,
      )
    }

    // STEP 2: Get Transaction ////////////////////////////////////////////////
    const crossProcess = createAndPushProcess('crossProcess', update, status, 'Prepare Transaction')

    const personalizedStep = await personalizeStep(signer, step)
    const { tx: transactionRequest } = await Lifi.getStepTransaction(personalizedStep)

    // STEP 3: Send Transaction ///////////////////////////////////////////////
    crossProcess.status = 'ACTION_REQUIRED'
    crossProcess.message = 'Sign Transaction'
    update(status)

    const tx = await signer.sendTransaction(transactionRequest)

    // STEP 4: Wait for Transaction ///////////////////////////////////////////
    crossProcess.status = 'PENDING'
    crossProcess.txHash = tx.hash
    crossProcess.txLink = fromChain.metamask.blockExplorerUrls[0] + 'tx/' + crossProcess.txHash
    crossProcess.message = 'Wait for'
    update(status)

    await tx.wait()
    await cbridge1.markTransferOut(step)

    crossProcess.message = 'Transfer started: '
    setStatusDone(update, status, crossProcess)

    // STEP 5: Wait for Claim //////////////////////////////////////
    const claimProcess = createAndPushProcess('claimProcess', update, status, 'Wait for bridge')

    await cbridge1.waitForClaim(step)

    // STEP 6: Claim //////////////////////////////////////////////////////////
    claimProcess.status = 'ACTION_REQUIRED'
    claimProcess.message = 'Claim transfer'
    update(status)

    const claimTransactionRequest = await cbridge1.getClaimTransaction(step)
    const claimTx = await signer.sendTransaction(claimTransactionRequest)

    // STEP 7: Wait for Transaction //////////////////////////////////////////////////////////
    claimProcess.status = 'PENDING'
    claimProcess.txHash = claimTx.hash
    claimProcess.txLink = fromChain.metamask.blockExplorerUrls[0] + 'tx/' + claimProcess.txHash
    claimProcess.message = 'Wait for'
    update(status)

    await tx.wait()
    await cbridge1.userSendConfirm(step, tx.hash)

    claimProcess.message = 'Claim Signed'
    setStatusDone(update, status, claimProcess)

    // STEP 8: Wait for Claim //////////////////////////////////////////////////////////
    const completionProcess = createAndPushProcess(
      'completionProcess',
      update,
      status,
      'Wait for Completion',
    )

    await cbridge1.waitForCompletion(step)

    completionProcess.message = 'Transferred'
    status.fromAmount = estimate.fromAmount
    status.toAmount = estimate.toAmount
    status.status = 'DONE'
    setStatusDone(update, status, completionProcess)
    notifications.showNotification(NotificationType.CROSS_SUCCESSFUL)

    // DONE
    return status
  }
}
