import ERC20 from "@connext/nxtp-contracts/artifacts/contracts/interfaces/IERC20Minimal.sol/IERC20Minimal.json";
import { IERC20Minimal } from "@connext/nxtp-contracts/typechain";
import { NxtpSdk, NxtpSdkEvents } from '@connext/nxtp-sdk';
import { AuctionResponse, getRandomBytes32, TransactionPreparedEvent } from "@connext/nxtp-utils";
import { BigNumber, constants, Contract, providers } from 'ethers';
import { getChainByKey } from '../types/lists';
import { CrossAction, CrossEstimate, Execution, Process, TranferStep } from '../types/server';
import { readNxtpMessagingToken, storeNxtpMessagingToken } from './localStorage';
import { createAndPushProcess, initStatus, setStatusDone, setStatusFailed } from './status';

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

const getApproved = async (signer: providers.JsonRpcSigner, tokenAddress: string, contractAddress: string) => {
  const signerAddress = await signer.getAddress()
  const erc20 = new Contract(tokenAddress, ERC20.abi, signer) as IERC20Minimal

  const approved = await erc20.allowance(signerAddress, contractAddress) as BigNumber
  return approved
}

export const triggerTransfer = async (sdk: NxtpSdk, step: TranferStep, updateStatus: Function, infinteApproval: boolean = false) => {

  // status
  const { status, update } = initStatus((status: Execution) => updateStatus(step, status))

  // transfer
  const approveProcess: Process = createAndPushProcess(update, status, 'Approve Token Transfer', { status: 'ACTION_REQUIRED' })
  let submitProcess: Process | undefined
  let proceedProcess: Process | undefined

  const crossAction = step.action as CrossAction
  const crossEstimate = step.estimate as CrossEstimate
  const fromChain = getChainByKey(crossAction.chainKey)
  const toChain = getChainByKey(crossAction.toChainKey)

  // Before approving/transferring, check router liquidity
  const liquidity = await (sdk as any).transactionManager.getRouterLiquidity(
    crossEstimate.quote.bid.receivingChainId,
    crossEstimate.quote.bid.router,
    crossEstimate.quote.bid.receivingAssetId
  );
  if (liquidity.lt(crossEstimate.quote.bid.amountReceived)) {
    throw new Error(`Router (${crossEstimate.quote.bid.router}) has insufficient liquidity. Has ${liquidity.toString()}, needs ${crossEstimate.quote.bid.amountReceived}.`)
  }

  // Check Token Approval
  if (crossEstimate.quote.bid.sendingAssetId !== constants.AddressZero) {
    const contractAddress = (sdk as any).transactionManager.getTransactionManagerAddress(crossEstimate.quote.bid.sendingChainId)
    const approved = await getApproved((sdk as any).signer, crossEstimate.quote.bid.sendingAssetId, contractAddress)
    if (approved.gte(crossEstimate.quote.bid.amount)) {
      // approval already done, jump to next step
      setStatusDone(update, status, approveProcess)
      submitProcess = createAndPushProcess(update, status, 'Send Transaction', { status: 'ACTION_REQUIRED' })
    }
  }

  const transactionId = crossEstimate.quote.bid.transactionId
  const transferPromise = sdk.prepareTransfer(crossEstimate.quote, infinteApproval)

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
      setStatusDone(update, status, proceedProcess)
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
    if (lastProcess && updateStatus) {
      lastProcess.message = 'Ready to be signed'
      updateStatus(status)
    }
  }
}
