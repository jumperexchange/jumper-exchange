import { NxtpSdk, NxtpSdkEvents } from '@connext/nxtp-sdk';
import { AuctionResponse, getRandomBytes32, TransactionPreparedEvent } from "@connext/nxtp-utils";
import { providers } from 'ethers';
import pino from 'pino';
import { getChainByKey } from '../types/lists';
import { CrossAction, CrossEstimate, Execution, Process, TranferStep } from '../types/server';
import { readNxtpMessagingToken, storeNxtpMessagingToken } from './localStorage';
import { createAndPushProcess, initStatus, setStatusDone, setStatusFailed } from './status';


export const setup = async (signer: providers.JsonRpcSigner) => {
  const chainConfig: Record<number, { provider: string[]; subgraph?: string; transactionManagerAddress?: string }> = {
    4: {
      provider: [process.env.REACT_APP_RPC_URL_RINKEBY!],
    },
    5: {
      provider: [process.env.REACT_APP_RPC_URL_GORLI!],
    },
  }

  const chainProviders: Record<number, { provider: providers.FallbackProvider; subgraph?: string; transactionManagerAddress?: string }> = {};
  Object.entries(chainConfig).forEach(([chainId, { provider, subgraph, transactionManagerAddress }]) => {
    chainProviders[parseInt(chainId)] = {
      provider: new providers.FallbackProvider(provider.map((p) => new providers.JsonRpcProvider(p, parseInt(chainId)))),
      subgraph,
      transactionManagerAddress,
    }
  })

  const sdk = new NxtpSdk(chainProviders, signer, pino({ level: "info" }));

  // reuse existing messaging token
  try {
    const oldToken = readNxtpMessagingToken()
    if (oldToken) {
      try {
        await sdk.connectMessaging(oldToken)
      } catch (e) {
        console.error(e)
        const token = await sdk.connectMessaging()
        storeNxtpMessagingToken(token)
      }
    } else {
      const token = await sdk.connectMessaging()
      storeNxtpMessagingToken(token)
    }
  } catch (e) {
    console.error(e)
  }

  return sdk
}

export const getTransferQuote = async (
  sdk: NxtpSdk,
  sendingChainId: number,
  sendingAssetId: string,
  receivingChainId: number,
  receivingAssetId: string,
  amount: string,
  receivingAddress: string,
): Promise<AuctionResponse | undefined> => {
  // Create txid
  const transactionId = getRandomBytes32();

  const response = await sdk.getTransferQuote({
    sendingAssetId,
    sendingChainId,
    receivingChainId,
    receivingAssetId,
    receivingAddress,
    amount,
    transactionId,
    expiry: Math.floor(Date.now() / 1000) + 3600 * 24 * 3, // 3 days
  });
  return response;
}

