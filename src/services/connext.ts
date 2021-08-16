import { BrowserNode } from "@connext/vector-browser-node"
import { ConditionalTransferCreatedPayload, ConditionalTransferResolvedPayload, DepositReconciledPayload, EngineEvents, ERC20Abi, FullChannelState, TransferNames, WithdrawalReconciledPayload, WithdrawalResolvedPayload } from "@connext/vector-types"
import { getBalanceForAssetId, getRandomBytes32 } from "@connext/vector-utils"
import { BigNumber } from "@ethersproject/bignumber"
import { AddressZero } from "@ethersproject/constants"
import { JsonRpcProvider } from "@ethersproject/providers"
import { Contract, ContractReceipt, ethers, providers, utils } from "ethers"
import { Evt } from "evt"
import { emptyExecution, Execution, Process } from '../types/server'
import UniswapWithdrawHelper from "./ABI/UniswapWithdrawHelper.json" // import UniswapWithdrawHelper from "@connext/vector-withdraw-helpers/artifacts/contracts/UniswapWithdrawHelper/UniswapWithdrawHelper.sol/UniswapWithdrawHelper.json"
import { deepClone } from './utils'

const connext = "vector892GMZ3CuUkpyW8eeXfW2bt5W73TWEXtgV71nphXUXAmpncnj8" // referenced in https://docs.connext.network/connext-mainnet
const xpollinate_old = "vector52rjrwRFUkaJai2J4TrngZ6doTUXGZhizHmrZ6J15xVv4YFgFC"
const xpollinate = "vector5AGCU8oedG9HDmrC7mU9fDyQkpVRovFtEauVq3fHGcmRdbg7iu" // used by https://www.xpollinate.io/
const routerPublicIdentifier = xpollinate || connext || xpollinate_old

const chainProviders: { [chainId: number]: string } = {
  1: process.env.REACT_APP_RPC_URL_MAINNET || '',
  56: process.env.REACT_APP_RPC_URL_BSC || '',
  100: process.env.REACT_APP_RPC_URL_XDAI || '',
  137: process.env.REACT_APP_RPC_URL_POLYGON_MAINNET || '',
}

const chainJsonProviders: { [chainId: number]: JsonRpcProvider } = {
  1: new JsonRpcProvider(process.env.REACT_APP_RPC_URL_MAINNET),
  56: new JsonRpcProvider(process.env.REACT_APP_RPC_URL_BSC),
  100: new JsonRpcProvider(process.env.REACT_APP_RPC_URL_XDAI),
  137: new JsonRpcProvider(process.env.REACT_APP_RPC_URL_POLYGON_MAINNET),
}

// Custom contracts to connect DEX with stateChannel ownend/deployed by ??? (TODO: depoly own versions)
// https://github.com/connext/vector-withdraw-helpers/blob/main/contracts/UniswapWithdrawHelper/UniswapWithdrawHelper.sol
const withdrawHelpers: { [chainId: number]: string } = {
  56: "0xad654314d3F6590243602D14b4089332EBb5227D", // https://bscscan.com/address/0xad654314d3f6590243602d14b4089332ebb5227d#tokentxns
  100: "0xe12639c8C458f719146286f8B8b7050176577a62", // https://blockscout.com/xdai/mainnet/address/0xe12639c8C458f719146286f8B8b7050176577a62/internal-transactions
  137: "0xD1CC3E4b9c6d0cb0B9B97AEde44d4908FF0be507", // https://polygonscan.com/address/0xD1CC3E4b9c6d0cb0B9B97AEde44d4908FF0be507#tokentxns
}

