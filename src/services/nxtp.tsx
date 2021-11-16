/* eslint-disable no-console,max-params */
import {
  getDeployedTransactionManagerContract,
  GetTransferQuote,
  NxtpSdk,
  NxtpSdkEvents,
} from '@connext/nxtp-sdk'
import { getRandomBytes32, TransactionPreparedEvent } from '@connext/nxtp-utils'
import { FallbackProvider, JsonRpcSigner } from '@ethersproject/providers'
import { Button } from 'antd'
import { constants, providers } from 'ethers'

import { Execution, getChainById, Process, Step } from '../types'
import { createAndPushProcess, initStatus, setStatusDone, setStatusFailed } from './status'
import { getApproved } from './utils'

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
    transactionManagerAddress?: string
    subgraph?: string[]
    subgraphSyncBuffer?: number
  }
} = getChainConfigOverwrites()

const DEFAULT_TRANSACTIONS_TO_LOG = 10

export const setup = async (
  signer: providers.JsonRpcSigner,
  chainProviders: Record<number, providers.FallbackProvider>,
) => {
  const chainConfig: Record<
    number,
    {
      provider: providers.FallbackProvider
      subgraph?: string[]
      transactionManagerAddress?: string
      subgraphSyncBuffer?: number
    }
  > = {}
  Object.entries(chainProviders).forEach(([chainId, provider]) => {
    chainConfig[parseInt(chainId)] = {
      provider: provider,
      subgraph: chainConfigOverwrites[parseInt(chainId)]?.subgraph,
      transactionManagerAddress:
        chainConfigOverwrites[parseInt(chainId)]?.transactionManagerAddress,
      subgraphSyncBuffer: chainConfigOverwrites[parseInt(chainId)]?.subgraphSyncBuffer,
    }
  })

  const sdk = new NxtpSdk({ chainConfig, signer })
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
  preferredRouters?: string[],
): Promise<GetTransferQuote | undefined> => {
  // Create txid
  const transactionId = getRandomBytes32()

  const response = await sdk.getTransferQuote({
    sendingAssetId,
    sendingChainId,
    receivingChainId,
    receivingAssetId,
    receivingAddress,
    amount,
    transactionId,
    expiry: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 3, // 3 days
    callTo,
    callData,
    initiator,
    preferredRouters,
  })
  return response
}

