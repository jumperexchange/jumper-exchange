import { NxtpSdk, NxtpSdkEvents } from '@connext/nxtp-sdk';
import { AuctionResponse } from '@connext/nxtp-utils';
import { JsonRpcSigner } from '@ethersproject/providers';
import BigNumber from 'bignumber.js';
import * as sigUtil from 'eth-sig-util';
import { constants, ethers, utils } from 'ethers';
import { getRpcProviders } from '../components/web3/connectors';
import { ChainId, CrossAction, CrossEstimate, Execution, getChainById, Process, SwapAction, SwapEstimate, TransferStep } from '../types';
import { lifi_abi } from '../types/nxtpFacet.types';
import { checkAllowance } from './allowance.execute';
import * as nxtp from './nxtp';
import { createAndPushProcess, initStatus, setStatusDone, setStatusFailed } from './status';
import { getSwapCall } from './uniswaps';

const lifiContractAddress = '0xFdeE0875499cddb70539f370E28dCf6037dC93E3'
const supportedChains = [
  ChainId.RIN,
  ChainId.GOR,
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

const myEncrypt = async (msg: string, publicKey: string) => {
  const buf = Buffer.from(
    JSON.stringify(
      sigUtil.encrypt(
        publicKey,
        { data: msg },
        'x25519-xsalsa20-poly1305'
      )
    ),
    'utf8'
  )

  return '0x' + buf.toString('hex')
}

const executeLifi = async (signer: JsonRpcSigner, route: TransferStep[], updateStatus?: Function, initialStatus?: Execution) => {

  const startSwapStep = route[0].action.type === 'swap' ? route[0] : undefined
  const endSwapStep = route[route.length-1].action.type === 'swap' ? route[route.length-1] : undefined

  const crossStep = route.find(step => step.action.type === 'cross')!
  const crossAction = crossStep.action as CrossAction
  const fromChain = getChainById(crossAction.chainId)
  const toChain = getChainById(crossAction.toChainId)


  // setup
  let { status, update } = initStatus(updateStatus, initialStatus)

  // allowance
  if (route[0].action.token.id !== constants.AddressZero) {
    await checkAllowance(signer, fromChain, route[0].action.token, route[0].action.amount, lifiContractAddress, update, status)
  }

  // sdk
  // -> set status
  const quoteProcess = createAndPushProcess('quoteProcess', update, status, 'Setup NXTP')
  // -> init sdk
  const crossableChains = [crossAction.chainId, crossAction.toChainId]
  const chainProviders = getRpcProviders(crossableChains)
  const nxtpSDK = await nxtp.setup(signer, chainProviders)

  // get Quote
  // -> set status
  quoteProcess.message = 'Confirm Quote'
  update(status)

  let quote: AuctionResponse | undefined;
  try {
    quote = await nxtp.getTransferQuote(nxtpSDK, crossAction.chainId, crossAction.token.id, crossAction.toChainId, crossAction.toToken.id, crossAction.amount.toString(), await signer.getAddress())
    if (!quote) throw Error("Quote confirmation failed!")
  } catch (_e) {
    const e = _e as Error
    quoteProcess.errorMessage = e.message
    cleanUp(nxtpSDK, update, status, quoteProcess)
    throw e
  }
  setStatusDone(update, status, quoteProcess)

  // store quote
  const crossEstimate: CrossEstimate = {
    type: 'cross',
    fromAmount: quote.bid.amount,
    toAmount: quote.bid.amountReceived,
    fees: {
      included: true,
      percentage: '0.0005',
      token: crossAction.token,
      amount: new BigNumber(crossAction.amount).times('0.0005').toString(),
    },
    data: quote,
  }
  crossStep.estimate = crossEstimate


  // Request public key
  const keyProcess = createAndPushProcess('keyProcess', update, status, 'Provide Public Key', { status: 'ACTION_REQUIRED' })
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
  setStatusDone(update, status, keyProcess)
  const submitProcess = createAndPushProcess('keyProcess', update, status, 'Send Transaction', { status: 'ACTION_REQUIRED' })
  const lifi = new ethers.Contract(lifiContractAddress, lifi_abi, signer)

  // Receiving side
  let receivingTransaction
  if (endSwapStep) {
    const swapAction = endSwapStep.action as SwapAction
    const swapEstimate = endSwapStep.estimate as SwapEstimate
    // TODO: configure slippage
    const swapCall = await getSwapCall(signer, swapAction.chainId, lifiContractAddress, swapAction.token.id, swapAction.toToken.id, swapEstimate.fromAmount, swapEstimate.toAmount, swapEstimate.data.path)

    receivingTransaction = await lifi.populateTransaction.swapAndCompleteBridgeTokensViaNXTP(
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
      await signer.getAddress(),
      // swapEstimate.toAmount
    )
  } else {
    receivingTransaction = await lifi.populateTransaction.completeBridgeTokensViaNXTP(
      crossAction.toToken.id,
      await signer.getAddress(),
      quote.bid.amountReceived
    )
  }

  // trigger transfer
  try {
    const encrypted = await myEncrypt(receivingTransaction.data!, encryptionPublicKey)
    const nxtpData = {
      ...quote.bid,
      sendingChainFallback: await signer.getAddress(),
      encodedBid: utils.defaultAbiCoder.encode([AuctionBidEncoding], [quote.bid]),
      bidSignature: quote.bidSignature || '',
      amount: quote.bid.amount,
      expiry: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 3,
      callTo: receivingTransaction.to,
      encryptedCallData: encrypted, // await encrypt(receivingTransaction.data!, encryptionPublicKey),
      callDataHash: utils.keccak256(receivingTransaction.data!),
    }

    let tx
    if (startSwapStep) {
      const swapAction = startSwapStep.action as SwapAction
      const swapEstimate = startSwapStep.estimate as SwapEstimate
      const swapCall = await getSwapCall(signer, swapAction.chainId, lifiContractAddress, swapAction.token.id, swapAction.toToken.id, swapEstimate.fromAmount, swapEstimate.toAmount, swapEstimate.data.path)
      const swapData: any = {
        fromToken: swapAction.token.id,
        toToken: swapAction.toToken.id,
        fromAmount: swapEstimate.fromAmount,
        toAmount: swapEstimate.toAmount,
        callTo: swapCall.to,
        callData: swapCall?.data,
      }
      const swapOptions: any = {
        gasLimit: 500000,
      }

      if (swapAction.token.id === constants.AddressZero) {
        swapOptions.value = swapEstimate.fromAmount
      }

      tx = await lifi.swapAndStartBridgeTokensViaNXTP(
        [swapData],
        nxtpData,
        swapOptions
      )

    } else {
      // only transfer
      tx = await lifi.startBridgeTokensViaNXTP(
        nxtpData,
        { gasLimit: 500000 }
      )
    }

    submitProcess.status = 'PENDING'
    submitProcess.txHash = tx.hash
    submitProcess.txLink = fromChain.metamask.blockExplorerUrls[0] + 'tx/' + submitProcess.txHash
    submitProcess.message = <>Send Transaction - Wait for <a href={submitProcess.txLink} target="_blank" rel="nofollow noreferrer">Tx</a></>
    update(status)

    await tx.wait()
  } catch (e) {
    nxtpSDK.removeAllListeners()
    throw e
  }
  submitProcess.message = <>Transaction Sent: <a href={submitProcess.txLink} target="_blank" rel="nofollow noreferrer">Tx</a></>
  setStatusDone(update, status, submitProcess)

  const receiverProcess = createAndPushProcess('receiverProcess', update, status, 'Wait for Receiver', { type: 'wait' })

  const prepared = await nxtpSDK.waitFor(
    NxtpSdkEvents.ReceiverTransactionPrepared,
    100_000,
    (data) => data.txData.transactionId === quote!.bid.transactionId // filter function
  )

  receiverProcess.txHash = prepared.transactionHash
  receiverProcess.txLink = toChain.metamask.blockExplorerUrls[0] + 'tx/' + receiverProcess.txHash
  receiverProcess.message = <>Receiver Prepared: <a href={receiverProcess.txLink} target="_blank" rel="nofollow noreferrer">Tx</a></>
  setStatusDone(update, status, receiverProcess)

  const proceedProcess = createAndPushProcess('proceedProcess', update, status, 'Ready to be Signed', { type: 'claim' })
  proceedProcess.status = 'ACTION_REQUIRED'
  update(status)

  await nxtp.finishTransfer(nxtpSDK, prepared, crossStep, update)

  const claimed = await nxtpSDK.waitFor(
    NxtpSdkEvents.ReceiverTransactionFulfilled,
    100_000,
    (data) => data.txData.transactionId === quote!.bid.transactionId // filter function
  )

  status.status = 'DONE'
  proceedProcess.txHash = claimed.transactionHash
  proceedProcess.txLink = toChain.metamask.blockExplorerUrls[0] + 'tx/' + proceedProcess.txHash
  proceedProcess.message = <>Funds Claimed: <a href={proceedProcess.txLink} target="_blank" rel="nofollow noreferrer">Tx</a></>
  status.toAmount = claimed.txData.amount
  setStatusDone(update, status, proceedProcess)
}

const cleanUp = (sdk: NxtpSdk, update: Function, status: any, process: Process) => {
  setStatusFailed(update, status, process)
  sdk.removeAllListeners()
}

export const lifinance = {
  supportedChains: supportedChains,
  executeLifi: executeLifi,
}
