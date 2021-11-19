/* eslint-disable max-params */
import { NxtpSdkEvents } from '@connext/nxtp-sdk'
import { constants } from 'ethers'

import { getRpcProviders } from '../components/web3/connectors'
import { ExecuteCrossParams, getChainById } from '../types'
import { checkAllowance } from './allowance.execute'
import Lifi from './LIFI/Lifi'
import notifications, { NotificationType } from './notifications'
import * as nxtp from './nxtp'
import { createAndPushProcess, initStatus, setStatusDone, setStatusFailed } from './status'
import { personalizeStep } from './utils'

export class NXTPExecutionManager {
  shouldContinue: boolean = true

  setShouldContinue = (val: boolean) => {
    this.shouldContinue = val
  }

  executeCross = async ({ signer, step, updateStatus }: ExecuteCrossParams) => {
    // TODO: add continue logic

    const { action, execution, estimate } = step
    const { status, update } = initStatus(updateStatus, execution)
    const fromChain = getChainById(action.fromChainId)
    const transactionId = estimate.data.bid.transactionId

    // init sdk
    const crossableChains = [action.fromChainId, action.toChainId]
    const chainProviders = getRpcProviders(crossableChains)
    const nxtpSDK = await nxtp.setup(signer, chainProviders)

    if (!this.shouldContinue) {
      nxtpSDK.removeAllListeners()
      return status
    }

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

    setStatusDone(update, status, crossProcess)

    // STEP 5: Wait for ReceiverTransactionPrepared //////////////////////////////////////
    const claimProcess = createAndPushProcess('claimProcess', update, status, 'Wait for bridge')

    const preparedTransaction = await nxtpSDK.waitFor(
      NxtpSdkEvents.ReceiverTransactionPrepared,
      10 * 60 * 1000,
      (data) => data.txData.transactionId === transactionId,
    )

    // STEP 6: Claim //////////////////////////////////////////////////////////
    claimProcess.status = 'ACTION_REQUIRED'
    claimProcess.message = 'Claim transfer'
    update(status)

    const fulfillPromise = nxtpSDK.fulfillTransfer(preparedTransaction)

    // STEP 7: Wait for signature //////////////////////////////////////////////////////////
    await nxtpSDK.waitFor(
      NxtpSdkEvents.ReceiverPrepareSigned,
      100_000,
      (data) => data.transactionId === transactionId,
    )

    claimProcess.status = 'PENDING'
    claimProcess.message = 'Waiting for claim'
    update(status)

    try {
      await fulfillPromise
    } catch (e) {
      // handle errors
      // TODO: setStatusFailed
    }

    // TODO: listen on ReceiverTransactionFulfilled to be able to extract the receipt
    claimProcess.message = 'Swapped:'
    status.fromAmount = estimate.fromAmount
    status.toAmount = estimate.toAmount
    status.status = 'DONE'
    setStatusDone(update, status, claimProcess)
    notifications.showNotification(NotificationType.CROSS_SUCCESSFUL)

    // DONE
    return status
  }
}
