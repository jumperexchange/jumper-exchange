import { NxtpSdk, NxtpSdkEvents } from '@connext/nxtp-sdk'
import { encodeAuctionBid } from '@connext/nxtp-sdk/dist/utils'
import { AuctionResponse, getRandomBytes32 } from '@connext/nxtp-utils'
import { JsonRpcSigner } from '@ethersproject/providers'
import BigNumber from 'bignumber.js'
import { constants, ethers } from 'ethers'
import { getRpcProviders } from '../components/web3/connectors'
import { ChainId, CrossAction, CrossEstimate, CrossStep, Execution, getChainById, SwapAction, SwapEstimate, SwapStep, TransferStep } from '../types'
import { oneInch } from './1Inch'
import { abi } from './ABI/NXTPFacet.json'
import { checkAllowance } from './allowance.execute'
import * as nxtp from './nxtp'
import { paraswap } from './paraswap'
import { createAndPushProcess, initStatus, setStatusDone, setStatusFailed } from './status'
import * as uniswap from './uniswaps'

const lifiContractAddress = '0xa74D44ed9C3BB96d7676E7A274c33A05210cf35a'
const getSupportedChains = (jsonArraySting: string) : ChainId[] => {
  try {
    const chainIds = JSON.parse(jsonArraySting)
    return chainIds
  } catch (e) {
    return []
  }
}

const supportedChains = getSupportedChains(process.env.REACT_APP_LIFI_CONTRACT_ENABLED_CHAINS_JSON!)

const buildSwap = async (swapAction: SwapAction, swapEstimate: SwapEstimate) => {
  switch (swapAction.tool) {
    case 'paraswap': {
      const call = await paraswap.getSwapCall(swapAction, swapEstimate, lifiContractAddress, lifiContractAddress)
      return {
        approveTo: await paraswap.getContractAddress(swapAction.chainId),
        call
      }
    }
    case '1inch': {
      const call = await oneInch.getSwapCall(swapAction, swapEstimate, lifiContractAddress, lifiContractAddress)
      return {
        approveTo: call.to,
        call,
      }
    }

    default: {
      const call = await uniswap.getSwapCall(swapAction, swapEstimate, lifiContractAddress, lifiContractAddress)
      return {
        approveTo: call.to,
        call,
      }
    }
  }
}

const getQuote = async (signer: JsonRpcSigner, nxtpSDK: NxtpSdk, crossStep: CrossStep, crossAction: CrossAction, receiverTransaction: ethers.PopulatedTransaction) => {
  // -> request quote
  let quote: AuctionResponse | undefined
  try {
    quote = await nxtp.getTransferQuote(nxtpSDK, crossAction.chainId, crossAction.token.id, crossAction.toChainId, crossAction.toToken.id, crossAction.amount.toString(), await signer.getAddress(), receiverTransaction.to, receiverTransaction.data, lifiContractAddress)
    if (!quote) throw Error("Quote confirmation failed!")
  } catch (e: any) {
    cleanUp(nxtpSDK)
    throw e
  }

  // -> store quote
  const crossEstimate: CrossEstimate = {
    type: 'cross',
    fromAmount: quote.bid.amount,
    toAmount: quote.bid.amountReceived,
    fees: {
      included: true,
      percentage: '0.0005',
      token: crossAction.token,
      amount: new BigNumber(quote.bid.amount).times('0.0005').toString(),
    },
    data: quote,
  }
  crossStep.estimate = crossEstimate

  return quote
}

