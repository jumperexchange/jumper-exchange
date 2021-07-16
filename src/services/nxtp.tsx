import { NxtpSdk, NxtpSdkEvents } from '@connext/nxtp-sdk'
import { getRandomBytes32 } from "@connext/nxtp-utils";
import { providers } from 'ethers';
import pino from 'pino';
import { getChainByKey } from '../types/lists'
import { CrossAction, Execution, Process, TranferStep } from '../types/server'
import { readNxtpMessagingToken, storeNxtpMessagingToken } from './localStorage'
import { createAndPushProcess, initStatus, setStatusDone, setStatusFailed } from './status'


export const setup = async (signer: providers.JsonRpcSigner) => {
  const chainProviders: { [chainId: number]: providers.JsonRpcProvider } = {
    4: new providers.JsonRpcProvider(process.env.REACT_APP_RPC_URL_RINKEBY),
    5: new providers.JsonRpcProvider(process.env.REACT_APP_RPC_URL_GORLI),
  }

  const sdk = await NxtpSdk.init(chainProviders, signer, pino({ level: "info" }));

  // reuse existing messaging token
  const oldToken = readNxtpMessagingToken()
  if (oldToken) {
    try {
      await sdk.connectMessaging(oldToken)
    } catch (e) {
      console.error(e)
    }
  }

  return sdk
}

export const triggerTransfer = async (sdk: NxtpSdk, receivingAddress: string, step: TranferStep, updateStatus: Function) => {

  // status
  const { status, update } = initStatus((status: Execution) => updateStatus(step, status))

  // login
  const loginProcess = createAndPushProcess(update, status, 'Login to Connext')
  try {
    const oldToken = readNxtpMessagingToken()
    if (oldToken) {
      try {
        await sdk.connectMessaging(oldToken)
      } catch {
        loginProcess.status = 'ACTION_REQUIRED'
        loginProcess.message = 'Login with Signed Message'
        update(status)
        const token = await sdk.connectMessaging()
        storeNxtpMessagingToken(token)
      }
    } else {
      loginProcess.status = 'ACTION_REQUIRED'
      loginProcess.message = 'Login with Signed Message'
      update(status)
      const token = await sdk.connectMessaging()
      storeNxtpMessagingToken(token)
    }
    loginProcess.message = 'Logged in to Connext'
    setStatusDone(update, status, loginProcess)
  } catch (e) {
    setStatusFailed(update, status, loginProcess)
    throw e
  }

  // transfer
  const approveProcess: Process = createAndPushProcess(update, status, 'Approve Token Transfer', { status: 'ACTION_REQUIRED' })
  let submitProcess: Process | undefined
  let proceedProcess: Process | undefined

  const crossAction = step.action as CrossAction
  const fromChain = getChainByKey(crossAction.chainKey)
  const toChain = getChainByKey(crossAction.toChainKey)

  const transactionId = step.id ?? getRandomBytes32()
  const expiry = (Math.floor(Date.now() / 1000) + 3600 * 24 * 3).toString() // 3 days
  const transferPromise = sdk.transfer({
    router: undefined,
    sendingAssetId: crossAction.fromToken.id,
    sendingChainId: fromChain.id,
    receivingChainId: toChain.id,
    receivingAssetId: crossAction.toToken.id,
    receivingAddress,
    amount: crossAction.amount.toString(),
    transactionId,
    expiry
    // callData?: string;
  })

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
    if (submitProcess) {
      submitProcess.status = 'PENDING'
      submitProcess.txHash = data.transactionResponse.hash
      submitProcess.txLink = fromChain.metamask.blockExplorerUrls[0] + 'tx/' + approveProcess.txHash
      submitProcess.message = <>Send Transaction - Wait for <a href={approveProcess.txLink} target="_blank" rel="nofollow noreferrer">Tx</a></>
      update(status)
    }
  })
  // sumitted = done => next
  sdk.attachOnce(NxtpSdkEvents.SenderTransactionPrepared, (data) => {
    if (submitProcess) {
      submitProcess.message = <>Transaction Sent (<a href={approveProcess.txLink} target="_blank" rel="nofollow noreferrer">Tx</a>)</>
      setStatusDone(update, status, submitProcess)
    }
    proceedProcess = createAndPushProcess(update, status, 'Wait to Proceed Transfer')
  })

  // ReceiverTransactionPrepared => sign
  sdk.attach(NxtpSdkEvents.ReceiverTransactionPrepared, (data) => {
    if (data.txData.transactionId !== transactionId) return
    if (proceedProcess) {
      proceedProcess.status = 'ACTION_REQUIRED'
      proceedProcess.message = 'Sign Message to Claim Funds'
      update(status)
    }
  })
  // fullfilled = done
  sdk.attach(NxtpSdkEvents.ReceiverTransactionFulfilled, (data) => {
    if (data.txData.transactionId !== transactionId) return
    if (proceedProcess) {
      proceedProcess.message = 'Funds Claimed'
      setStatusDone(update, status, proceedProcess)
    }
  })
  // all done
  sdk.attach(NxtpSdkEvents.SenderTransactionFulfilled, (data) => {
    if (data.txData.transactionId !== transactionId) return
    if (proceedProcess && proceedProcess.status !== 'DONE') {
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

  // all done?
  status.status = 'DONE'
  if (approveProcess && approveProcess.status !== 'DONE') {
    setStatusDone(update, status, approveProcess)
  }
  if (submitProcess && submitProcess.status !== 'DONE') {
    setStatusDone(update, status, submitProcess)
  }
  if (proceedProcess && proceedProcess.status !== 'DONE') {
    setStatusDone(update, status, proceedProcess)
  }
  update(status)
  return status
}