// Official routers
const uniswapRouters: { [chainId: number]: string } = {
  // Uniswap https://app.uniswap.org/#/swap
  1: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D", // rotuer v2 https://uniswap.org/docs/v2/smart-contracts/router02/#address

  // BSC PancakeSwap https://docs.pancakeswap.finance/
  56: "0x05ff2b0db69458a0750badebc4f9e13add608c7f", // router v1 https://bscscan.com/address/0x05ff2b0db69458a0750badebc4f9e13add608c7f#contracts
  //56: "0x10ED43C718714eb63d5aA57B78B54704E256024E", // router v2 https://bscscan.com/address/0x10ED43C718714eb63d5aA57B78B54704E256024E#code

  // xDAI Honeyswap https://wiki.1hive.org/projects/honeyswap/honeyswap-on-xdai-1
  100: "0x1C232F01118CB8B424793ae03F870aa7D0ac7f77", // router v2 https://blockscout.com/poa/xdai/address/0x1C232F01118CB8B424793ae03F870aa7D0ac7f77/contracts

  // Polygon QuickSwap https://github.com/QuickSwap/QuickSwap-subgraph/blob/master/subgraph.yaml => Factory 0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32
  137: "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff", // router v2 https://explorer-mainnet.maticvigil.com/address/0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff/contracts
}

type EvtContainer = {
  [EngineEvents.CONDITIONAL_TRANSFER_CREATED]: Evt<ConditionalTransferCreatedPayload>
  [EngineEvents.CONDITIONAL_TRANSFER_RESOLVED]: Evt<ConditionalTransferResolvedPayload>
  [EngineEvents.DEPOSIT_RECONCILED]: Evt<DepositReconciledPayload>
  [EngineEvents.WITHDRAWAL_RECONCILED]: Evt<WithdrawalReconciledPayload>
  [EngineEvents.WITHDRAWAL_RESOLVED]: Evt<WithdrawalResolvedPayload>
}

let _node: BrowserNode
let _evts: EvtContainer

export const getNode = () => {
  return _node
}

export const getEvt = (node: BrowserNode) => {
  if (!_evts) {
    _evts = createEvtContainer(node)
  }
  return _evts
}

export const initNode = async () => {
  const node = new BrowserNode({
    routerPublicIdentifier,
    chainProviders,
  })
  await node.init()
  _node = node
  return getNode()
}


// helpers
const getChannelForChain = async (node: BrowserNode, chainId: number) => {
  const channelRes = await node.getStateChannelByParticipants({
    chainId: chainId,
    counterparty: routerPublicIdentifier,
  })
  if (channelRes.isError) {
    throw channelRes.getError()
  }
  let channel = channelRes.getValue()

  // Fallback
  if (!channel) {
    const res = await node.setup({
      chainId: chainId,
      counterpartyIdentifier: routerPublicIdentifier,
      timeout: "100000",
    })
    if (res.isError) {
      throw res.getError()
    }
    const channelStateRes = await node.getStateChannel({
      channelAddress: res.getValue() as string,
    })
    if (channelStateRes.isError) {
      throw res.getError()
    }
    channel = channelStateRes.getValue()
  }

  if (!channel) {
    throw new Error('No channel')
  }

  return channel as FullChannelState
}

const createEvtContainer = (node: BrowserNode): EvtContainer => {
  const createdTransfer = Evt.create<ConditionalTransferCreatedPayload>()
  const resolvedTransfer = Evt.create<ConditionalTransferResolvedPayload>()
  const deposit = Evt.create<DepositReconciledPayload>()
  const withdrawReconciled = Evt.create<WithdrawalReconciledPayload>()
  const withdrawResolved = Evt.create<WithdrawalResolvedPayload>()

  node.on(EngineEvents.CONDITIONAL_TRANSFER_CREATED, data => {
    console.log("EngineEvents.CONDITIONAL_TRANSFER_CREATED: ", data)
    createdTransfer.post(data)
  })
  node.on(EngineEvents.CONDITIONAL_TRANSFER_RESOLVED, data => {
    console.log("EngineEvents.CONDITIONAL_TRANSFER_RESOLVED: ", data)
    resolvedTransfer.post(data)
  })
  node.on(EngineEvents.DEPOSIT_RECONCILED, data => {
    console.log("EngineEvents.DEPOSIT_RECONCILED: ", data)
    deposit.post(data)
  })
  node.on(EngineEvents.WITHDRAWAL_RECONCILED, data => {
    console.log("EngineEvents.WITHDRAWAL_RECONCILED: ", data)
    withdrawReconciled.post(data)
  })
  node.on(EngineEvents.WITHDRAWAL_RESOLVED, data => {
    console.log("EngineEvents.WITHDRAWAL_RESOLVED: ", data)
    withdrawResolved.post(data)
  })
  return {
    [EngineEvents.CONDITIONAL_TRANSFER_CREATED]: createdTransfer,
    [EngineEvents.CONDITIONAL_TRANSFER_RESOLVED]: resolvedTransfer,
    [EngineEvents.DEPOSIT_RECONCILED]: deposit,
    [EngineEvents.WITHDRAWAL_RECONCILED]: withdrawReconciled,
    [EngineEvents.WITHDRAWAL_RESOLVED]: withdrawResolved,
  }
}

