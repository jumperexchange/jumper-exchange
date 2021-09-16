import { NxtpSdk, NxtpSdkEvents } from '@connext/nxtp-sdk';
import { AuctionResponse } from '@connext/nxtp-utils';
import { JsonRpcSigner } from '@ethersproject/providers';
import BigNumber from 'bignumber.js';
import { getRpcProviders } from '../components/web3/connectors';
import { CrossAction, Execution, Process, TranferStep } from '../types';
import * as nxtp from './nxtp';
import { createAndPushProcess, initStatus, setStatusDone, setStatusFailed } from './status';

export const executeNXTPCross = async (signer: JsonRpcSigner, step: TranferStep, fromAmount: BigNumber, userAddress: string, updateStatus?: Function, initialStatus?: Execution) => {
  // setup
  let { status, update } = initStatus(updateStatus, initialStatus)
  const crossAction = step.action as CrossAction
  const fromChainId = crossAction.chainId
  const toChainId = crossAction.toChainId
  const srcTokenAddress = crossAction.token.id
  const destTokenAddress = crossAction.toToken.id

  // sdk
  const crossableChains = [crossAction.chainId, crossAction.toChainId]
  const chainProviders = getRpcProviders(crossableChains)
  const nxtpSDK = await nxtp.setup(signer, chainProviders)

  // get Quote
  // -> set status
  const quoteProcess = createAndPushProcess(update, status, 'Confirm Quote')
  let quote: AuctionResponse | undefined;
  try {
    quote = await nxtp.getTransferQuote(nxtpSDK, fromChainId, srcTokenAddress, toChainId, destTokenAddress, fromAmount.toString(), userAddress)
    if (!quote) throw Error("Quote confirmation failed!")
  } catch (_e) {
    const e = _e as Error
    quoteProcess.errorMessage = e.message
    cleanUp(nxtpSDK, update, status, quoteProcess)
    throw e
  }
  setStatusDone(update, status, quoteProcess)

  // trigger transfer
  try {
    status = await nxtp.triggerTransferWithPreexistingStatus(nxtpSDK, step, quote, update, status)
  } catch (e) {
    console.log(status)
    nxtpSDK.removeAllListeners()
    throw e
  }

  return new Promise(async (resolve, reject) => {
    nxtpSDK.attach(NxtpSdkEvents.ReceiverTransactionPrepared, async (data) => {
      try {
        await nxtp.finishTransfer(nxtpSDK, data, step, update)
      } catch (e) {
        nxtpSDK.removeAllListeners()
        throw e
      }

      nxtpSDK.removeAllListeners()
      status.status = 'DONE'
      update(status)
      resolve(status)
    })
  })

  // nxtpSDK.detach()
}

const cleanUp = (sdk: NxtpSdk, update: Function, status: any, process: Process) => {
  setStatusFailed(update, status, process)
  sdk.removeAllListeners()
}