export const triggerTransfer = async (
  signer: JsonRpcSigner,
  sdk: NxtpSdk,
  step: Step,
  updateStatus: Function,
  infinteApproval: boolean = false,
  initialStatus?: Execution,
) => {
  // status
  const { status, update } = initStatus(updateStatus, initialStatus)

  // transfer
  const approveProcess: Process = createAndPushProcess(
    'approveProcess',
    update,
    status,
    'Approve Token Transfer',
    { status: 'ACTION_REQUIRED' },
  )
  let submitProcess: Process | undefined
  let proceedProcess: Process | undefined

  const action = step.action
  const estimate = step.estimate
  const fromChain = getChainById(action.fromChainId)

  // Check Token Approval
  if (estimate.data.bid.sendingAssetId !== constants.AddressZero) {
    const contractAddress = getDeployedTransactionManagerContract(estimate.data.bid.sendingChainId)
    let approved
    try {
      approved = await getApproved(
        (sdk as any).config.signer,
        estimate.data.bid.sendingAssetId,
        contractAddress!.address,
      )
    } catch (_e) {
      const e = _e as Error
      if (e.message) approveProcess.errorMessage = e.message
      setStatusFailed(update, status, approveProcess)
      throw e
    }
    if (approved.gte(estimate.data.bid.amount)) {
      // approval already done, jump to next step
      setStatusDone(update, status, approveProcess)
      submitProcess = createAndPushProcess('submitProcess', update, status, 'Send Transaction', {
        status: 'ACTION_REQUIRED',
      })
    }
  } else {
    // approval not needed
    setStatusDone(update, status, approveProcess)
    submitProcess = createAndPushProcess('submitProcess', update, status, 'Send Transaction', {
      status: 'ACTION_REQUIRED',
    })
  }
  setStatusDone(update, status, approveProcess)
  submitProcess = createAndPushProcess('submitProcess', update, status, 'Send Transaction', {
    status: 'ACTION_REQUIRED',
    footerMessage: 'Open Wallet to Confirm Transaction',
  })

  const transactionId = estimate.data.bid.transactionId

  const transferPromise = sdk.prepareTransfer(estimate.data, infinteApproval)
  // approve sent => wait

  attachListeners(signer, sdk, step, transactionId, update, status)

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
    trackConfirmationsForResponse(
      sdk,
      fromChain.id,
      result.prepareResponse,
      DEFAULT_TRANSACTIONS_TO_LOG,
      (count: number) => {
        submitProcess!.message = 'Transaction Sent:'
        submitProcess!.confirmations = count
        update(status)
      },
    )
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

export const attachListeners = (
  signer: JsonRpcSigner,
  sdk: NxtpSdk,
  step: Step,
  transactionId: string,
  update: Function,
  status: Execution,
) => {
  const approveProcess: Process = createAndPushProcess(
    'approveProcess',
    update,
    status,
    'Approve Token Transfer',
    { status: 'ACTION_REQUIRED' },
  )
  let submitProcess: Process | undefined = status.process.find((p) => p.id === 'submitProcess')
  let receiverProcess: Process | undefined = status.process.find((p) => p.id === 'receiverProcess')
  let proceedProcess: Process | undefined = status.process.find((p) => p.id === 'proceedProcess')

  const action = step.action
  const fromChain = getChainById(action.fromChainId)
  const toChain = getChainById(action.toChainId)

  sdk.attach(NxtpSdkEvents.SenderTokenApprovalSubmitted, (data) => {
    if (data.chainId !== fromChain.id || data.assetId !== action.fromToken.id) return
    approveProcess.status = 'PENDING'
    approveProcess.txHash = data.transactionResponse.hash
    approveProcess.txLink = fromChain.metamask.blockExplorerUrls[0] + 'tx/' + approveProcess.txHash
    approveProcess.message = 'Approve Token - Wait for'
    update(status)
  })

  // approved = done => next
  sdk.attach(NxtpSdkEvents.SenderTokenApprovalMined, (data) => {
    if (data.chainId !== fromChain.id || data.assetId !== action.fromToken.id) return
    approveProcess.message = 'Token Approved:'
    setStatusDone(update, status, approveProcess)
    if (!submitProcess) {
      submitProcess = createAndPushProcess('submitProcess', update, status, 'Send Transaction', {
        status: 'ACTION_REQUIRED',
        footerMessage: 'Open Wallet to Confirm Transaction',
      })
    }
  })

  // sumbit sent => wait
  sdk.attach(NxtpSdkEvents.SenderTransactionPrepareSubmitted, (data) => {
    if (data.prepareParams.txData.transactionId !== transactionId) return
    if (approveProcess && approveProcess.status !== 'DONE') {
      setStatusDone(update, status, approveProcess)
    }
    if (!submitProcess) {
      submitProcess = createAndPushProcess('submitProcess', update, status, 'Send Transaction', {
        status: 'ACTION_REQUIRED',
      })
    }
    submitProcess.status = 'PENDING'
    submitProcess.txHash = data.transactionResponse.hash
    submitProcess.txLink = fromChain.metamask.blockExplorerUrls[0] + 'tx/' + submitProcess.txHash
    submitProcess.message = 'Send Transaction'
    submitProcess.footerMessage = 'Waiting for Confirmations...'
    update(status)
  })

  // sumitted = done => next
  sdk.attach(NxtpSdkEvents.SenderTransactionPrepared, (data) => {
    if (data.txData.transactionId !== transactionId) return
    if (submitProcess) {
      submitProcess.message = 'Transaction Sent:'
      setStatusDone(update, status, submitProcess)
    }
    receiverProcess = createAndPushProcess('receiverProcess', update, status, 'Wait for Receiver', {
      type: 'wait',
      footerMessage: 'Waiting for Receiver...',
    })
  })

  // ReceiverTransactionPrepared => sign
  sdk.attach(NxtpSdkEvents.ReceiverTransactionPrepared, (data) => {
    if (data.txData.transactionId !== transactionId) return

    // receiver done
    if (receiverProcess && receiverProcess.status !== 'DONE') {
      receiverProcess.txHash = data.transactionHash
      receiverProcess.txLink =
        toChain.metamask.blockExplorerUrls[0] + 'tx/' + receiverProcess.txHash
      receiverProcess.message = 'Receiver Prepared:'
      delete receiverProcess.footerMessage
      setStatusDone(update, status, receiverProcess)

      // track confirmations
      trackConfirmations(
        sdk,
        data.txData.receivingChainId,
        data.transactionHash,
        DEFAULT_TRANSACTIONS_TO_LOG,
        (count: number) => {
          if (receiverProcess) {
            receiverProcess.message = 'Receiver Prepared:'
            receiverProcess.confirmations = count
            update(status)
          }
        },
      )
    }

    // proceed to claim
    proceedProcess = createAndPushProcess('proceedProcess', update, status, 'Ready to be Signed', {
      type: 'claim',
    })
    proceedProcess.status = 'ACTION_REQUIRED'
    proceedProcess.message = 'Sign to Claim Transfer'
    proceedProcess.footerMessage = (
      <Button
        className="xpollinate-button"
        shape="round"
        type="primary"
        size="large"
        onClick={() => finishTransfer(signer, sdk, data, step, update)}>
        Sign to Claim Transfer
      </Button>
    )
    update(status)
  })

  // signed => wait
  sdk.attach(NxtpSdkEvents.ReceiverPrepareSigned, (data) => {
    if (data.transactionId !== transactionId) return
    if (!proceedProcess) {
      setStatusDone(update, status, status.process[status.process.length - 1])
      proceedProcess = createAndPushProcess(
        'proceedProcess',
        update,
        status,
        'Signed - Wait for Claim',
        { status: 'PENDING' },
      )
    } else if (proceedProcess) {
      proceedProcess.status = 'PENDING'
      proceedProcess.message = 'Signed - Waiting for Claim...'
      proceedProcess.footerMessage = 'Waiting for Confirmations...'
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
      proceedProcess.message = 'Funds Claimed:'
      status.toAmount = data.txData.amount
      setStatusDone(update, status, proceedProcess)

      // track confirmations
      trackConfirmations(
        sdk,
        data.txData.receivingChainId,
        data.transactionHash,
        DEFAULT_TRANSACTIONS_TO_LOG,
        (count: number) => {
          if (proceedProcess) {
            proceedProcess.message = 'Funds Claimed'
            proceedProcess.confirmations = count
            update(status)
          }
        },
      )
    }
  })
  // all done
  sdk.attach(NxtpSdkEvents.SenderTransactionFulfilled, (data) => {
    if (data.txData.transactionId !== transactionId) return
    if (proceedProcess && proceedProcess.status !== 'DONE') {
      status.status = 'DONE'
      proceedProcess.txHash = data.transactionHash
      proceedProcess.txLink = toChain.metamask.blockExplorerUrls[0] + 'tx/' + proceedProcess.txHash
      proceedProcess.message = 'Funds Claimed:'
      status.toAmount = data.txData.amount
      setStatusDone(update, status, proceedProcess)
    }
  })
}

const trackConfirmations = async (
  sdk: NxtpSdk,
  chainId: number,
  hash: string,
  confirmations: number,
  callback: Function,
) => {
  const receivingProvider: FallbackProvider = (sdk as any).config.chainConfig[chainId].provider
  const response = await receivingProvider.getTransaction(hash)
  trackConfirmationsForResponse(sdk, chainId, response, confirmations, callback)
}

const trackConfirmationsForResponse = async (
  sdk: NxtpSdk,
  chainId: number,
  response: providers.TransactionResponse,
  confirmations: number,
  callback: Function,
) => {
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

export const finishTransfer = async (
  signer: JsonRpcSigner,
  sdk: NxtpSdk,
  event: TransactionPreparedEvent,
  step?: Step,
  updateStatus?: Function,
) => {
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
  let receipt
  try {
    const { transactionHash } = await sdk.fulfillTransfer(event, true)
    receipt = await signer.provider.waitForTransaction(transactionHash)
  } catch (e) {
    console.error(e)
    if (updateStatus && lastProcess && lastProcess.status !== 'DONE') {
      lastProcess.message = 'Sign to Claim Transfer'
      lastProcess.footerMessage = (
        <Button
          className="xpollinate-button"
          shape="round"
          type="primary"
          size="large"
          onClick={() => finishTransfer(signer, sdk, event, step, updateStatus)}>
          Sign to Claim Transfer
        </Button>
      )
      updateStatus(status)
    }
  }
  return receipt
}
