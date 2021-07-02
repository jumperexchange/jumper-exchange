import { BrowserNode } from "@connext/vector-browser-node"
import { ConditionalTransferCreatedPayload, ConditionalTransferResolvedPayload, DepositReconciledPayload, EngineEvents, ERC20Abi, FullChannelState, TransferNames, WithdrawalReconciledPayload, WithdrawalResolvedPayload } from "@connext/vector-types"
import { getBalanceForAssetId, getRandomBytes32 } from "@connext/vector-utils"
import { BigNumber } from "@ethersproject/bignumber"
import { JsonRpcProvider } from "@ethersproject/providers"
import { Contract, ContractReceipt, ethers, providers, utils } from "ethers"
import { AddressZero } from "@ethersproject/constants";
import { Evt } from "evt"
import UniswapWithdrawHelper from "./ABI/UniswapWithdrawHelper.json" // import UniswapWithdrawHelper from "@connext/vector-withdraw-helpers/artifacts/contracts/UniswapWithdrawHelper/UniswapWithdrawHelper.sol/UniswapWithdrawHelper.json"
import { emptyExecution, Execution, Process } from '../types/server'

const connext = "vector892GMZ3CuUkpyW8eeXfW2bt5W73TWEXtgV71nphXUXAmpncnj8" // referenced in https://docs.connext.network/connext-mainnet
const xpollinate = "vector52rjrwRFUkaJai2J4TrngZ6doTUXGZhizHmrZ6J15xVv4YFgFC" // used by https://www.xpollinate.io/
const routerPublicIdentifier = xpollinate || connext

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
  137: "0xD1CC3E4b9c6d0cb0B9B97AEde44d4908FF0be507",
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


