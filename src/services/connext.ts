import { BrowserNode } from "@connext/vector-browser-node"
import { ConditionalTransferCreatedPayload, ERC20Abi, FullChannelState, TransferNames, EngineEvents, ConditionalTransferResolvedPayload, DepositReconciledPayload, WithdrawalReconciledPayload, WithdrawalResolvedPayload } from "@connext/vector-types"
import { Contract, utils, ethers, providers } from "ethers"
import UniswapWithdrawHelper from "./ABI/UniswapWithdrawHelper.json" // import UniswapWithdrawHelper from "@connext/vector-withdraw-helpers/artifacts/contracts/UniswapWithdrawHelper/UniswapWithdrawHelper.sol/UniswapWithdrawHelper.json"
import { JsonRpcProvider } from "@ethersproject/providers"
import { getBalanceForAssetId, getRandomBytes32 } from "@connext/vector-utils"
import { BigNumber } from "@ethersproject/bignumber"
import { Evt } from "evt"

const connext = "vector892GMZ3CuUkpyW8eeXfW2bt5W73TWEXtgV71nphXUXAmpncnj8" // referenced in https://docs.connext.network/connext-mainnet
const xpollinate =  "vector52rjrwRFUkaJai2J4TrngZ6doTUXGZhizHmrZ6J15xVv4YFgFC" // used by https://www.xpollinate.io/
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
  56: "0xad654314d3F6590243602D14b4089332EBb5227D",
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

export const initNode = async () => {
  const node = new BrowserNode({
    routerPublicIdentifier,
    chainProviders,
  })
  await node.init()

  return node
}