const buildTransaction = async (signer: JsonRpcSigner, nxtpSDK: NxtpSdk, startSwapStep: SwapStep | undefined, crossStep: CrossStep, endSwapStep: SwapStep | undefined) => {
  const lifi = new ethers.Contract(lifiContractAddress, abi, signer)

  interface LifiData {
    transactionId: string
    integrator: string
    referrer: string
    sendingAssetId: string
    receivingAssetId: string
    receiver: string
    destinationChainId: string
    amount: string
  }

  // TODO: Adjust with swaps
  const lifiData: LifiData = {
    transactionId: getRandomBytes32(),
    integrator: 'li.finance',
    referrer: '0x552008c0f6870c2f77e5cC1d2eb9bdff03e30Ea0',
    sendingAssetId: crossStep.action.token.id,
    receivingAssetId: crossStep.action.toToken.id,
    receiver: await signer.getAddress(),
    destinationChainId: crossStep.action.toChainId.toString(),
    amount: crossStep.action.amount,
  }


  // Receiving side
  let receivingTransaction
  if (endSwapStep) {
    // Swap and Withdraw
    const swapAction = endSwapStep.action
    const swapEstimate = endSwapStep.estimate as SwapEstimate

    // adjust lifData
    lifiData.receivingAssetId = swapAction.toToken.id

    const swapCall = await buildSwap(swapAction, swapEstimate)

    receivingTransaction = await lifi.populateTransaction.swapAndCompleteBridgeTokensViaNXTP(
      lifiData,
      [
        {
          sendingAssetId: swapAction.token.id,
          receivingAssetId: swapAction.toToken.id,
          fromAmount: swapEstimate.fromAmount,
          callTo: swapCall.call.to,
          callData: swapCall.call.data,
          approveTo: swapCall.approveTo,
        },
      ],
      swapAction.toToken.id,
      await signer.getAddress()
    )
  } else {
    // Withdraw only
    receivingTransaction = await lifi.populateTransaction.completeBridgeTokensViaNXTP(
      lifiData,
      crossStep.action.toToken.id,
      await signer.getAddress(),
      crossStep.estimate.data.bid.amountReceived
    )
  }

  await getQuote(signer, nxtpSDK, crossStep, crossStep.action, receivingTransaction)

  // Sending side
  const expiry = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 3
  const nxtpData = {
    invariantData: {
      ...crossStep.estimate.data.bid,
      sendingChainFallback: await signer.getAddress(),
    },
    amount: crossStep.estimate.data.bid.amount,
    expiry: expiry,
    encodedBid: encodeAuctionBid(crossStep.estimate.data.bid),
    bidSignature: crossStep.estimate.data.bidSignature || '',
    encodedMeta: '0x',
    encryptedCallData: crossStep.estimate.data.bid.encryptedCallData,
    callDataHash: crossStep.estimate.data.bid.callDataHash,
    callTo: crossStep.estimate.data.bid.callTo,
  }
  const swapOptions: any = {
    gasLimit: 500000,
  }

  // Debug log
  console.debug({
    lifiData,
    nxtpData,
  })

  if (startSwapStep) {
    // Swap and Transfer
    const swapAction = startSwapStep.action as SwapAction
    const swapEstimate = startSwapStep.estimate as SwapEstimate

    // adjust lifData
    lifiData.sendingAssetId = swapAction.token.id
    lifiData.amount = swapAction.amount

    // > build swap
    const swapCall = await buildSwap(swapAction, swapEstimate)

    const swapData = {
      sendingAssetId: swapAction.token.id,
      receivingAssetId: swapAction.toToken.id,
      fromAmount: swapEstimate.fromAmount,
      toAmount: swapEstimate.toAmountMin,
      callTo: swapCall.call.to,
      callData: swapCall?.call.data,
      approveTo: swapCall.approveTo,
    }

    console.log({
      swapData
    })

    // > pass native currency directly
    if (swapAction.token.id === constants.AddressZero) {
      swapOptions.value = swapEstimate.fromAmount
    }

    // > swap and transfer
    return lifi.populateTransaction.swapAndStartBridgeTokensViaNXTP(
      lifiData,
      [swapData],
      nxtpData,
      swapOptions
    )
  } else {
    // Transfer only
    // > pass native currency directly
    if (crossStep.action.token.id === constants.AddressZero) {
      swapOptions.value = crossStep.estimate.fromAmount
    }

    // > transfer only
    return lifi.populateTransaction.startBridgeTokensViaNXTP(
      lifiData,
      nxtpData,
      swapOptions,
    )
  }
}