async function refreshChannel(node: BrowserNode, oldChannel: any): Promise<FullChannelState> {
  const channelStateRes = await node.getStateChannel({
    channelAddress: oldChannel.channelAddress,
  })
  if (channelStateRes.isError) {
    throw channelStateRes.getError()
  }
  return channelStateRes.getValue() as FullChannelState
}

async function refreshBalance(
  node: BrowserNode,
  oldChannel: FullChannelState,
  assetId: string,
  participant: "alice" | "bob",
) {
  const channel = await refreshChannel(node, oldChannel)
  return getBalanceForAssetId(channel, assetId, participant)
}

async function handleNodeResponse(channel: FullChannelState, nodeResponsePromise: Promise<any>) {
  // try normal handling instead
  const resolved = await nodeResponsePromise
  if (resolved.isError) {
    throw resolved.getError()
  }
  console.log(`nodeResponse: `, resolved.getValue())

  // make sure tx is sent
  const resolvedHash = resolved.getValue().transactionHash
  if (resolvedHash) {
    const receipt = await chainJsonProviders[channel.networkContext.chainId].waitForTransaction(
      resolvedHash!
    )
    console.log("nodeResponse tx receipt: ", receipt)
  }
}


// status helper
const initStatus = (updateStatus?: Function, initialStatus?: Execution,) => {
  const status = initialStatus || deepClone(emptyExecution)
  const update = updateStatus || console.log
  update(status)
  return { status, update }
}

const createAndPushProcess = (updateStatus: Function, status: Execution, message: string, params?: object) => {
  const newProcess: Process = {
    startedAt: Date.now(),
    message: message,
    status: 'PENDING',
  }
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      newProcess[key] = value
    }
  }

  status.status = 'PENDING'
  status.process.push(newProcess)
  updateStatus(status)
  return newProcess
}

const setStatusFailed = (updateStatus: Function, status: Execution, currentProcess: Process, params?: object) => {
  status.status = 'FAILED'
  currentProcess.status = 'FAILED'
  currentProcess.failedAt = Date.now()
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      currentProcess[key] = value
    }
  }

  updateStatus(status)
}

const setStatusDone = (updateStatus: Function, status: Execution, currentProcess: Process, params?: object) => {
  currentProcess.status = 'DONE'
  currentProcess.doneAt = Date.now()
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      currentProcess[key] = value
    }
  }

  updateStatus(status)
}


// public helpers
export const getChannelAddress = async (node: BrowserNode, chainId: number) => {
  const channel = await getChannelForChain(node, chainId)
  return channel.channelAddress
}

export const getChannelBalances = async (node: BrowserNode, chainId: number) => {
  const channel = await getChannelForChain(node, chainId)

  const alice: { [k: string]: any } = {}
  const bob: { [k: string]: any } = {}

  channel.assetIds.forEach((value: string, index: number) => {
    alice[value.toLowerCase()] = channel.balances[index].amount[0]
    bob[value.toLowerCase()] = channel.balances[index].amount[1]
  })

  return {
    chainId: chainId,
    channelAddress: channel.channelAddress,
    alice,
    bob,
  }
}