export const triggerTransfer = async (sdk: NxtpSdk, step: TranferStep, updateStatus: Function, infinteApproval: boolean = false) => {

  // status
  const { status, update } = initStatus((status: Execution) => updateStatus(step, status))

  // login
  // const loginProcess = createAndPushProcess(update, status, 'Login to Connext')
  // try {
  //   if (!(sdk as any).messaging.isConnected()) {
  //     const oldToken = readNxtpMessagingToken()
  //     if (oldToken) {
  //       try {
  //         await sdk.connectMessaging(oldToken!)
  //       } catch {
  //         loginProcess.status = 'ACTION_REQUIRED'
  //         loginProcess.message = 'Login with Signed Message'
  //         update(status)
  //         const token = await sdk.connectMessaging()
  //         storeNxtpMessagingToken(token)
  //       }
  //     } else {
  //       loginProcess.status = 'ACTION_REQUIRED'
  //       loginProcess.message = 'Login with Signed Message'
  //       update(status)
  //       const token = await sdk.connectMessaging()
  //       storeNxtpMessagingToken(token)
  //     }
  //     loginProcess.message = 'Logged in to Connext'
  //   }
  //   setStatusDone(update, status, loginProcess)
  // } catch (e) {
  //   setStatusFailed(update, status, loginProcess)
  //   throw e
  // }

  // transfer
  const approveProcess: Process = createAndPushProcess(update, status, 'Approve Token Transfer', { status: 'ACTION_REQUIRED' })
  let submitProcess: Process | undefined
  let proceedProcess: Process | undefined

  const crossAction = step.action as CrossAction
  const crossEstimate = step.estimate as CrossEstimate
  const fromChain = getChainByKey(crossAction.chainKey)
  // const toChain = getChainByKey(crossAction.toChainKey)

  const transactionId = crossEstimate.quote.bid.transactionId
  const transferPromise = sdk.startTransfer(crossEstimate.quote, infinteApproval)

  // approve sent => wait
  sdk.attachOnce(NxtpSdkEvents.SenderTransactionPrepareTokenApproval, (data) => {
    approveProcess.status = 'PENDING'
    approveProcess.txHash = data.transactionResponse.hash
    approveProcess.txLink = fromChain.metamask.blockExplorerUrls[0] + 'tx/' + approveProcess.txHash
    approveProcess.message = <>Approve Token - Wait for <a href={approveProcess.txLink} target="_blank" rel="nofollow noreferrer">Tx</a></>
    update(status)
  })

  // approved = done => next
  sdk.attachOnce(NxtpSdkEvents.SenderTokenApprovalMined, (data) => {
    approveProcess.message = <>Token Approved (<a href={approveProcess.txLink} target="_blank" rel="nofollow noreferrer">Tx</a>)</>
    setStatusDone(update, status, approveProcess)
    submitProcess = createAndPushProcess(update, status, 'Send Transaction', { status: 'ACTION_REQUIRED' })
  })

  // sumbit sent => wait
  sdk.attachOnce(NxtpSdkEvents.SenderTransactionPrepareSubmitted, (data) => {
    if (approveProcess && approveProcess.status !== 'DONE') {
      setStatusDone(update, status, approveProcess)
    }
    if (!submitProcess) {
      submitProcess = createAndPushProcess(update, status, 'Send Transaction', { status: 'ACTION_REQUIRED' })
    }
    submitProcess.status = 'PENDING'
    submitProcess.txHash = data.transactionResponse.hash
    submitProcess.txLink = fromChain.metamask.blockExplorerUrls[0] + 'tx/' + approveProcess.txHash
    submitProcess.message = <>Send Transaction - Wait for <a href={approveProcess.txLink} target="_blank" rel="nofollow noreferrer">Tx</a></>
    update(status)
  })
  // sumitted = done => next
  sdk.attachOnce(NxtpSdkEvents.SenderTransactionPrepared, (data) => {
    if (submitProcess) {
      submitProcess.message = <>Transaction Sent (<a href={approveProcess.txLink} target="_blank" rel="nofollow noreferrer">Tx</a>)</>
      setStatusDone(update, status, submitProcess)
    }
    proceedProcess = createAndPushProcess(update, status, 'Wait to Proceed Transfer', { type: 'claim' })
  })

  // ReceiverTransactionPrepared => sign
  sdk.attach(NxtpSdkEvents.ReceiverTransactionPrepared, (data) => {
    if (data.txData.transactionId !== transactionId) return
    if (proceedProcess) {
      proceedProcess.status = 'ACTION_REQUIRED'
      proceedProcess.message = 'Ready to be signed'
      update(status)
    }
  })
  // fullfilled = done
  sdk.attach(NxtpSdkEvents.ReceiverTransactionFulfilled, (data) => {
    if (data.txData.transactionId !== transactionId) return
    if (proceedProcess) {
      status.status = 'DONE'
      proceedProcess.message = 'Funds Claimed'
      setStatusDone(update, status, proceedProcess)
    }
  })
  // all done
  sdk.attach(NxtpSdkEvents.SenderTransactionFulfilled, (data) => {
    if (data.txData.transactionId !== transactionId) return
    if (proceedProcess && proceedProcess.status !== 'DONE') {
      status.status = 'DONE'
      proceedProcess.message = 'Funds Claimed'
      setStatusDone(update, status, proceedProcess)
    }
  })

  // failed?
  // sdk.attach(NxtpSdkEvents.SenderTransactionCancelled, (data) => {
  //   if (data.txData.transactionId !== transactionId) return
  //   console.log('SenderTransactionCancelled', data)
  // })
  // sdk.attach(NxtpSdkEvents.ReceiverTransactionCancelled, (data) => {
  //   if (data.txData.transactionId !== transactionId) return
  //   console.log('ReceiverTransactionCancelled', data)
  // })

  try {
    await transferPromise
  } catch (e) {
    if (approveProcess && approveProcess.status !== 'DONE') {
      setStatusFailed(update, status, approveProcess)
    }
    if (submitProcess && submitProcess.status !== 'DONE') {
      setStatusFailed(update, status, submitProcess)
    }
    if (proceedProcess && proceedProcess.status !== 'DONE') {
      setStatusFailed(update, status, proceedProcess)
    }
    throw e
  }

  return status
}

export const finishTransfer = async (sdk: NxtpSdk, event: TransactionPreparedEvent, step?: TranferStep, updateStatus?: Function) => {
  let status : Execution | undefined = undefined
  let lastProcess : Process | undefined = undefined

  if (step && step.execution && updateStatus) {
    status = step.execution
    lastProcess = status.process[status.process.length - 1]
    console.log('lastProcess', lastProcess)

    lastProcess.status = 'ACTION_REQUIRED'
    lastProcess.message = 'Sign Message to Claim Funds'
    updateStatus(status)
  }

  try {
    await sdk.finishTransfer(event)

    await sdk.waitFor(
      NxtpSdkEvents.ReceiverTransactionFulfilled,
      100_000,
      (data) => data.txData.transactionId === event.txData.transactionId,
    )
  } catch (e) {
    console.error(e)
    if (lastProcess && updateStatus) {
      lastProcess.message = 'Ready to be signed'
      updateStatus(status)
    }
  }
}
