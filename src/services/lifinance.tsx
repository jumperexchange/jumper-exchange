import { NxtpSdk, NxtpSdkEvents } from '@connext/nxtp-sdk';
import { encrypt } from '@connext/nxtp-sdk/dist/utils';
import { AuctionResponse, getRandomBytes32 } from '@connext/nxtp-utils';
import { JsonRpcSigner } from '@ethersproject/providers';
import BigNumber from 'bignumber.js';
import { constants, ethers, utils } from 'ethers';
import { getRpcProviders } from '../components/web3/connectors';
import { Chain, ChainId, CrossAction, CrossEstimate, CrossStep, Execution, getChainById, Process, SwapAction, SwapEstimate, SwapStep, Token, TransferStep } from '../types';
import { abi } from './ABI/NXTPFacet.json';
import * as nxtp from './nxtp';
import * as paraswap from './paraswap';
import { oneInch } from './1Inch';
import { createAndPushProcess, initStatus, setStatusDone, setStatusFailed } from './status';
import { getSwapCall } from './uniswaps';
import { getApproved, setApproval } from './utils';

const lifiContractAddress = '0xa74D44ed9C3BB96d7676E7A274c33A05210cf35a'
const supportedChains = [
  ChainId.BSC,
  ChainId.POL,
  ChainId.DAI,
  ChainId.FTM,

  // Testnets
  ChainId.ROP,
  ChainId.RIN,
  ChainId.GOR,
  ChainId.MUM,
]

const tidy = (str: string): string =>
  `${str.replace(/\n/g, '').replace(/ +/g, ' ')}`

const AuctionBidEncoding = tidy(`tuple(
  address user,
  address router,
  uint24 sendingChainId,
  address sendingAssetId,
  uint256 amount,
  uint24 receivingChainId,
  address receivingAssetId,
  uint256 amountReceived,
  address receivingAddress,
  bytes32 transactionId,
  uint256 expiry,
  bytes32 callDataHash,
  address callTo,
  bytes encryptedCallData,
  address sendingChainTxManagerAddress,
  address receivingChainTxManagerAddress,
  uint256 bidExpiry
)`)

const checkAllowance = async (signer: JsonRpcSigner, chain: Chain, token: Token, amount: string, spenderAddress: string, update: Function, status: Execution) => {
  // Ask user to set allowance
  // -> set status
  const allowanceProcess = createAndPushProcess(update, status, `Set Allowance for ${token.symbol}`)

  // -> check allowance
  try {
    const approved = await getApproved(signer, token.id, spenderAddress)

    if (new BigNumber(amount).gt(approved)) {
      allowanceProcess.status = 'ACTION_REQUIRED'
      update(status)

      const approveTx = await setApproval(signer, token.id, spenderAddress, amount)

      // update status
      allowanceProcess.status = 'PENDING'
      allowanceProcess.txHash = approveTx.hash
      allowanceProcess.txLink = chain.metamask.blockExplorerUrls[0] + 'tx/' + allowanceProcess.txHash
      allowanceProcess.message = <>Approve - Wait for <a href={allowanceProcess.txLink} target="_blank" rel="nofollow noreferrer">Tx</a></>
      update(status)

      // wait for transcation
      await approveTx.wait()

      // -> set status
      allowanceProcess.message = <>Approved: <a href={allowanceProcess.txLink} target="_blank" rel="nofollow noreferrer">Tx</a></>
    } else {
      allowanceProcess.message = 'Already Approved'
    }
    setStatusDone(update, status, allowanceProcess)
  } catch (e: any) {
    // -> set status
    if (e.message) allowanceProcess.errorMessage = e.message
    if (e.code) allowanceProcess.errorCode = e.code
    setStatusFailed(update, status, allowanceProcess)
    throw e
  }
}

