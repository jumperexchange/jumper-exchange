import { NxtpSdk, NxtpSdkEvents } from '@connext/nxtp-sdk';
import { AuctionResponse, getRandomBytes32, TransactionPreparedEvent } from "@connext/nxtp-utils";
import { FallbackProvider } from '@ethersproject/providers';
import { Button } from 'antd';
import { constants, providers } from 'ethers';
import { CrossAction, CrossEstimate, Execution, getChainById, Process, TranferStep } from '../types';
import { readNxtpMessagingToken, storeNxtpMessagingToken } from './localStorage';
import { createAndPushProcess, initStatus, setStatusDone, setStatusFailed } from './status';
import { getApproved } from './utils';

// Add overwrites to specific chains here. They will only be applied if the chain is used.
const chainConfigOverwrites: {
  [chainId: number]: {
    transactionManagerAddress?: string;
    subgraph?: string;
    subgraphSyncBuffer?: number;
  }
} = {
  56: {
    subgraph: 'https://connext-bsc-subgraph.apps.bwarelabs.com/subgraphs/name/connext/nxtp-bsc',
    subgraphSyncBuffer: 150
  },
  250: {
    subgraph: "https://connext-fantom-subgraph.apps.bwarelabs.com/subgraphs/name/connext/nxtp-fantom"
  },
  42161: {
    subgraph: 'https://api.thegraph.com/subgraphs/name/connext/nxtp-arbitrum-one',
  }
}

export const setup = async (signer: providers.JsonRpcSigner, chainProviders: Record<number, providers.FallbackProvider>) => {
  const chainConfig: Record<number, { provider: providers.FallbackProvider; subgraph?: string; transactionManagerAddress?: string, subgraphSyncBuffer?: number; }> = {};
  Object.entries(chainProviders).forEach(([chainId, provider]) => {
    chainConfig[parseInt(chainId)] = {
      provider: provider,
      subgraph: chainConfigOverwrites[parseInt(chainId)]?.subgraph,
      transactionManagerAddress: chainConfigOverwrites[parseInt(chainId)]?.transactionManagerAddress,
      subgraphSyncBuffer: chainConfigOverwrites[parseInt(chainId)]?.subgraphSyncBuffer
    }
  })

  const sdk = new NxtpSdk(chainConfig, signer);

  // reuse existing messaging token
  const account = await signer.getAddress()
  try {
    const oldToken = readNxtpMessagingToken()
    if (oldToken?.token && oldToken.account === account) {
      try {
        await sdk.connectMessaging(oldToken.token)
      } catch (e) {
        console.error(e)
        const token = await sdk.connectMessaging()
        storeNxtpMessagingToken(token, account)
      }
    } else {
      const token = await sdk.connectMessaging()
      storeNxtpMessagingToken(token, account)
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
  callTo?: string,
  callData?: string,
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
    expiry: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 3), // 3 days
    callTo,
    callData,
  });
  return response;
}