const executeLifi = async (signer: JsonRpcSigner, route: TransferStep[], updateStatus?: Function, initialStatus?: Execution) => {

  // unpack route
  const startSwapStep = route[0].action.type === 'swap' ? route[0] as SwapStep : undefined
  const endSwapStep = route[route.length - 1].action.type === 'swap' ? route[route.length - 1] as SwapStep : undefined
  const crossStep = route.find(step => step.action.type === 'cross')! as CrossStep
  const crossAction = crossStep.action as CrossAction
  const fromChain = getChainById(crossAction.chainId)
  const toChain = getChainById(crossAction.toChainId)

  // setup
  let { status, update } = initStatus(updateStatus, initialStatus)

  // ## DEACTIVATED, because key is requested in sdk
  // // Request public key
  // // -> set status
  // const keyProcess = createAndPushProcess(update, status, 'Provide Public Key', { status: 'ACTION_REQUIRED' })
  // // -> request key
  // let encryptionPublicKey
  // try {
  //   encryptionPublicKey = await (window as any).ethereum.request({
  //     method: "eth_getEncryptionPublicKey",
  //     params: [await signer.getAddress()], // you must have access to the specified account
  //   })
  // } catch (e) {
  //   console.error(e)
  //   setStatusFailed(update, status, keyProcess)
  //   throw e
  // }
  // // -> set status
  // setStatusDone(update, status, keyProcess)


  // Allowance
  if (route[0].action.token.id !== constants.AddressZero) {
    await checkAllowance(signer, fromChain, route[0].action.token, route[0].action.amount, lifiContractAddress, update, status)
  }

  // Transaction
  // -> set status
  const submitProcess = createAndPushProcess('submitProcess', update, status, 'Preparing Transaction', { status: 'PENDING' })

  // -> prepare
  let call
  let nxtpSDK
  try {
    const crossableChains = [crossAction.chainId, crossAction.toChainId]
    const chainProviders = getRpcProviders(crossableChains)
    nxtpSDK = await nxtp.setup(signer, chainProviders)
    call = await buildTransaction(signer, nxtpSDK, startSwapStep, crossStep, endSwapStep)
  } catch (e: any) {
    if (e.message) submitProcess.errorMessage = e.message
    if (e.code) submitProcess.errorCode = e.code
    setStatusFailed(update, status, submitProcess)
    if (nxtpSDK) cleanUp(nxtpSDK)
    throw e
  }

  // -> set status
  submitProcess.message = 'Send Transaction'
  submitProcess.status = 'ACTION_REQUIRED'
  update(status)

  // -> send
  let tx
  try {
    tx = await signer.sendTransaction(call)
  } catch (e: any) {
    if (e.message) submitProcess.errorMessage = e.message
    if (e.code) submitProcess.errorCode = e.code
    setStatusFailed(update, status, submitProcess)
    throw e
  }

  // -> set status
  submitProcess.status = 'PENDING'
  submitProcess.txHash = tx.hash
  submitProcess.txLink = fromChain.metamask.blockExplorerUrls[0] + 'tx/' + submitProcess.txHash
  submitProcess.message = 'Sedn Transaction - Wait for'
  update(status)

  // -> wait
  try {
    await tx.wait()
  } catch (e: any) {
    if (e.message) submitProcess.errorMessage = e.message
    if (e.code) submitProcess.errorCode = e.code
    setStatusFailed(update, status, submitProcess)
    cleanUp(nxtpSDK)
    throw e
  }

  // -> set status
  submitProcess.messafe = 'Transaction Sent:'
  setStatusDone(update, status, submitProcess)


  // Wait for receiver
  // -> set status
  const receiverProcess = createAndPushProcess('receiverProcess', update, status, 'Wait for Receiver', { type: 'wait' })

  // -> wait
  let prepared
  try {
    prepared = await nxtpSDK.waitFor(
      NxtpSdkEvents.ReceiverTransactionPrepared,
      600_000, // 10 min
      (data) => data.txData.transactionId === crossStep.estimate.data.bid.transactionId // filter function
    )
  } catch (e) {
    receiverProcess.errorMessage = 'Failed to get an answer in time. Please go to https://xpollinate.io/ and check the state of your transaction there.'
    setStatusFailed(update, status, receiverProcess)
    cleanUp(nxtpSDK)
    throw e
  }

  // -> set status
  receiverProcess.txHash = prepared.transactionHash
  receiverProcess.txLink = toChain.metamask.blockExplorerUrls[0] + 'tx/' + receiverProcess.txHash
  receiverProcess.message = 'Receiver Prepared:'
  setStatusDone(update, status, receiverProcess)


  // Sign to claim
  // -> set status
  const proceedProcess = createAndPushProcess('proceedProcess', update, status, 'Ready to be Signed', { type: 'claim', status: 'ACTION_REQUIRED' })

  // -> sign
  try {
    await nxtp.finishTransfer(nxtpSDK, prepared, crossStep, update)
  } catch (e) {
    proceedProcess.errorMessage = 'Failed to get an answer in time. Please go to https://xpollinate.io/ and check the state of your transaction there.'
    setStatusFailed(update, status, proceedProcess)
    cleanUp(nxtpSDK)
    throw e
  }

  // -> set status
  proceedProcess.status = 'PENDING'
  proceedProcess.message = 'Wait for claim'
  update(status)

  // -> wait
  let claimed
  try {
    claimed = await nxtpSDK.waitFor(
      NxtpSdkEvents.ReceiverTransactionFulfilled,
      200_000,
      (data) => data.txData.transactionId === crossStep.estimate.data.bid.transactionId // filter function
    )
  } catch (e) {
    proceedProcess.errorMessage = 'Failed to get an answer in time. Please go to https://xpollinate.io/ and check the state of your transaction there.'
    setStatusFailed(update, status, proceedProcess)
    cleanUp(nxtpSDK)
    throw e
  }

  // -> set status
  proceedProcess.txHash = claimed.transactionHash
  proceedProcess.txLink = toChain.metamask.blockExplorerUrls[0] + 'tx/' + proceedProcess.txHash
  proceedProcess.message = 'Funds Claimed:'
  setStatusDone(update, status, proceedProcess)

  // DONE
  status.toAmount = claimed.txData.amount
  status.status = 'DONE'
  update(status)
  return status
}

const cleanUp = (sdk: NxtpSdk) => {
  sdk.removeAllListeners()
}

export const lifinance = {
  supportedChains: supportedChains,
  executeLifi: executeLifi,
}