export const reconcileDeposit = async (node: BrowserNode, chainId: number, token: string) => {
  const channel = await getChannelForChain(node, chainId)

  const depositRes = await node.reconcileDeposit({
    channelAddress: channel.channelAddress,
    assetId: token,
  })
  if (depositRes.isError) {
    throw depositRes.getError()
  }
  console.log(depositRes)
}


// public triggers
export const triggerDeposit = async (node: BrowserNode, signer: providers.JsonRpcSigner, chainId: number, tokenId: string, amount: ethers.BigNumberish, updateStatus: Function, initialStatus?: any) => {
  return deposit(node, await getChannelForChain(node, chainId), signer, tokenId, amount, updateStatus, initialStatus)
}
async function deposit(node: BrowserNode, channel: FullChannelState, signer: any, token: string, amount: ethers.BigNumberish, updateStatus?: Function, initialStatus?: Execution) {
  // setup
  const { status, update } = initStatus(updateStatus, initialStatus)

  // Ask user to transfer to channel
  // -> set status
  const approveProcess = createAndPushProcess(update, status, 'Approve Transaction')

  // -> start transaction
  let tx
  try {
    tx =
      token === AddressZero
        ? await signer.sendTransaction({
          to: channel.channelAddress,
          value: BigNumber.from(amount).toHexString(),
        })
        : await new Contract(token, ERC20Abi, signer).transfer(channel.channelAddress, amount);
  } catch (e) {
    setStatusFailed(update, status, approveProcess)
    throw e
  }

  // -> set status
  setStatusDone(update, status, approveProcess, { transaction: tx.hash })

  // Wait for transaction
  // -> set status
  const waitingProcess = createAndPushProcess(update, status, 'Wait for Transaction', { transaction: tx.hash })

  // -> waiting...
  try {
    const receipt: ContractReceipt = await tx.wait()
    // TODO: set used fees
    console.log('receipt: status', receipt.status, 'gasUsed', receipt.gasUsed.toString())
  } catch (e) {
    setStatusFailed(update, status, waitingProcess)
    throw e
    // TODO: try again with new id
    // if (error.replacement) {
    //   console.log('replacement', error.replacement)
    // } else {
    //   throw error
    // }
  }
  // -> set status
  setStatusDone(update, status, waitingProcess)

  // claim transaction
  // -> set status
  const claimProcess = createAndPushProcess(update, status, 'Claim Transfer')

  // -> claiming
  let depositRes
  try {
    depositRes = await node.reconcileDeposit({
      channelAddress: channel.channelAddress,
      assetId: token,
    })
  } catch (e) {
    setStatusFailed(update, status, claimProcess)
    throw e
  }

  if (depositRes.isError) {
    setStatusFailed(update, status, claimProcess)
    throw depositRes.getError()
  }

  // -> set status
  status.status = 'DONE'
  // TODO: set final amounts
  setStatusDone(update, status, claimProcess)

  // DONE
  return status
}

