/* eslint-disable max-params */
import { NxtpSdk, NxtpSdkEvents } from '@connext/nxtp-sdk'
import { AuctionResponse } from '@connext/nxtp-utils'
import { JsonRpcSigner } from '@ethersproject/providers'
import BigNumber from 'bignumber.js'

import { getRpcProviders } from '../components/web3/connectors'
import { Estimate, Execution, Process, Step } from '../types'
import notifications, { NotificationType } from './notifications'
import * as nxtp from './nxtp'
import { createAndPushProcess, initStatus, setStatusDone, setStatusFailed } from './status'

export class NXTPExecutionManager {
  shouldContinue: boolean = true

  setShouldContinue = (val: boolean) => {
    this.shouldContinue = val
  }

  private finishTransfer = (
    signer: JsonRpcSigner,
    sdk: NxtpSdk,
    step: Step,
    update: Function,
    status: Execution,
  ) => {
    return new Promise(async (resolve, reject) => {
      sdk.attach(NxtpSdkEvents.ReceiverTransactionPrepared, async (data) => {
        try {
          if (!this.shouldContinue) {
            sdk.removeAllListeners()
            return resolve(status)
          }
          await nxtp.finishTransfer(signer, sdk, data, step, update)
        } catch (e) {
          notifications.showNotification(NotificationType.CROSS_ERROR)
          sdk.removeAllListeners()
          return reject(status)
        }

        sdk.removeAllListeners()

        status.status = 'DONE'
        update(status)
        notifications.showNotification(NotificationType.CROSS_SUCCESSFUL)
        resolve(status)
      })
    })
  }

  executeCross = async (
    signer: JsonRpcSigner,
    step: Step,
    fromAmount: BigNumber,
    userAddress: string,
    updateStatus?: Function,
    initialStatus?: Execution,
  ) => {
    // setup
    let { status, update } = initStatus(updateStatus, initialStatus)
    const action = step.action
    const fromChainId = action.fromChainId
    const toChainId = action.toChainId
    const srcTokenAddress = action.fromToken.id
    const destTokenAddress = action.toToken.id
    // sdk
    // -> set status
    const quoteProcess = createAndPushProcess('quoteProcess', update, status, 'Setup NXTP')
    // -> init sdk
    const crossableChains = [action.fromChainId, action.toChainId]
    const chainProviders = getRpcProviders(crossableChains)
    const nxtpSDK = await nxtp.setup(signer, chainProviders)

    const submitProcess = status.process.find((p: Process) => p.id === 'submitProcess')

    if (quoteProcess.quote && submitProcess?.txHash) {
      const activeTransactions = await nxtpSDK.getActiveTransactions()
      const relevantTx = activeTransactions.find(
        (tx) => tx.crosschainTx.invariant.transactionId === quoteProcess.quote.bid.transactionId,
      )
      if (relevantTx && relevantTx.status === NxtpSdkEvents.ReceiverTransactionPrepared) {
        ;(relevantTx as any).txData = {
          ...relevantTx.crosschainTx.invariant,
          ...(relevantTx.crosschainTx.receiving ?? relevantTx.crosschainTx.sending),
        }
        if (!this.shouldContinue) {
          nxtpSDK.removeAllListeners()
          return status
        }
        nxtp.attachListeners(
          signer,
          nxtpSDK,
          step,
          quoteProcess.quote.bid.transactionId,
          update,
          status,
        )
        await nxtp.finishTransfer(signer, nxtpSDK, relevantTx as any, step, update)
        setStatusDone(update, status, status.process[status.process.length - 1])
        status.status = 'DONE'
        update(status)
        nxtpSDK.removeAllListeners()
        return status
      }
    }

    // get Quote
    // -> set status
    if (!this.shouldContinue) {
      nxtpSDK.removeAllListeners()
      return status
    }
    quoteProcess.message = 'Confirm Quote'
    update(status)
    let quote: AuctionResponse | undefined
    try {
      if (quoteProcess.quote) {
        quote = quoteProcess.quote
      } else {
        await nxtpSDK.getActiveTransactions()
        quote = await nxtp.getTransferQuote(
          nxtpSDK,
          fromChainId,
          srcTokenAddress,
          toChainId,
          destTokenAddress,
          fromAmount.toString(),
          userAddress,
        )
        if (!quote) {
          throw new Error('No quote found! Please restart the swap.')
        }
        quoteProcess.quote = quote
        update(status)
      }
    } catch (_e) {
      const e = _e as Error
      quoteProcess.errorMessage = e.message
      setStatusFailed(update, status, quoteProcess)
      nxtpSDK.removeAllListeners()
      throw e
    }
    if (!quote) {
      const e = new Error('No quote found! Please restart the swap.')
      quoteProcess.errorMessage = e.message
      setStatusFailed(update, status, quoteProcess)
      nxtpSDK.removeAllListeners()
      throw e
    }
    setStatusDone(update, status, quoteProcess)

    const estimate: Estimate = {
      fromAmount: quote.bid.amount,
      toAmount: quote.bid.amountReceived,
      toAmountMin: '', // TODO needs to be calculated?
      approvalAddress: '', // TODO needs to be fetched (see related backend PR)
      feeCosts: [
        {
          name: 'NXTP Transfer Fees', // TODO what do we want here?
          percentage: '0.0005',
          token: action.fromToken,
          amount: new BigNumber(action.fromAmount).times('0.0005').toString(),
        },
      ],
      data: quote,
    }
    step.estimate = estimate

    // trigger transfer
    if (!this.shouldContinue) {
      nxtpSDK.removeAllListeners()
      return status
    }

    try {
      const submitProcess = status.process.find((p: Process) => p.id === 'submitProcess')
      if (submitProcess?.txHash) {
        nxtp.attachListeners(signer, nxtpSDK, step, quote.bid.transactionId, update, status)
      } else {
        await nxtpSDK.getActiveTransactions()
        await nxtp.triggerTransfer(signer, nxtpSDK, step, update, true, status)
        nxtp.attachListeners(signer, nxtpSDK, step, quote.bid.transactionId, update, status)
      }
    } catch (e) {
      nxtpSDK.removeAllListeners()
      throw e
    }

    status = await this.finishTransfer(signer, nxtpSDK, step, update, status)

    // Fallback
    // setStatusDone(update, status, status.process[status.process.length - 1])
    // status.status = 'DONE'
    update(status)
    nxtpSDK.removeAllListeners()
    return status
  }
}
