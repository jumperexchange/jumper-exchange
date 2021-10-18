import { NxtpSdk, NxtpSdkEvents } from '@connext/nxtp-sdk';
import { AuctionResponse, getRandomBytes32, TransactionPreparedEvent } from "@connext/nxtp-utils";
import { FallbackProvider } from '@ethersproject/providers';
import { Badge, Button, Tooltip } from 'antd';
import { BigNumber, constants, providers } from 'ethers';
import { CrossAction, CrossEstimate, Execution, getChainById, Process, TransferStep } from '../types';
import { createAndPushProcess, initStatus, setStatusDone, setStatusFailed } from './status';
import { getApproved } from './utils';

// Add overwrites to specific chains here. They will only be applied if the chain is used.
const getChainConfigOverwrites = () => {
  try {
    return JSON.parse(process.env.REACT_APP_NXTP_OVERWRITES_JSON!)
  } catch (e) {
    console.error(e)
    return {}
  }
}
export const chainConfigOverwrites: {
  [chainId: number]: {
    transactionManagerAddress?: string;
    subgraph?: string;
    subgraphSyncBuffer?: number;
  }
} = getChainConfigOverwrites()

const DEFAULT_TRANSACTIONS_TO_LOG = 10

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

  const sdk = new NxtpSdk({ chainConfig, signer });
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
  initiator?: string,
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
    initiator,
  });
  return response;
}