// public helpers
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
  const status = initialStatus || JSON.parse(JSON.stringify(emptyExecution))
  const update = updateStatus || console.log
  update(status)

  // Ask user to transfer to channel
  // -> set status
  status.status = 'PENDING'
  const approveProcess : Process = {
    startedAt: Date.now(),
    message: 'Approve transaction',
    status: 'PENDING',
  }
  status.process.push(approveProcess)
  update(status)

  // -> start transaction
  const tx =
    token === AddressZero
      ? await signer.sendTransaction({
        to: channel.channelAddress,
        value: BigNumber.from(amount).toHexString(),
      })
    : await new Contract(token, ERC20Abi, signer).transfer(channel.channelAddress, amount);

  // -> set status
  approveProcess.status = 'DONE'
  approveProcess.doneAt = Date.now()
  approveProcess.transaction = tx.hash
  update(status)

  // Wait for transaction
  // -> set status
  status.status = 'PENDING'
  const waitingProcess : Process = {
    startedAt: Date.now(),
    message: 'Waiting for transaction',
    status: 'PENDING',
    transaction: tx.hash,
  }
  status.process.push(waitingProcess)
  update(status)

  // -> waiting...
  try {
    const receipt : ContractReceipt = await tx.wait()
    // TODO: set used fees
    console.log('receipt: status', receipt.status, 'gasUsed', receipt.gasUsed.toString())
  } catch (error) {
    console.error(error)
    if (error.replacement) {
      console.log('replacement', error.replacement)
      // TODO: try again with new id
    } else {
      throw error
    }
  }
  // -> set status
  waitingProcess.status = 'DONE'
  waitingProcess.doneAt = Date.now()
  update(status)

  // claim transaction
  // -> set status
  status.status = 'PENDING'
  const claimProcess : Process = {
    startedAt: Date.now(),
    message: 'Claiming transfer',
    status: 'PENDING',
  }
  status.process.push(claimProcess)
  update(status)

  // -> claiming
  const depositRes = await node.reconcileDeposit({
    channelAddress: channel.channelAddress,
    assetId: token,
  })
  if (depositRes.isError) {
    status.status = 'FAILED'
    claimProcess.status = 'FAILED'
    claimProcess.failedAt = Date.now()
    update(status)
    throw depositRes.getError()
  }

  // -> set status
  status.status = 'DONE'
  claimProcess.status = 'DONE'
  claimProcess.doneAt = Date.now()
  // TODO: set final amounts
  update(status)

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
  const status = initialStatus || JSON.parse(JSON.stringify(emptyExecution))
  const update = updateStatus || console.log
  update(status)

  // Define Swap
  // -> set status
  status.status = 'PENDING'
  const defineProcess : Process = {
    startedAt: Date.now(),
    message: 'Define Swap',
    status: 'PENDING',
  }
  status.process.push(defineProcess)
  update(status)

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
  defineProcess.swapDataOptions = swapDataOptions
  const swapData = await helperContract.getCallData(swapDataOptions)

  const withdrawOptions = {
    assetId: tokenA,
    amount: amount,
    channelAddress: channel.channelAddress,
    callData: swapData,
    callTo: withdrawHelpers[channel.networkContext.chainId],
    recipient: withdrawHelpers[channel.networkContext.chainId],
  }
  defineProcess.withdrawOptions = withdrawOptions

  // -> set status
  defineProcess.status = 'DONE'
  defineProcess.doneAt = Date.now()
  update(status)


  // trigger swap by withdrawing coins to contract
  // -> set status
  status.status = 'PENDING'
  const withdrawProcess : Process = {
    startedAt: Date.now(),
    message: 'Withdraw to swap contract',
    status: 'PENDING',
  }
  status.process.push(withdrawProcess)
  update(status)

  // -> withdrawing
  const toSwapWithdrawPromise = node.withdraw(withdrawOptions)

  // TODO: handle if transactions fails (eg. in DEX (invalid Path))
  try {
    await evt.WITHDRAWAL_RESOLVED.waitFor(30_000)
  } catch (e) {
    console.error(e)
    try {
      await handleNodeResponse(channel, toSwapWithdrawPromise)
    } catch (e) {
      console.error(e)
    }
  }

  // -> set status
  withdrawProcess.status = 'DONE'
  withdrawProcess.doneAt = Date.now()
  update(status)


  // Reconcile swapped tokens to stateChannel
  // -> set status
  status.status = 'PENDING'
  const reconcileProcess : Process = {
    startedAt: Date.now(),
    message: 'Deposit swapped tokens to StateChannel',
    status: 'PENDING',
  }
  status.process.push(reconcileProcess)
  update(status)

  // -> try to reconcile
  let postSwapBalance: string = '0'
  let retries = 0
  const MAX_RETRIES = 5
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
    status.status = 'FAILED'
    reconcileProcess.status = 'FAILED'
    reconcileProcess.failedAt = Date.now()
    update(status)

    // FAILED
    throw new Error('Unable to access swapped tokens')
  } else {
    status.status = 'DONE'
    reconcileProcess.status = 'DONE'
    reconcileProcess.doneAt = Date.now()
    // TODO: set final amounts
    update(status)

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
  const status = initialStatus || JSON.parse(JSON.stringify(emptyExecution))
  const update = updateStatus || console.log
  update(status)

  // create Transfer
  // -> set status
  status.status = 'PENDING'
  const startProcess : Process = {
    startedAt: Date.now(),
    message: 'creating Transfer',
    status: 'PENDING',
  }
  status.process.push(startProcess)
  update(status)

  // -> creating
  const preImage = getRandomBytes32()
  const lockHash = utils.soliditySha256(['bytes32'], [preImage])
  const routingId = getRandomBytes32()

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

  // -> set status
  startProcess.doneAt = Date.now()
  startProcess.status = 'DONE'
  update(status)


  // wait for transfer on receiving chain
  // -> set status
  status.status = 'PENDING'
  const waitProcess : Process = {
    startedAt: Date.now(),
    message: 'Wait for transfer on receiving chain',
    status: 'PENDING',
  }
  status.process.push(waitProcess)
  update(status)

  // -> waiting
  const toTransferData = await new Promise<ConditionalTransferCreatedPayload>(
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

  // -> set status
  waitProcess.doneAt = Date.now()
  waitProcess.status = 'DONE'
  update(status)


  // resolve transfer
  // -> set status
  status.status = 'PENDING'
  const resolveProcess : Process = {
    startedAt: Date.now(),
    message: 'Resolve Transfer',
    status: 'PENDING',
  }
  status.process.push(resolveProcess)
  update(status)

  // -> resolving
  const resolveRes = await node.resolveTransfer({
    channelAddress: toChannel.channelAddress,
    transferResolver: {
      preImage,
    },
    transferId: toTransferData.transfer.transferId,
  })
  if (resolveRes.isError) {
    throw resolveRes.getError()
  }
  const resolve = resolveRes.getValue()
  console.log("resolve: ", resolve)

  // -> set status
  status.status = 'DONE'
  resolveProcess.status = 'DONE'
  resolveProcess.doneAt = Date.now()
  // TODO: set final amounts
  update(status)

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
  const status = initialStatus || JSON.parse(JSON.stringify(emptyExecution))
  const update = updateStatus || console.log
  update(status)

  // Withdraw
  // -> set status
  status.status = 'PENDING'
  const withdrawProcess : Process = {
    startedAt: Date.now(),
    message: 'Withdrawing',
    status: 'PENDING',
  }
  status.process.push(withdrawProcess)
  update(status)

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
    } catch (error) {
      // -> set status
      status.status = 'FAILED'
      withdrawProcess.status = 'FAILED'
      withdrawProcess.failedAt = Date.now()
      update(status)
      throw error
    }
  }

  // -> set status
  status.status = 'DONE'
  withdrawProcess.status = 'DONE'
  withdrawProcess.doneAt = Date.now()
  // TODO: set final amounts
  // TODO: add transaction
  update(status)

  // DONE
  return status
}
