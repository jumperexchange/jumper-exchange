import { TransactionResponse } from '@ethersproject/abstract-provider'
import { constants } from 'ethers'

import { createAndPushProcess, initStatus, setStatusDone, setStatusFailed } from '../../../status'
import { personalizeStep } from '../../../utils'
import Lifi from '../../Lifi'
import { ExecuteCrossParams, getChainById } from '../../types'
import { checkAllowance } from '../allowance.execute'
import hop from './hop'

export class HopExecutionManager {
  shouldContinue: boolean = true

  setShouldContinue = (val: boolean) => {
    this.shouldContinue = val
  }

  execute = async ({ signer, step, updateStatus }: ExecuteCrossParams) => {
    const { action, execution, estimate } = step
    const { status, update } = initStatus(updateStatus, execution)
    const fromChain = getChainById(action.fromChainId)
    const toChain = getChainById(action.toChainId)

    // STEP 1: Check Allowance ////////////////////////////////////////////////
    // approval still needed?
    const oldCrossProcess = status.process.find((p) => p.id === 'crossProcess')
    if (!oldCrossProcess || !oldCrossProcess.txHash) {
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
    }

    // STEP 2: Get Transaction ////////////////////////////////////////////////
    const crossProcess = createAndPushProcess('crossProcess', update, status, 'Prepare Transaction')

    try {
      let tx: TransactionResponse
      if (crossProcess.txHash) {
        // load exiting transaction
        tx = await signer.provider.getTransaction(crossProcess.txHash)
      } else {
        // create new transaction
        const personalizedStep = await personalizeStep(signer, step)
        const { tx: transactionRequest } = await Lifi.getStepTransaction(personalizedStep)

        // STEP 3: Send Transaction ///////////////////////////////////////////////
        crossProcess.status = 'ACTION_REQUIRED'
        crossProcess.message = 'Sign Transaction'
        update(status)
        if (!this.shouldContinue) return status

        tx = await signer.sendTransaction(transactionRequest)

        // STEP 4: Wait for Transaction ///////////////////////////////////////////
        crossProcess.status = 'PENDING'
        crossProcess.txHash = tx.hash
        crossProcess.txLink = fromChain.metamask.blockExplorerUrls[0] + 'tx/' + crossProcess.txHash
        crossProcess.message = 'Wait for'
        update(status)
      }

      await tx.wait()
    } catch (e: any) {
      if (e.message) crossProcess.errorMessage = e.message
      if (e.code) crossProcess.errorCode = e.code
      setStatusFailed(update, status, crossProcess)
      throw e
    }

    crossProcess.message = 'Transfer started: '
    setStatusDone(update, status, crossProcess)

    // STEP 5: Wait for Receiver //////////////////////////////////////
    const waitForTxProcess = createAndPushProcess(
      'waitForTxProcess',
      update,
      status,
      'Wait for Receiving Chain',
    )
    let destinationTxReceipt
    try {
      hop.init(signer, action.fromChainId, action.toChainId)
      destinationTxReceipt = await hop.waitForDestinationChainReceipt(
        crossProcess.txHash,
        action.toToken.key,
        action.fromChainId,
        action.toChainId,
      )
    } catch (e: any) {
      waitForTxProcess.errorMessage = 'Failed waiting'
      if (e.message) waitForTxProcess.errorMessage += ':\n' + e.message
      if (e.code) waitForTxProcess.errorCode = e.code
      setStatusFailed(update, status, waitForTxProcess)
      throw e
    }

    // -> parse receipt & set status
    const parsedReceipt = hop.parseReceipt(crossProcess.txHash, destinationTxReceipt)
    waitForTxProcess.txHash = destinationTxReceipt.transactionHash
    waitForTxProcess.txLink =
      toChain.metamask.blockExplorerUrls[0] + 'tx/' + waitForTxProcess.txHash
    waitForTxProcess.message = 'Funds Received:'
    status.fromAmount = parsedReceipt.fromAmount
    status.toAmount = parsedReceipt.toAmount
    // status.gasUsed = parsedReceipt.gasUsed
    status.status = 'DONE'
    setStatusDone(update, status, waitForTxProcess)

    // DONE
    return status
  }
}