export const triggerSwap = async (node: BrowserNode, chainId: number, path: Array<string>, fromTokenId: string, toTokenId: string, amount: ethers.BigNumberish, updateStatus: Function, initialStatus?: Execution) => {
  const channel = await getChannelForChain(node, chainId)
  if (!amount) {
    amount = getBalanceForAssetId(channel, fromTokenId, 'bob')
  }
  return swapInChannel(getEvt(node), node, channel, amount.toString(), fromTokenId, toTokenId, path, updateStatus, initialStatus)
}
async function swapInChannel(evt: EvtContainer, node: BrowserNode, channel: FullChannelState, amount: string, tokenA: string, tokenB: string, path: Array<string>, updateStatus?: Function, initialStatus?: Execution) {
  // setup
  const { status, update } = initStatus(updateStatus, initialStatus)

  // Define Swap
  // -> set status
  const defineProcess = createAndPushProcess(update, status, 'Define Swap')

  // -> defining
  const helperContract = new Contract(
    withdrawHelpers[channel.networkContext.chainId],
    UniswapWithdrawHelper.abi,
    chainJsonProviders[channel.networkContext.chainId]
  )
  const swapDataOptions = {
    amountIn: amount,
    amountOutMin: 1, // TODO: maybe change this, but this will make the swap always succeed
    router: uniswapRouters[channel.networkContext.chainId],
    to: channel.channelAddress,
    tokenA,
    tokenB,
    path,
  }
  const swapData = await helperContract.getCallData(swapDataOptions)

  const withdrawOptions = {
    assetId: tokenA,
    amount: amount,
    channelAddress: channel.channelAddress,
    callData: swapData,
    callTo: withdrawHelpers[channel.networkContext.chainId],
    recipient: withdrawHelpers[channel.networkContext.chainId],
  }

  // -> set status
  setStatusDone(update, status, defineProcess, { swapDataOptions, withdrawOptions })

  // trigger swap by withdrawing coins to contract
  // -> set status
  const withdrawProcess = createAndPushProcess(update, status, 'Withdraw to Swap Contract')

  // -> withdrawing
  const toSwapWithdrawPromise = node.withdraw(withdrawOptions)

  // TODO: handle if transactions fails (eg. in DEX (invalid Path))
  try {
    await evt.WITHDRAWAL_RESOLVED.waitFor(30_000)
  } catch (e) {
    try {
      await handleNodeResponse(channel, toSwapWithdrawPromise)
    } catch (e) {
      setStatusFailed(update, status, withdrawProcess)
      throw e
    }
  }

  // -> set status
  setStatusDone(update, status, withdrawProcess)

  // Reconcile swapped tokens to stateChannel
  // -> set status
  const reconcileProcess = createAndPushProcess(update, status, 'Claim Swapped Token')

  // -> try to reconcile
  let postSwapBalance: string = '0'
  let retries = 0
  const MAX_RETRIES = 50
  while (postSwapBalance === '0' && retries < MAX_RETRIES) {
    // reconcile deposit on toChain
    const depositRes = await node.reconcileDeposit({
      channelAddress: channel.channelAddress,
      assetId: tokenB,
    })
    if (depositRes.isError) {
      throw depositRes.getError()
    }
    postSwapBalance = await refreshBalance(node, channel, tokenB, 'bob')
    retries++
  }

  // -> set status
  if (postSwapBalance === '0') {
    setStatusFailed(update, status, reconcileProcess)
    throw new Error('Unable to access swapped tokens')
  } else {
    // TODO: set final amounts
    setStatusDone(update, status, reconcileProcess)

    // DONE
    return status
  }
}