export const getChannelForChain = async (node: BrowserNode, chainId: number) => {
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

export type EvtContainer = {
  [EngineEvents.CONDITIONAL_TRANSFER_CREATED]: Evt<ConditionalTransferCreatedPayload>
  [EngineEvents.CONDITIONAL_TRANSFER_RESOLVED]: Evt<ConditionalTransferResolvedPayload>
  [EngineEvents.DEPOSIT_RECONCILED]: Evt<DepositReconciledPayload>
  [EngineEvents.WITHDRAWAL_RECONCILED]: Evt<WithdrawalReconciledPayload>
  [EngineEvents.WITHDRAWAL_RESOLVED]: Evt<WithdrawalResolvedPayload>
}

export const createEvtContainer = (node: BrowserNode): EvtContainer => {
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

async function deposit(node: BrowserNode, channel: any, signer: any, token: string, amount: string) {
  // Ask user to transfer to channel
  const fromTokenContract = new Contract(
    token,
    ERC20Abi,
    signer
  )
  const tx = await fromTokenContract.transfer(
    channel.channelAddress,
    amount
  )
  // setLog(`(1/7) Starting swap`, { tx: tx.hash, chainId: fromChainId })

  // Confirmed
  await tx.wait()
  // const receipt = await tx.wait()
  // reconcile deposit on from chain
  // const e = {} as EngineEvent
  // node.waitFor<EngineEvent>(e, 300_000, payload => {
  //   console.log(payload)
  // })
  const depositRes = await node.reconcileDeposit({
    channelAddress: channel.channelAddress,
    assetId: token,
  })
  if (depositRes.isError) {
    throw depositRes.getError()
  }
  console.log(`INFO: Deposit complete`)
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

async function swapInChannel(evt: EvtContainer, node: BrowserNode, channel: FullChannelState, amount: string, tokenA: string, tokenB: string) {
  // define swap
  const helperContract = new Contract(
    withdrawHelpers[channel.networkContext.chainId],
    UniswapWithdrawHelper.abi,
    chainJsonProviders[channel.networkContext.chainId]
  )
  const swapDataOption = {
    amountIn: amount,
    amountOutMin: 1, // TODO: maybe change this, but this will make the swap always succeed
    router: uniswapRouters[channel.networkContext.chainId],
    to: channel.channelAddress,
    tokenA,
    tokenB,
    path: [tokenA, tokenB],
  }
  console.log('swapDataOption', swapDataOption)
  const swapData = await helperContract.getCallData(swapDataOption)

  // trigger swap by withdrawing coins to contract
  const withdrawOptions = {
    assetId: tokenA,
    amount: amount,
    channelAddress: channel.channelAddress,
    callData: swapData,
    callTo: withdrawHelpers[channel.networkContext.chainId],
    recipient: withdrawHelpers[channel.networkContext.chainId],
  }
  console.log('withdrawOptions', withdrawOptions)
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

  let postSwapBalance: string = '0'
  while (postSwapBalance === '0') {
    // reconcile deposit on toChain
    const depositRes = await node.reconcileDeposit({
      channelAddress: channel.channelAddress,
      assetId: tokenB,
    })
    if (depositRes.isError) {
      throw depositRes.getError()
    }
    postSwapBalance = await refreshBalance(node, channel, tokenB, 'bob')
  }
}

async function transferBetweenChains(node: BrowserNode, fromChannel: any, fromToken: string, toChannel: any, toToken: string, amount: string) {
  // generate Secrets
  const preImage = getRandomBytes32()
  const lockHash = utils.soliditySha256(["bytes32"], [preImage])
  const routingId = getRandomBytes32()

  await node.conditionalTransfer({
    publicIdentifier: node.publicIdentifier,
    amount: amount,
    assetId: fromToken,
    channelAddress: fromChannel.channelAddress,
    type: TransferNames.HashlockTransfer,
    details: {
      lockHash,
      expiry: "0",
    },
    meta: {
      routingId,
    },
    recipient: node.publicIdentifier,
    recipientChainId: toChannel.networkContext.chainId,
    recipientAssetId: toToken,
  })

  // await transfer event
  console.log(
    `Waiting for transfer creation on channel ${toChannel.channelAddress}`
  )
  const toTransferData = await new Promise<ConditionalTransferCreatedPayload>(
    (res) => {
      node.on(
        "CONDITIONAL_TRANSFER_CREATED",
        (data: ConditionalTransferCreatedPayload) => {
          console.log("CONDITIONAL_TRANSFER_CREATED data: ", {
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

  // resolve transfer
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
}

async function withdrawFromChannel(evt: EvtContainer, node: BrowserNode, channel: FullChannelState, recipient: string, token: string, amount: string) {
  const withdrawPromise = node.withdraw({
    assetId: token,
    amount: amount,
    channelAddress: channel.channelAddress,
    publicIdentifier: channel.bobIdentifier,
    recipient,
  })

  try {
    await evt.WITHDRAWAL_RESOLVED.waitFor(30_000)
  } catch {
    await handleNodeResponse(channel, withdrawPromise)
  }
}

export const getChannelBalances = async (node: BrowserNode, chainId: number) => {
  const channel = await getChannelForChain(node, chainId)

  const alice: { [k: string]: any } = {}
  const bob: { [k: string]: any } = {}

  channel.assetIds.forEach((value: string, index: number) => {
    alice[value] = channel.balances[index].amount[0]
    bob[value] = channel.balances[index].amount[1]
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


export const swap = async (
  swapAmount: ethers.BigNumberish,
  fromToken: string,
  fromTokenPair: string,
  toToken: string,
  toTokenPair: string,
  fromChainId: number,
  toChainId: number,
  node: BrowserNode,
  signer: providers.JsonRpcSigner
) => {

  const signerAddress = await signer.getAddress()
  let fromChannel = await getChannelForChain(node, fromChainId)
  let toChannel = await getChannelForChain(node, toChainId)

  // const network = await provider.getNetwork()
  // user (provider) has to be on chain where transfers start
  // if (network.chainId !== fromChainId) {
  //   throw new Error(
  //     `Wrong network, expected chainId ${fromChainId}, got ${network.chainId}`
  //   )
  // }

  const evts = createEvtContainer(node)

  const balance = getBalanceForAssetId(fromChannel, fromToken, "bob")
  console.log('INFO: current fromToken Balance on fromChannel:', balance)
  console.log('INFO: current fromTokenPair Balance on fromChannel:', getBalanceForAssetId(fromChannel, fromTokenPair, "bob"))
  console.log('INFO: current toToken Balance on toChannel:', getBalanceForAssetId(toChannel, toToken, "bob"))
  console.log('INFO: current toTokenPair Balance on toChannel:', getBalanceForAssetId(toChannel, toTokenPair, "bob"))

  // ## Deposit fromToken in the channel
  if (BigNumber.from(balance).lt(swapAmount)) {
    console.log("INFO: >> need to load more on channel")

    await deposit(node, fromChannel, signer, fromToken, swapAmount.toString())

    // fromChannel = await refreshChannel(node, fromChannel)
    const balance = await refreshBalance(node, fromChannel, fromToken, "bob")
    console.log('INFO: fromToken Balance on fromChannel:', balance)
  } else {
    // setLog("(2/7) Balance in channel, sending now.")
    console.log("INFO: >> that's enough")
  }

  // // ## Swap on fromChain
  console.log('INFO: swap start')
  await swapInChannel(evts, node, fromChannel, swapAmount.toString(), fromToken, fromTokenPair)
  console.log('INFO: swap done')

  // refresh channel to get new balance
  // fromChannel = await refreshChannel(node, fromChannel)
  const postFromSwapBalance = await refreshBalance(node, fromChannel, fromTokenPair, "bob")
  console.log("postFromSwapBalance: ", postFromSwapBalance)


  // ## Transfer cross chain
  console.log('INFO: transfer start')
  await transferBetweenChains(node, fromChannel, fromTokenPair, toChannel, toToken, postFromSwapBalance)
  console.log('INFO: transfer done')

  // refresh channel to get new balance
  // toChannel = await refreshChannel(node, toChannel)
  const postCrossChainTransferBalance = await refreshBalance(node, toChannel, toToken, "bob")
  console.log("postCrossChainTransferBalance: ", postCrossChainTransferBalance)


  // withdraw with swap data
  console.log('INFO: swap start')
  await swapInChannel(evts, node, toChannel, postCrossChainTransferBalance, toToken, toTokenPair)
  console.log('INFO: swap done')

  // refresh channel to get new balance
  // toChannel = await refreshChannel(node, toChannel)
  const posttoSwapBalance = await refreshBalance(node, toChannel, toTokenPair, "bob")
  console.log("posttoSwapBalance: ", posttoSwapBalance)


  // withdraw to address
  console.log('INFO: withdraw start')
  await withdrawFromChannel(evts, node, toChannel, signerAddress, toTokenPair, posttoSwapBalance)
  console.log('INFO: withdraw done')

  console.log(`To withdraw complete`)

  console.log('INFO: current fromToken Balance on fromChannel:', await refreshBalance(node, fromChannel, fromToken, "bob"))
  console.log('INFO: current fromTokenPair Balance on fromChannel:', await refreshBalance(node, fromChannel, fromTokenPair, "bob"))
  console.log('INFO: current toToken Balance on toChannel:', await refreshBalance(node, toChannel, toToken, "bob"))
  console.log('INFO: current toTokenPair Balance on toChannel:', await refreshBalance(node, toChannel, toTokenPair, "bob"))
}



// TODO: can be used on serverside to find routers / get liquidity
// export const listenToMetrics = async (callback : any) => {
//   const signer = getRandomChannelSigner()
//   const messaging = new NatsBasicMessagingService({
//     messagingUrl: "https://messaging.connext.network",
//     signer,
//   })
//   await messaging.connect()
//   console.log("Connected to NATS.")
//   messaging.subscribe("*.*.metrics", (msg: any, err: any) => {
//     if (err) {
//       console.error("Uh oh: ", err)
//       return
//     }
//     console.log('got message', msg)
//     callback(msg)
//   })
// }

// Unused

// export const getOnchainBalance = async (
//   ethProvider: any,
//   assetId: string,
//   address: any
// ) => {
//   (window as any).constants = constants
//   (window as any).Contract = Contract
//   const balance =
//     assetId === constants.AddressZero
//       ? await ethProvider.getBalance(address)
//       : await new Contract(assetId, ERC20Abi, ethProvider).balanceOf(address)
//   return balance
// }

// export const getRouterCapacity = async (
//   ethProvider: JsonRpcProvider,
//   token: {
//     id: any
//     decimals: string | number | ethers.BigNumber | utils.Bytes
//   },
//   withdrawChannel: FullChannelState,
// ) => {

//   const routerOnchain = await getOnchainBalance(
//     ethProvider,
//     token.id,
//     withdrawChannel.alice
//   )

//   const routerOffchain = BigNumber.from(
//     getBalanceForAssetId(withdrawChannel, token.id, "bob")
//   )
//   return {
//     routerOnchainBalance: ethers.utils.formatUnits(routerOnchain, token.decimals),
//     routerOffchainBalacne: ethers.utils.formatUnits(routerOffchain, token.decimals),
//   }
// }

// export const verifyRouterCapacityForTransfer = async (
//   ethProvider: JsonRpcProvider,
//   toToken: {
//     id: any
//     decimals: string | number | ethers.BigNumber | utils.Bytes
//   },
//   withdrawChannel: FullChannelState,
//   transferAmount: any,
//   swap: { hardcodedRate: number }
// ) => {
//   return getRouterCapacity(ethProvider, toToken, withdrawChannel)
// }

// export const getRouterExitCapacity = async (node: BrowserNode, chainId: number, token: string, decimals: number, symbol: string) => {
//   const channel = await getChannelForChain(node, chainId)

//   const capacity = await getRouterCapacity(
//     chainJsonProviders[chainId],
//     {
//       id: token,
//       decimals: decimals,
//     }, // toAssetId
//     channel, // withdrawChannel
//   )

//   console.log(chainId, symbol, capacity.routerOnchainBalance)
// }

// export const getRouterBalances = async ({
//   fromChain,
//   toChain,
//   fromToken,
//   toToken,
//   node,
// }: any) => {
//   let { fromChannel, toChannel } = await getChannelsForChains(fromChain, toChain, node)
//   const preTransferBalance = getBalanceForAssetId(fromChannel, fromToken, "bob")
//   const postTransferBalance = getBalanceForAssetId(toChannel, toToken, "bob")
//   return {
//     preTransferBalance,
//     postTransferBalance,
//   }
// }

// export const withdraw = async (
//   node: BrowserNode,
//   assetId: any,
//   amount: any,
//   channelAddress: any,
//   recipient: string,
// ) => {
//   console.log("**** withdraw", {
//     assetId,
//     amount,
//     channelAddress,
//     recipient,
//   })
//   return await node.withdraw({
//     assetId,
//     amount,
//     channelAddress,
//     recipient,
//   })
// }
