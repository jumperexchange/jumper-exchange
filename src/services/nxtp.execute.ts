import { ActiveTransaction, NxtpSdk, NxtpSdkEvents } from '@connext/nxtp-sdk';
import { AuctionResponse } from '@connext/nxtp-utils';
import { JsonRpcSigner } from '@ethersproject/providers';
import BigNumber from 'bignumber.js';
import { getRpcProviders } from '../components/web3/connectors';
import { CrossAction, CrossEstimate, Execution, Process, TransferStep } from '../types';
import notifications, { NotificationType } from './notifications';
import * as nxtp from './nxtp';
import { createAndPushProcess, initStatus, setStatusDone, setStatusFailed } from './status';

export const executeNXTPCross = async (signer: JsonRpcSigner, step: TransferStep, fromAmount: BigNumber, userAddress: string, updateStatus?: Function, initialStatus?: Execution) => {
  // setup
  let { status, update } = initStatus(updateStatus, initialStatus)
  const crossAction = step.action as CrossAction
  const fromChainId = crossAction.chainId
  const toChainId = crossAction.toChainId
  const srcTokenAddress = crossAction.token.id
  const destTokenAddress = crossAction.toToken.id

  // sdk
  // -> set status
  const quoteProcess = createAndPushProcess('quoteProcess', update, status, 'Setup NXTP')
  // -> init sdk
  const crossableChains = [crossAction.chainId, crossAction.toChainId]
  const chainProviders = getRpcProviders(crossableChains)
  const nxtpSDK = await nxtp.setup(signer, chainProviders)


  if(quoteProcess.quote){
    console.log("quote found!")

    const submitProcess = initialStatus?.process.find( p => p.id === 'submitProcess')
    console.log(submitProcess)
    const activeTransactions:ActiveTransaction[] = await nxtpSDK.getActiveTransactions()
    console.log(activeTransactions)
    const relevantTx = activeTransactions.find(tx => tx.crosschainTx.invariant.transactionId === quoteProcess.quote.bid.transactionId)

    if(relevantTx && submitProcess && submitProcess.status === 'PENDING'){
      setStatusDone(update, status, quoteProcess)
      const waitProcess = createAndPushProcess('waitProcess', update, status, 'Waiting for Transaction')
      console.log("waiting for final transaction")
      return await finishTransfer(nxtpSDK, step, update, status)
    }
  }


  // get Quote
  // -> set status
  quoteProcess.message = 'Confirm Quote'
  update(status)

  let quote: AuctionResponse | undefined;
  try {
    if(quoteProcess.quote){
      // Qoute already exists -> if if active transaction with this qoute
      quote = quoteProcess.quote
        //TODO: check if active Transaction with ReceiverTransactionPrepared status with nxtp.getActiveTransactions()

    } else {
      quote = await nxtp.getTransferQuote(nxtpSDK, fromChainId, srcTokenAddress, toChainId, destTokenAddress, fromAmount.toString(), userAddress)
      if (!quote) throw Error("Quote confirmation failed!")
      quoteProcess.quote = quote
      update(status)
    }
  } catch (_e) {
    const e = _e as Error
    quoteProcess.errorMessage = e.message
    cleanUp(nxtpSDK, update, status, quoteProcess)
    throw e
  }
  if(!quote) throw Error("No quote found! Please restart the swap.")
  setStatusDone(update, status, quoteProcess)

  const crossEstimate: CrossEstimate = {
    type: 'cross',
    fromAmount: quote.bid.amount,
    toAmount: quote.bid.amountReceived,
    fees: {
      included: true,
      percentage: '0.0005',
      token: crossAction.token,
      amount: new BigNumber(crossAction.amount).times('0.0005').toString(),
    },
    data: quote,
  }
  step.estimate = crossEstimate



  // trigger transfer
  try {
      await nxtp.triggerTransfer(nxtpSDK, step, update, true, status)

  } catch (e) {
    nxtpSDK.removeAllListeners()
    throw e
  }


  return await finishTransfer(nxtpSDK, step, update, status)
}

const cleanUp = (sdk: NxtpSdk, update: Function, status: any, process: Process) => {
  setStatusFailed(update, status, process)
  sdk.removeAllListeners()
}

const finishTransfer = (sdk: NxtpSdk, step:TransferStep, update: Function, status: Execution) => {
  return new Promise(async (resolve, reject) => {
    sdk.attach(NxtpSdkEvents.ReceiverTransactionPrepared, async (data) => {
      try {
        await nxtp.finishTransfer(sdk, data, step, update)
      } catch (e) {
        // nxtpSDK.removeAllListeners()
        notifications.showNotification(NotificationType.CROSS_ERROR)
        throw e
      }

      // nxtpSDK.removeAllListeners()
      // status.status = 'DONE'
      // update(status)
      notifications.showNotification(NotificationType.CROSS_SUCCESSFUL)
      resolve(status)
    })
  })
}
