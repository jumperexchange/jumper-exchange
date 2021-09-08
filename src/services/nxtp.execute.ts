
import { createAndPushProcess, initStatus, setStatusDone, setStatusFailed } from './status';

import * as nxtp from './nxtp'
import { CrossAction, Execution, Process, TranferStep } from '../types/server'
import { NxtpSdk, NxtpSdkEvents } from '@connext/nxtp-sdk';
import { getChainByKey } from '../types/lists';
import { AuctionResponse } from '@connext/nxtp-utils';



export const executeNXTPCross = async (nxtpSDK: NxtpSdk, step: TranferStep, fromAmount: string, userAddress:string,  updateStatus?: Function, initialStatus?: Execution) => {
  // setup
  let { status, update } = initStatus(updateStatus, initialStatus)
  const crossAction = step.action as CrossAction
  const fromChainId = getChainByKey(crossAction.chainKey).id
  const toChainId = getChainByKey(crossAction.toChainKey).id
  const srcTokenAddress = crossAction.fromToken.id
  const destTokenAddress = crossAction.toToken.id

  // get Quote
  // -> set status
  const quoteProcess = createAndPushProcess(update, status, 'Get Quote')
  let quote: AuctionResponse | undefined;
  try{
    quote = await nxtp.getTransferQuote(nxtpSDK, fromChainId, srcTokenAddress, toChainId, destTokenAddress, fromAmount, userAddress )
    if (!quote) throw Error("Quote confirmation failed!")
  } catch (e) {
    cleanUp(nxtpSDK, update, status, quoteProcess )
    throw e
  }
  setStatusDone(update, status, quoteProcess)

  // trigger transfer
  const triggerTransferProcess = createAndPushProcess(update, status, 'Trigger Transfer')
  try{
    status = await nxtp.triggerTransferWithPreexistingStatus(nxtpSDK, step, quote, update, status )
  } catch (e){
    cleanUp(nxtpSDK, update, status, triggerTransferProcess )
    throw e
  }

  let preparedTx
  try {
    console.log("waiting for tx")
    preparedTx = await nxtpSDK.waitFor(
      NxtpSdkEvents.ReceiverTransactionPrepared,
      100_000,
      (data) => data.txData.transactionId === quote?.bid.transactionId // filter function
    );
  } catch (e) {
    cleanUp(nxtpSDK, update, status, triggerTransferProcess )
    throw e
  }
  setStatusDone(update, status, triggerTransferProcess)


  // finish transfer
  const finishProcess = createAndPushProcess(update, status, 'Finish Transfer')
  try{
    await nxtp.finishTransfer(nxtpSDK, preparedTx, step, update)
  } catch (e) {
    cleanUp(nxtpSDK, update, status, finishProcess )
    throw e
  }
  setStatusDone(update, status, finishProcess)

  nxtpSDK.removeAllListeners()

  status.status = 'DONE'
  update(status)
  return status
}

const cleanUp = (sdk:NxtpSdk, update: Function, status:any, process: Process) => {
  setStatusFailed(update, status, process)
  sdk.removeAllListeners()
}