export const triggerTransfer = async (sdk: NxtpSdk, step: TransferStep, updateStatus: Function, infinteApproval: boolean = false, initialStatus?: Execution) => {

  // status
  const { status, update } = initStatus(updateStatus, initialStatus)

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
  ) as BigNumber
  if (liquidity.lt(crossEstimate.data.bid.amountReceived)) {
    approveProcess.errorMessage = `Router (${crossEstimate.data.bid.router}) has insufficient liquidity. Has ${liquidity.toString()}, needs ${crossEstimate.data.bid.amountReceived}.`
    setStatusFailed(update, status, approveProcess)
    return
  }


  // Check Token Approval
  if (crossEstimate.data.bid.sendingAssetId !== constants.AddressZero) {
    const contractAddress = (sdk as any).transactionManager.getTransactionManagerAddress(crossEstimate.data.bid.sendingChainId)
    let approved
    try{
      approved = await getApproved((sdk as any).config.signer, crossEstimate.data.bid.sendingAssetId, contractAddress)
    } catch(_e) {
      const e = _e as Error
      if (e.message) approveProcess.errorMessage = e.message
      setStatusFailed(update, status, approveProcess)
      throw e
    }
    if (approved.gte(crossEstimate.data.bid.amount)) {
      // approval already done, jump to next step
      setStatusDone(update, status, approveProcess)
      submitProcess = createAndPushProcess(update, status, 'Send Transaction', { status: 'ACTION_REQUIRED' })
    }
  } else {
    // approval not needed
    setStatusDone(update, status, approveProcess)
    submitProcess = createAndPushProcess(update, status, 'Send Transaction', { status: 'ACTION_REQUIRED' })
  }

  const transactionId = crossEstimate.data.bid.transactionId
  // try{

  // }
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
    approveProcess.message = <>Token Approved: <a href={approveProcess.txLink} target="_blank" rel="nofollow noreferrer">Tx</a></>
    setStatusDone(update, status, approveProcess)
    if (!submitProcess) {
      submitProcess = createAndPushProcess(update, status, 'Send Transaction', { status: 'ACTION_REQUIRED' })
    }
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
      submitProcess.message = <>Transaction Sent: <a href={submitProcess.txLink} target="_blank" rel="nofollow noreferrer">Tx</a></>
      setStatusDone(update, status, submitProcess)
    }
    receiverProcess = createAndPushProcess(update, status, 'Wait for Receiver', { type: 'wait', footerMessage: 'Wait for Receiver (if this step takes longer than 5m, please refresh the page)' })
  })

  // ReceiverTransactionPrepared => sign
  sdk.attach(NxtpSdkEvents.ReceiverTransactionPrepared, (data) => {
    if (data.txData.transactionId !== transactionId) return

    // receiver done
    if (receiverProcess && receiverProcess.status !== 'DONE') {
      receiverProcess.txHash = data.transactionHash
      receiverProcess.txLink = toChain.metamask.blockExplorerUrls[0] + 'tx/' + receiverProcess.txHash
      receiverProcess.message = <>Receiver Prepared: <a href={receiverProcess.txLink} target="_blank" rel="nofollow noreferrer">Tx</a></>
      delete receiverProcess.footerMessage
      setStatusDone(update, status, receiverProcess)

      // track confirmations
      trackConfirmations(sdk, data.txData.receivingChainId, data.transactionHash, DEFAULT_TRANSACTIONS_TO_LOG, (count: number) => {
        if (receiverProcess) {
          receiverProcess.message = <>Receiver Prepared: <a href={receiverProcess.txLink} target="_blank" rel="nofollow noreferrer">Tx {renderConfirmations(count, DEFAULT_TRANSACTIONS_TO_LOG)}</a></>
          update(status)
        }
      })
    }

    // proceed to claim
    proceedProcess = createAndPushProcess(update, status, 'Ready to be Signed', { type: 'claim' })
    proceedProcess.status = 'ACTION_REQUIRED'
    proceedProcess.message = 'Sign to claim Transfer'
    proceedProcess.footerMessage = <Button className="xpollinate-button" shape="round" type="primary" size="large" onClick={() => finishTransfer(sdk, data, step, updateStatus)}>Sign to claim Transfer</Button>
    update(status)
  })

  // signed => wait
  sdk.attach(NxtpSdkEvents.ReceiverPrepareSigned, (data) => {
    if (data.transactionId !== transactionId) return
    if (proceedProcess) {
      proceedProcess.status = 'PENDING'
      proceedProcess.message = 'Signed - Wait for Claim'
      delete proceedProcess.footerMessage
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
      proceedProcess.message = <>Funds Claimed: <a href={proceedProcess.txLink} target="_blank" rel="nofollow noreferrer">Tx</a></>
      status.toAmount = data.txData.amount
      setStatusDone(update, status, proceedProcess)

      // track confirmations
      trackConfirmations(sdk, data.txData.receivingChainId, data.transactionHash, DEFAULT_TRANSACTIONS_TO_LOG, (count: number) => {
        if (proceedProcess) {
          proceedProcess.message = <>Funds Claimed: <a href={proceedProcess.txLink} target="_blank" rel="nofollow noreferrer">Tx {renderConfirmations(count, DEFAULT_TRANSACTIONS_TO_LOG)}</a></>
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
      proceedProcess.message = <>Funds Claimed: <a href={proceedProcess.txLink} target="_blank" rel="nofollow noreferrer">Tx</a></>
      status.toAmount = data.txData.amount
      setStatusDone(update, status, proceedProcess)
    }
  })

  // failed?
  sdk.attach(NxtpSdkEvents.SenderTransactionCancelled, (data) => {
    if (data.txData.transactionId !== transactionId) return
    console.warn('SenderTransactionCancelled', data)
  })
  sdk.attach(NxtpSdkEvents.ReceiverTransactionCancelled, (data) => {
    if (data.txData.transactionId !== transactionId) return
    console.warn('ReceiverTransactionCancelled', data)
  })

  try {
    const result = await transferPromise
    trackConfirmationsForResponse(sdk, fromChain.id, result.prepareResponse, DEFAULT_TRANSACTIONS_TO_LOG, (count: number) => {
      submitProcess!.message = <>Transaction Sent: <a href={submitProcess!.txLink} target="_blank" rel="nofollow noreferrer">Tx {renderConfirmations(count, DEFAULT_TRANSACTIONS_TO_LOG)}</a></>
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
    throw e
  }

  return status
}

const renderConfirmations = (count: number, max: number) => {
  const text = count < max ? `${count}/${max}` : `${max}+`
  return (
    <Tooltip title={text + ' Confirmations'}>
      <Badge
        count={text}
        style={{ backgroundColor: '#52c41a', marginBottom: '2px'}}
      />
    </Tooltip>
  )
}

const trackConfirmations = async (sdk: NxtpSdk, chainId: number, hash: string, confirmations: number, callback: Function) => {
  const receivingProvider: FallbackProvider = (sdk as any).config.chainConfig[chainId].provider
  const response = await receivingProvider.getTransaction(hash)
  trackConfirmationsForResponse(sdk, chainId, response, confirmations, callback)
}

const trackConfirmationsForResponse = async (sdk: NxtpSdk, chainId: number, response: providers.TransactionResponse, confirmations: number, callback: Function) => {
  try {
    for (let i = 2; i <= confirmations; i++) {
      await response.wait(i)
      callback(i)
    }
  } catch (e: any) {
    if (e && e.code === 'TRANSACTION_REPLACED' && e.replacement && e.replacement.hash) {
      trackConfirmations(sdk, chainId, e.replacement.hash, confirmations, callback)
    } else {
      console.error(e)
    }
  }
}

export const finishTransfer = async (sdk: NxtpSdk, event: TransactionPreparedEvent, step?: TransferStep, updateStatus?: Function) => {
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
      lastProcess.message = 'Sign to claim Transfer'
      lastProcess.footerMessage = <Button className="xpollinate-button" shape="round" type="primary" size="large" onClick={() => finishTransfer(sdk, event, step, updateStatus)}>Sign to claim Transfer</Button>
      updateStatus(status)
    }
  }
}