export const triggerTransfer = async (node: BrowserNode, fromChainId: number, toChainId: number, fromTokenId: string, toTokenId: string, amount: ethers.BigNumberish, updateStatus: Function, initialStatus?: Execution) => {
  const fromChannel = await getChannelForChain(node, fromChainId)
  const toChannel = await getChannelForChain(node, toChainId)
  if (!amount) {
    amount = getBalanceForAssetId(fromChannel, fromTokenId, 'bob')
  }
  return transferBetweenChains(node, fromChannel, fromTokenId, toChannel, toTokenId, amount, updateStatus, initialStatus)
}
async function transferBetweenChains(node: BrowserNode, fromChannel: FullChannelState, fromToken: string, toChannel: FullChannelState, toToken: string, amount: ethers.BigNumberish, updateStatus?: Function, initialStatus?: Execution) {
  // setup
  const { status, update } = initStatus(updateStatus, initialStatus)

  // create Transfer
  // -> set status
  const startProcess = createAndPushProcess(update, status, 'Create Transfer')

  // -> creating
  const preImage = getRandomBytes32()
  const lockHash = utils.soliditySha256(['bytes32'], [preImage])
  const routingId = getRandomBytes32()

  try {
    await node.conditionalTransfer({
      publicIdentifier: node.publicIdentifier,
      amount: amount.toString(),
      assetId: fromToken,
      channelAddress: fromChannel.channelAddress,
      type: TransferNames.HashlockTransfer,
      details: {
        lockHash,
        expiry: '0',
      },
      meta: {
        routingId,
      },
      recipient: node.publicIdentifier,
      recipientChainId: toChannel.networkContext.chainId,
      recipientAssetId: toToken,
    })
  } catch (e) {
    setStatusFailed(update, status, startProcess)
    throw e
  }

  // -> set status
  setStatusDone(update, status, startProcess)

  // wait for transfer on receiving chain
  // -> set status
  const waitProcess = createAndPushProcess(update, status, 'Wait for Transfer on Receiving Chain')

  // -> waiting
  let toTransferData
  try {
    toTransferData = await new Promise<ConditionalTransferCreatedPayload>(
      (res) => {
        node.on(
          'CONDITIONAL_TRANSFER_CREATED',
          (data: ConditionalTransferCreatedPayload) => {
            console.log('CONDITIONAL_TRANSFER_CREATED data: ', {
              data,
              toChannel,
            })
            if (data.channelAddress === toChannel.channelAddress) {
              res(data)
            } else {
              console.log(
                `Got transfer for ${data.channelAddress}, waiting for ${toChannel.channelAddress}`
              )
            }
          }
        )
      }
    )
  } catch (e) {
    setStatusFailed(update, status, waitProcess)
    throw e
  }

  // -> set status
  setStatusDone(update, status, waitProcess)

  // resolve transfer
  // -> set status
  const resolveProcess = createAndPushProcess(update, status, 'Resolve Transfer')

  // -> resolving
  let resolveRes
  try {
    resolveRes = await node.resolveTransfer({
      channelAddress: toChannel.channelAddress,
      transferResolver: {
        preImage,
      },
      transferId: toTransferData.transfer.transferId,
    })
    if (resolveRes.isError) {
      throw resolveRes.getError()
    }
  } catch (e) {
    setStatusFailed(update, status, resolveProcess)
    throw e
  }

  // -> set status
  // TODO: set final amounts
  // const resolve = resolveRes.getValue()
  // console.log("resolve: ", resolve)
  status.status = 'DONE'
  setStatusDone(update, status, resolveProcess)

  // DONE
  return status
}

export const triggerWithdraw = async (node: BrowserNode, chainId: number, recipient: string, tokenId: string, amount: ethers.BigNumberish, updateStatus: Function, initialStatus?: Execution) => {
  const channel = await getChannelForChain(node, chainId)
  if (!amount) {
    amount = getBalanceForAssetId(channel, tokenId, 'bob')
  }
  return withdrawFromChannel(getEvt(node), node, channel, recipient, tokenId, amount, updateStatus, initialStatus)
}
async function withdrawFromChannel(evt: EvtContainer, node: BrowserNode, channel: FullChannelState, recipient: string, token: string, amount: ethers.BigNumberish, updateStatus?: Function, initialStatus?: Execution) {
  // setup
  const { status, update } = initStatus(updateStatus, initialStatus)

  // Withdraw
  // -> set status
  const withdrawProcess = createAndPushProcess(update, status, 'Withdraw')

  // -> withdrawing
  const withdrawPromise = node.withdraw({
    assetId: token,
    amount: amount.toString(),
    channelAddress: channel.channelAddress,
    publicIdentifier: channel.bobIdentifier,
    recipient,
  })

  try {
    await evt.WITHDRAWAL_RESOLVED.waitFor(30_000)
  } catch {
    try {
      await handleNodeResponse(channel, withdrawPromise)
    } catch (e) {
      setStatusFailed(update, status, withdrawProcess)
      throw e
    }
  }

  // -> set status
  status.status = 'DONE'
  // TODO: set final amounts
  // TODO: add transaction
  setStatusDone(update, status, withdrawProcess)

  // DONE
  return status
}