const buildTransaction = async (signer: JsonRpcSigner, encryptionPublicKey: string, startSwapStep: SwapStep | undefined, crossStep: CrossStep, endSwapStep: SwapStep | undefined) => {
  const lifi = new ethers.Contract(lifiContractAddress, abi, signer)

  interface LifiData {
    transactionId: string
    integrator: string
    referrer: string
    timestamp: number
  }
  const lifiData: LifiData = {
    transactionId: getRandomBytes32(),
    integrator: 'li.finance',
    referrer: '0x552008c0f6870c2f77e5cC1d2eb9bdff03e30Ea0',
    timestamp: Date.now(),
  }


  // Receiving side
  let receivingTransaction
  if (endSwapStep) {
    // Swap and Withdraw
    const swapAction = endSwapStep.action
    const swapEstimate = endSwapStep.estimate as SwapEstimate

    let swapCall
    switch (swapAction.tool) {
      case 'paraswap':
        swapCall = await paraswap.getSwapCall(swapAction.chainId, lifiContractAddress, swapAction.token, swapAction.toToken, swapEstimate.fromAmount, 0, swapEstimate.data)
        break;

      case '1inch':
        swapCall = await oneInch.getSwapCall(swapAction.chainId, lifiContractAddress, swapAction.token, swapAction.toToken, swapEstimate.fromAmount, 0)
        break;

      default:
        // TODO: configure slippage
        swapCall = await getSwapCall(signer, swapAction.chainId, lifiContractAddress, swapAction.token.id, swapAction.toToken.id, swapEstimate.fromAmount, swapEstimate.toAmount, swapEstimate.data.path)
        break;
    }

    receivingTransaction = await lifi.populateTransaction.swapAndCompleteBridgeTokensViaNXTP(
      lifiData,
      [
        {
          fromToken: swapAction.token.id,
          toToken: swapAction.toToken.id,
          fromAmount: swapEstimate.fromAmount,
          toAmount: swapEstimate.toAmount,
          callTo: swapCall.to,
          callData: swapCall?.data,
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


  // Sending side
  const expiry = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 3
  const encrypted = encrypt(receivingTransaction.data!, encryptionPublicKey)
  const nxtpData = {
    ...crossStep.estimate.data.bid,
    sendingChainFallback: await signer.getAddress(),
    encodedBid: utils.defaultAbiCoder.encode([AuctionBidEncoding], [crossStep.estimate.data.bid]),
    bidSignature: crossStep.estimate.data.bidSignature || '',
    amount: crossStep.estimate.data.bid.amount,
    expiry: expiry,
    callTo: receivingTransaction.to,
    encryptedCallData: encrypted,
    callDataHash: utils.keccak256(receivingTransaction.data!),
  }

  const swapOptions: any = {
    gasLimit: 500000,
  }

  if (startSwapStep) {
    // Swap and Transfer
    const swapAction = startSwapStep.action as SwapAction
    const swapEstimate = startSwapStep.estimate as SwapEstimate

    // > build swap
    const swapData = {
      fromToken: swapAction.token.id,
      toToken: swapAction.toToken.id,
      fromAmount: swapEstimate.fromAmount,
      toAmount: swapEstimate.toAmount,
      callTo: '',
      callData: '',
    }
    switch (swapAction.tool) {
      case '1inch':
        break;
      case 'paraswap':
        break;
      default:
        const swapCall = await getSwapCall(signer, swapAction.chainId, lifiContractAddress, swapAction.token.id, swapAction.toToken.id, swapEstimate.fromAmount, swapEstimate.toAmount, swapEstimate.data.path)
        swapData.callTo = swapCall.to!
        swapData.callData = swapCall?.data!
    }

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
    } else {
      swapOptions.value = 0
    }
    // > transfer only
    return lifi.populateTransaction.startBridgeTokensViaNXTP(
      lifiData,
      nxtpData,
      swapOptions,
    )
  }
}

const getSdkAndQuote = async (signer: JsonRpcSigner, crossStep: CrossStep, crossAction: CrossAction, update: Function, status: Execution) => {
  // sdk
  // -> set status
  const quoteProcess = createAndPushProcess(update, status, 'Setup NXTP')
  // -> init sdk
  const crossableChains = [crossAction.chainId, crossAction.toChainId]
  const chainProviders = getRpcProviders(crossableChains)
  const nxtpSDK = await nxtp.setup(signer, chainProviders)

  // get Quote
  // -> set status
  quoteProcess.message = 'Confirm Quote'
  update(status)

  // -> request quote
  let quote: AuctionResponse | undefined;
  try {
    quote = await nxtp.getTransferQuote(nxtpSDK, crossAction.chainId, crossAction.token.id, crossAction.toChainId, crossAction.toToken.id, crossAction.amount.toString(), await signer.getAddress())
    if (!quote) throw Error("Quote confirmation failed!")
  } catch (e: any) {
    quoteProcess.errorMessage = e.message
    cleanUp(nxtpSDK, update, status, quoteProcess)
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

  // -> set status
  setStatusDone(update, status, quoteProcess)

  return nxtpSDK
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

  // sdk + quote
  const sdkPromise = getSdkAndQuote(signer, crossStep, crossAction, update, status)


  // Request public key
  // -> set status
  const keyProcess = createAndPushProcess(update, status, 'Provide Public Key', { status: 'ACTION_REQUIRED' })

  // -> request key
  let encryptionPublicKey
  try {
    encryptionPublicKey = await (window as any).ethereum.request({
      method: "eth_getEncryptionPublicKey",
      params: [await signer.getAddress()], // you must have access to the specified account
    })
  } catch (e) {
    console.error(e)
    setStatusFailed(update, status, keyProcess)
    throw e
  }

  // -> set status
  setStatusDone(update, status, keyProcess)


  // Allowance
  if (route[0].action.token.id !== constants.AddressZero) {
    await checkAllowance(signer, fromChain, route[0].action.token, route[0].action.amount, lifiContractAddress, update, status)
  }


  // Wait for SDK and quote
  const nxtpSDK = await sdkPromise


  // Transaction
  // -> set status
  const submitProcess = createAndPushProcess(update, status, 'Preparing Transaction', { status: 'PENDING' })

  // -> prepare
  let call
  try {
    call = await buildTransaction(signer, encryptionPublicKey, startSwapStep, crossStep, endSwapStep)
  } catch (e: any) {
    if (e.message) submitProcess.errorMessage = e.message
    if (e.code) submitProcess.errorCode = e.code
    setStatusFailed(update, status, submitProcess)
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
    throw e
  }

  // -> set status
  submitProcess.status = 'PENDING'
  submitProcess.txHash = tx.hash
  submitProcess.txLink = fromChain.metamask.blockExplorerUrls[0] + 'tx/' + submitProcess.txHash
  submitProcess.message = <>Send Transaction - Wait for <a href={submitProcess.txLink} target="_blank" rel="nofollow noreferrer">Tx</a></>
  update(status)

  // -> wait
  try {
    await tx.wait()
  } catch (e: any) {
    if (e.message) submitProcess.errorMessage = e.message
    if (e.code) submitProcess.errorCode = e.code
    throw e
  }

  // -> set status
  submitProcess.message = <>Transaction Sent: <a href={submitProcess.txLink} target="_blank" rel="nofollow noreferrer">Tx</a></>
  setStatusDone(update, status, submitProcess)


  // Wait for receiver
  // -> set status
  const receiverProcess = createAndPushProcess(update, status, 'Wait for Receiver', { type: 'wait' })

  // -> wait
  let prepared
  try {
    prepared = await nxtpSDK.waitFor(
      NxtpSdkEvents.ReceiverTransactionPrepared,
      200_000,
      (data) => data.txData.transactionId === crossStep.estimate.data.bid.transactionId // filter function
    )
  } catch (e) {
    receiverProcess.errorMessage = 'Failed to get an answer in time. Please go to https://xpollinate.io/ and check the state of your transaction there.'
    setStatusFailed(update, status, receiverProcess)
    throw e
  }

  // -> set status
  receiverProcess.txHash = prepared.transactionHash
  receiverProcess.txLink = toChain.metamask.blockExplorerUrls[0] + 'tx/' + receiverProcess.txHash
  receiverProcess.message = <>Receiver Prepared: <a href={receiverProcess.txLink} target="_blank" rel="nofollow noreferrer">Tx</a></>
  setStatusDone(update, status, receiverProcess)


  // Sign to claim
  // -> set status
  const proceedProcess = createAndPushProcess(update, status, 'Ready to be Signed', { type: 'claim', status: 'ACTION_REQUIRED' })

  // -> sign
  try {
    await nxtp.finishTransfer(nxtpSDK, prepared, crossStep, update)
  } catch (e) {
    proceedProcess.errorMessage = 'Failed to get an answer in time. Please go to https://xpollinate.io/ and check the state of your transaction there.'
    setStatusFailed(update, status, proceedProcess)
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
    throw e
  }

  // -> set status
  proceedProcess.txHash = claimed.transactionHash
  proceedProcess.txLink = toChain.metamask.blockExplorerUrls[0] + 'tx/' + proceedProcess.txHash
  proceedProcess.message = <>Funds Claimed: <a href={proceedProcess.txLink} target="_blank" rel="nofollow noreferrer">Tx</a></>
  setStatusDone(update, status, proceedProcess)

  // DONE
  status.toAmount = claimed.txData.amount
  status.status = 'DONE'
  update(status)
  return status
}

const cleanUp = (sdk: NxtpSdk, update: Function, status: any, process: Process) => {
  setStatusFailed(update, status, process)
  sdk.removeAllListeners()
}

export const lifinance = {
  supportedChains: supportedChains,
  executeLifi: executeLifi,
}