export const triggerTransfer = async (sdk: NxtpSdk, step: TranferStep, updateStatus: Function, infinteApproval: boolean = false) => {

  // status
  const { status, update } = initStatus((status: Execution) => updateStatus(step, status))

  // transfer
  const approveProcess: Process = createAndPushProcess(update, status, 'Approve Token Transfer', { status: 'ACTION_REQUIRED' })
  let submitProcess: Process | undefined
  let receiverProcess: Process | undefined
  let proceedProcess: Process | undefined

  const crossAction = step.action as CrossAction
  const crossEstimate = step.estimate as CrossEstimate
  const fromChain = getChainById(crossAction.chainId)
  const toChain = getChainById(crossAction.toChainId)

  // Before approving/transferring, check router liquidity
  const liquidity = await (sdk as any).transactionManager.getRouterLiquidity(
    crossEstimate.data.bid.receivingChainId,
    crossEstimate.data.bid.router,
    crossEstimate.data.bid.receivingAssetId
  )
  if (liquidity.lt(crossEstimate.data.bid.amountReceived)) {
    approveProcess.errorMessage = `Router (${crossEstimate.data.bid.router}) has insufficient liquidity. Has ${liquidity.toString()}, needs ${crossEstimate.data.bid.amountReceived}.`
    setStatusFailed(update, status, approveProcess)
    return
  }

  // Check Token Approval
  if (crossEstimate.data.bid.sendingAssetId !== constants.AddressZero) {
    const contractAddress = (sdk as any).transactionManager.getTransactionManagerAddress(crossEstimate.data.bid.sendingChainId)
    const approved = await getApproved((sdk as any).signer, crossEstimate.data.bid.sendingAssetId, contractAddress)
    if (approved.gte(crossEstimate.data.bid.amount)) {
      // approval already done, jump to next step
      setStatusDone(update, status, approveProcess)
      // submitProcess = createAndPushProcess(update, status, 'Send Transaction', { status: 'ACTION_REQUIRED' })
    }
  }

  const transactionId = crossEstimate.data.bid.transactionId
  const transferPromise = sdk.prepareTransfer(crossEstimate.data, infinteApproval)

  // approve sent => wait
  sdk.attach(NxtpSdkEvents.SenderTokenApprovalSubmitted, (data) => {
    if (data.chainId !== fromChain.id || data.assetId !== crossAction.token.id) return
    approveProcess.status = 'PENDING'
    approveProcess.txHash = data.transactionResponse.hash
    approveProcess.txLink = fromChain.metamask.blockExplorerUrls[0] + 'tx/' + approveProcess.txHash
    approveProcess.message = <>Approve Token - Wait for <a href={approveProcess.txLink} target="_blank" rel="nofollow noreferrer">Tx</a></>
    update(status)
  })

  // approved = done => next
  sdk.attach(NxtpSdkEvents.SenderTokenApprovalMined, (data) => {
    if (data.chainId !== fromChain.id || data.assetId !== crossAction.token.id) return
    approveProcess.message = <>Token Approved (<a href={approveProcess.txLink} target="_blank" rel="nofollow noreferrer">Tx</a>)</>
    setStatusDone(update, status, approveProcess)
    submitProcess = createAndPushProcess(update, status, 'Send Transaction', { status: 'ACTION_REQUIRED' })
  })

  // sumbit sent => wait
  sdk.attach(NxtpSdkEvents.SenderTransactionPrepareSubmitted, (data) => {
    if (data.prepareParams.txData.transactionId !== transactionId) return
    if (approveProcess && approveProcess.status !== 'DONE') {
      setStatusDone(update, status, approveProcess)
    }
    if (!submitProcess) {
      submitProcess = createAndPushProcess(update, status, 'Send Transaction', { status: 'ACTION_REQUIRED' })
    }
    submitProcess.status = 'PENDING'
    submitProcess.txHash = data.transactionResponse.hash
    submitProcess.txLink = fromChain.metamask.blockExplorerUrls[0] + 'tx/' + submitProcess.txHash
    submitProcess.message = <>Send Transaction - Wait for <a href={submitProcess.txLink} target="_blank" rel="nofollow noreferrer">Tx</a></>
    update(status)
  })

  // sumitted = done => next
  sdk.attach(NxtpSdkEvents.SenderTransactionPrepared, (data) => {
    if (data.txData.transactionId !== transactionId) return
    if (submitProcess) {
      submitProcess.message = <>Transaction Sent (<a href={submitProcess.txLink} target="_blank" rel="nofollow noreferrer">Tx, 1 Confirmation</a>)</>
      setStatusDone(update, status, submitProcess)
    }
    receiverProcess = createAndPushProcess(update, status, 'Wait for Receiver', { type: 'wait' })
  })

  // ReceiverTransactionPrepared => sign
  sdk.attach(NxtpSdkEvents.ReceiverTransactionPrepared, (data) => {
    if (data.txData.transactionId !== transactionId) return

    // receiver done
    if (receiverProcess && receiverProcess.status !== 'DONE') {
      receiverProcess.txHash = data.transactionHash
      receiverProcess.txLink = toChain.metamask.blockExplorerUrls[0] + 'tx/' + receiverProcess.txHash
      receiverProcess.message = <>Receiver Prepared (<a href={receiverProcess.txLink} target="_blank" rel="nofollow noreferrer">Tx, 1 Confirmation</a>)</>
      setStatusDone(update, status, receiverProcess)

      // track confirmations
      trackConfirmations(sdk, data.txData.receivingChainId, data.transactionHash, 30, (count: number) => {
        if (receiverProcess) {
          receiverProcess.message = <>Receiver Prepared (<a href={receiverProcess.txLink} target="_blank" rel="nofollow noreferrer">Tx, {count}{count === 30 ? '+' : ''} Confirmations</a>)</>
          update(status)
        }
      })
    }

    // proceed to claim
    proceedProcess = createAndPushProcess(update, status, 'Ready to be Signed', { type: 'claim' })
    proceedProcess.status = 'ACTION_REQUIRED'
    proceedProcess.message = <Button className="xpollinate-button" shape="round" type="primary" size="large" onClick={() => finishTransfer(sdk, data, step, updateStatus)}>Sign to claim Transfer</Button>
    update(status)
  })

  // signed => wait
  sdk.attach(NxtpSdkEvents.ReceiverPrepareSigned, (data) => {
    if (data.transactionId !== transactionId) return
    if (proceedProcess) {
      proceedProcess.status = 'PENDING'
      proceedProcess.message = 'Signed - Wait for Claim'
      update(status)
    }
  })

  // fullfilled = done
  sdk.attach(NxtpSdkEvents.ReceiverTransactionFulfilled, (data) => {
    if (data.txData.transactionId !== transactionId) return
    if (proceedProcess && proceedProcess.status !== 'DONE') {
      status.status = 'DONE'
      proceedProcess.txHash = data.transactionHash
      proceedProcess.txLink = toChain.metamask.blockExplorerUrls[0] + 'tx/' + proceedProcess.txHash
      proceedProcess.message = <>Funds Claimed (<a href={proceedProcess.txLink} target="_blank" rel="nofollow noreferrer">Tx, 1 Confirmation</a>)</>
      setStatusDone(update, status, proceedProcess)

      // track confirmations
      trackConfirmations(sdk, data.txData.receivingChainId, data.transactionHash, 30, (count: number) => {
        if (proceedProcess) {
          proceedProcess.message = <>Funds Claimed (<a href={proceedProcess.txLink} target="_blank" rel="nofollow noreferrer">Tx, {count}{count === 30 ? '+' : ''} Confirmations</a>)</>
          update(status)
        }
      })
    }
  })
  // all done
  sdk.attach(NxtpSdkEvents.SenderTransactionFulfilled, (data) => {
    if (data.txData.transactionId !== transactionId) return
    if (proceedProcess && proceedProcess.status !== 'DONE') {
      status.status = 'DONE'
      proceedProcess.txHash = data.transactionHash
      proceedProcess.txLink = toChain.metamask.blockExplorerUrls[0] + 'tx/' + proceedProcess.txHash
      proceedProcess.message = <>Funds Claimed (<a href={proceedProcess.txLink} target="_blank" rel="nofollow noreferrer">Tx</a>)</>
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
    const result = await transferPromise
    trackConfirmationsForResponse(result.prepareResponse, 30, (count: number) => {
      submitProcess!.message = <>Transaction Sent (<a href={submitProcess!.txLink} target="_blank" rel="nofollow noreferrer">Tx, {count}{count === 30 ? '+' : ''} Confirmations</a>)</>
      update(status)
    })
  } catch (_e: unknown) {
    const e = _e as Error
    console.error(e)
    if (approveProcess && approveProcess.status !== 'DONE') {
      approveProcess.errorMessage = e.message
      setStatusFailed(update, status, approveProcess)
    }
    if (submitProcess && submitProcess.status !== 'DONE') {
      submitProcess.errorMessage = e.message
      setStatusFailed(update, status, submitProcess)
    }
    if (proceedProcess && proceedProcess.status !== 'DONE') {
      proceedProcess.errorMessage = e.message
      setStatusFailed(update, status, proceedProcess)
    }
  }

  return status
}

export const triggerTransferWithPreexistingStatus = async (sdk: NxtpSdk, step: TranferStep, quote: AuctionResponse, update: Function, status: any, infinteApproval: boolean = false) => {

  // transfer
  const approveProcess: Process = createAndPushProcess(update, status, 'Approve Token Transfer', { status: 'ACTION_REQUIRED' })
  let submitProcess: Process | undefined
  let proceedProcess: Process | undefined

  const crossAction = step.action as CrossAction
  const fromChain = getChainById(crossAction.chainId)
  const toChain = getChainById(crossAction.toChainId)

  // Before approving/transferring, check router liquidity
  const liquidity = await (sdk as any).transactionManager.getRouterLiquidity(
    quote.bid.receivingChainId,
    quote.bid.router,
    quote.bid.receivingAssetId
  );
  if (liquidity.lt(quote.bid.amountReceived)) {
    throw new Error(`Router (${quote.bid.router}) has insufficient liquidity. Has ${liquidity.toString()}, needs ${quote.bid.amountReceived}.`)
  }

  // Check Token Approval
  if (quote.bid.sendingAssetId !== constants.AddressZero) {
    const contractAddress = (sdk as any).transactionManager.getTransactionManagerAddress(quote.bid.sendingChainId)
    let approved
    try {
      approved = await getApproved((sdk as any).signer, quote.bid.sendingAssetId, contractAddress)
    } catch (_e) {
      const e = _e as Error
      approveProcess.errorMessage = e.message
      setStatusFailed(update, status, approveProcess)
      return status
    }

    if (approved.gte(quote.bid.amount)) {
      // approval already done, jump to next step
      setStatusDone(update, status, approveProcess)
      // submitProcess = createAndPushProcess(update, status, 'Send Transaction', { status: 'ACTION_REQUIRED' })
    }
  } else {
    // approval not needed
    setStatusDone(update, status, approveProcess)
    submitProcess = createAndPushProcess(update, status, 'Send Transaction', { status: 'ACTION_REQUIRED' })
  }

  const transactionId = quote.bid.transactionId
  const transferPromise = sdk.prepareTransfer(quote, infinteApproval)

  // approve sent => wait
  sdk.attachOnce(NxtpSdkEvents.SenderTokenApprovalSubmitted, (data) => {
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
    submitProcess.txLink = fromChain.metamask.blockExplorerUrls[0] + 'tx/' + submitProcess.txHash
    submitProcess.message = <>Send Transaction - Wait for <a href={submitProcess.txLink} target="_blank" rel="nofollow noreferrer">Tx</a></>
    update(status)

    // TODO: notify if tx fails, because no further events will happen
  })
  // sumitted = done => next
  sdk.attachOnce(NxtpSdkEvents.SenderTransactionPrepared, (data) => {
    if (submitProcess) {
      submitProcess.message = <>Transaction Sent (<a href={submitProcess.txLink} target="_blank" rel="nofollow noreferrer">Tx</a>)</>
      setStatusDone(update, status, submitProcess)
    }
    proceedProcess = createAndPushProcess(update, status, 'Wait to Proceed Transfer', { type: 'claim' })
  })

  // ReceiverTransactionPrepared => sign
  sdk.attach(NxtpSdkEvents.ReceiverTransactionPrepared, (data) => {
    if (data.txData.transactionId !== transactionId) return
    if (proceedProcess) {
      proceedProcess.status = 'ACTION_REQUIRED'
      proceedProcess.message = 'Ready to be Signed'
      update(status)
    }
  })

  // signed => wait
  sdk.attach(NxtpSdkEvents.ReceiverPrepareSigned, (data) => {
    if (data.transactionId !== transactionId) return
    if (proceedProcess) {
      proceedProcess.status = 'PENDING'
      proceedProcess.message = 'Signed - Wait for Claim'
      update(status)
    }
  })

  // fullfilled = done
  sdk.attach(NxtpSdkEvents.ReceiverTransactionFulfilled, (data) => {
    if (data.txData.transactionId !== transactionId) return
    if (proceedProcess) {
      status.status = 'DONE'
      proceedProcess.txHash = data.transactionHash
      proceedProcess.txLink = toChain.metamask.blockExplorerUrls[0] + 'tx/' + proceedProcess.txHash
      proceedProcess.message = <>Funds Claimed (<a href={proceedProcess.txLink} target="_blank" rel="nofollow noreferrer">Tx</a>)</>
      setStatusDone(update, status, proceedProcess, {
        fromAmount: data.txData.amount,
        toAmount: data.txData.amount,
        gasUsed: '0',
      })
    }
  })
  // all done
  sdk.attach(NxtpSdkEvents.SenderTransactionFulfilled, (data) => {
    if (data.txData.transactionId !== transactionId) return
    if (proceedProcess && proceedProcess.status !== 'DONE') {
      status.status = 'DONE'
      proceedProcess.txHash = data.transactionHash
      proceedProcess.txLink = toChain.metamask.blockExplorerUrls[0] + 'tx/' + proceedProcess.txHash
      proceedProcess.message = <>Funds Claimed (<a href={proceedProcess.txLink} target="_blank" rel="nofollow noreferrer">Tx</a>)</>
      setStatusDone(update, status, proceedProcess, {
        fromAmount: data.txData.amount,
        toAmount: data.txData.amount,
        gasUsed: '0',
      })
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
  } catch (_e: unknown) {
    const e = _e as Error
    console.error(e)
    if (approveProcess && approveProcess.status !== 'DONE') {
      approveProcess.errorMessage = e.message
      setStatusFailed(update, status, approveProcess)
    }
    if (submitProcess && submitProcess.status !== 'DONE') {
      submitProcess.errorMessage = e.message
      setStatusFailed(update, status, submitProcess)
    }
    if (proceedProcess && proceedProcess.status !== 'DONE') {
      proceedProcess.errorMessage = e.message
      setStatusFailed(update, status, proceedProcess)
    }
  }

  return status
}

const trackConfirmations = async (sdk: NxtpSdk, chainId: number, hash: string, confirmations: number, callback: Function) => {
  const receivingProvider: FallbackProvider = (sdk as any).chainConfig[chainId].provider
  const response = await receivingProvider.getTransaction(hash)
  trackConfirmationsForResponse(response, confirmations, callback)
}

const trackConfirmationsForResponse = async (response: providers.TransactionResponse, confirmations: number, callback: Function) => {
  for (let i = 2; i <= confirmations; i++) {
    await response.wait(i)
    callback(i)
  }
}

export const finishTransfer = async (sdk: NxtpSdk, event: TransactionPreparedEvent, step?: TranferStep, updateStatus?: Function) => {
  let status: Execution | undefined = undefined
  let lastProcess: Process | undefined = undefined

  if (step && step.execution && updateStatus) {
    status = step.execution
    lastProcess = status.process[status.process.length - 1]

    if (lastProcess.message === 'Sign Message to Claim Funds') {
      // already in signing process, do not trigger again
      return
    }

    lastProcess.status = 'ACTION_REQUIRED'
    lastProcess.message = 'Sign Message to Claim Funds'
    updateStatus(status)
  }

  try {
    await sdk.fulfillTransfer(event)
  } catch (e) {
    console.error(e)
    if (updateStatus && lastProcess && lastProcess.status !== 'DONE') {
      lastProcess.message = <Button className="xpollinate-button" shape="round" type="primary" size="large" onClick={() => finishTransfer(sdk, event, step, updateStatus)}>Sign to claim Transfer</Button>
      updateStatus(status)
    }
  }
}
