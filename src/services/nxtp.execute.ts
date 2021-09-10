
import { createAndPushProcess, initStatus, setStatusDone, setStatusFailed } from './status';

import * as nxtp from './nxtp'
import { CrossAction, Execution, Process, TranferStep } from '../types/server'
import { NxtpSdk, NxtpSdkEvents } from '@connext/nxtp-sdk';
import { AuctionResponse } from '@connext/nxtp-utils';
import BigNumber from 'bignumber.js';



export const executeNXTPCross = async (nxtpSDK: NxtpSdk, step: TranferStep, fromAmount: BigNumber, userAddress:string,  updateStatus?: Function, initialStatus?: Execution) => {
    // setup
    let { status, update } = initStatus(updateStatus, initialStatus)
    const crossAction = step.action as CrossAction
    const fromChainId = crossAction.fromChainId
    const toChainId = crossAction.toChainId
    const srcTokenAddress = crossAction.fromToken.id
    const destTokenAddress = crossAction.toToken.id

    // get Quote
    // -> set status
    const quoteProcess = createAndPushProcess(update, status, 'Confirm Quote')
    let quote: AuctionResponse | undefined;
    try{
      quote = await nxtp.getTransferQuote(nxtpSDK, fromChainId, srcTokenAddress, toChainId, destTokenAddress, fromAmount.toString(), userAddress )
      if (!quote) throw Error("Quote confirmation failed!")
    } catch (_e) {
      const e = _e as Error
      quoteProcess.errorMessage = e.message
      cleanUp(nxtpSDK, update, status, quoteProcess )
      throw e
    }
    setStatusDone(update, status, quoteProcess)

    // trigger transfer
    try{
      status = await nxtp.triggerTransferWithPreexistingStatus(nxtpSDK, step, quote, update, status )
    } catch (e){
      console.log(status)
      nxtpSDK.removeAllListeners()
      throw e
    }

    return new Promise (async (resolve, reject) => {
    nxtpSDK.attach(NxtpSdkEvents.ReceiverTransactionPrepared, async (data) => {
      try{
        await nxtp.finishTransfer(nxtpSDK, data, step, update)
      } catch (e) {
        nxtpSDK.removeAllListeners()
        throw e
      }

      nxtpSDK.removeAllListeners()
      status.status = 'DONE'
      update(status)
      resolve (status)

    })
  })
}

const cleanUp = (sdk:NxtpSdk, update: Function, status:any, process: Process) => {
  setStatusFailed(update, status, process)
  sdk.removeAllListeners()
}



