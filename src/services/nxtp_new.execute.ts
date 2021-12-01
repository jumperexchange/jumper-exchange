import { NxtpSdkEvents } from '@connext/nxtp-sdk'
import { constants } from 'ethers'

import { getRpcProviders } from '../components/web3/connectors'
import { ExecuteCrossParams, getChainById, isLifiStep, isSwapStep } from '../types'
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
    const { action, execution, estimate } = step
    const { status, update } = initStatus(updateStatus, execution)
    const fromChain = getChainById(action.fromChainId)
    const toChain = getChainById(action.toChainId)
    const transactionId = step.id

    // init sdk
    const crossableChains = [action.fromChainId, action.toChainId]
    const chainProviders = getRpcProviders(crossableChains)
    const nxtpSDK = await nxtp.setup(signer, chainProviders)

    // STEP 0: Check Allowance ////////////////////////////////////////////////
    if (action.fromToken.id !== constants.AddressZero) {
      // Check Token Approval only if fromToken is not the native token => no approval needed in that case
      if (!this.shouldContinue) return status
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

    // STEP 1: Get Public Key ////////////////////////////////////////////////
    if (isLifiStep(step) && isSwapStep(step.includedSteps[step.includedSteps.length - 1])) {
      // -> set status
      const keyProcess = createAndPushProcess('publicKey', update, status, 'Provide Public Key', {
        status: 'ACTION_REQUIRED',
      })
      if (!this.shouldContinue) return status
      // -> request key
      try {
        const encryptionPublicKey = await (window as any).ethereum.request({
          method: 'eth_getEncryptionPublicKey',
          params: [await signer.getAddress()], // you must have access to the specified account
        })
        // store key
        if (!step.estimate.data) step.estimate.data = {}
        step.estimate.data.encryptionPublicKey = encryptionPublicKey
      } catch (e) {
        setStatusFailed(update, status, keyProcess)
        throw e
      }
      // -> set status
      setStatusDone(update, status, keyProcess)
    }

    // STEP 2: Get Transaction ////////////////////////////////////////////////
    const crossProcess = createAndPushProcess('crossProcess', update, status, 'Prepare Transaction')

    const personalizedStep = await personalizeStep(signer, step)
    const { tx: transactionRequest } = await Lifi.getStepTransaction(personalizedStep)

    // STEP 3: Send Transaction ///////////////////////////////////////////////
    crossProcess.status = 'ACTION_REQUIRED'
    crossProcess.message = 'Sign Transaction'
    update(status)
    if (!this.shouldContinue) return status

    const tx = await signer.sendTransaction(transactionRequest)

    // STEP 4: Wait for Transaction ///////////////////////////////////////////
    crossProcess.status = 'PENDING'
    crossProcess.txHash = tx.hash
    crossProcess.txLink = fromChain.metamask.blockExplorerUrls[0] + 'tx/' + crossProcess.txHash
    crossProcess.message = 'Wait for'
    update(status)

    await tx.wait()

    crossProcess.message = 'Transfer started: '
    setStatusDone(update, status, crossProcess)

    // STEP 5: Wait for ReceiverTransactionPrepared //////////////////////////////////////
    const claimProcess = createAndPushProcess('claimProcess', update, status, 'Wait for bridge')

    const preparedTransaction = await nxtpSDK.waitFor(
      NxtpSdkEvents.ReceiverTransactionPrepared,
      // 10 * 60 * 1000,
      100_000,
      (data) => data.txData.transactionId === transactionId,
    )

    // STEP 6: Claim //////////////////////////////////////////////////////////
    claimProcess.status = 'ACTION_REQUIRED'
    claimProcess.message = 'Claim transfer'
    update(status)
    if (!this.shouldContinue) return status

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
      const data = await fulfillPromise
      claimProcess.txHash = data.transactionHash
      claimProcess.txLink = toChain.metamask.blockExplorerUrls[0] + 'tx/' + claimProcess.txHash
      claimProcess.message = 'Swapped:'
    } catch (e) {
      // handle errors
      // TODO: setStatusFailed
    }

    // TODO: listen on ReceiverTransactionFulfilled to be able to extract the receipt

    status.fromAmount = estimate.fromAmount
    status.toAmount = estimate.toAmount
    status.status = 'DONE'
    setStatusDone(update, status, claimProcess)
    notifications.showNotification(NotificationType.CROSS_SUCCESSFUL)

    // DONE
    return status
  }
}
