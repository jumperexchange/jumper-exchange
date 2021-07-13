import { ArrowRightOutlined } from '@ant-design/icons';
import { getRandomBytes32, NxtpSdk } from '@connext/nxtp-sdk';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { Alert, Avatar, Button, Timeline, Tooltip, Typography } from 'antd';
import { providers } from 'ethers';
import pino from "pino";
import { useEffect, useState } from 'react';
import connextIcon from '../assets/icons/connext.png';
import oneinchIcon from '../assets/icons/oneinch.png';
import paraswapIcon from '../assets/icons/paraswap.png';
import * as connext from '../services/connext';
import { deepClone, formatTokenAmount } from '../services/utils';
import { ChainKey, Token } from '../types';
import { getChainById, getChainByKey } from '../types/lists';
import { CrossAction, DepositAction, emptyExecution, Execution, ParaswapAction, Process, SwapAction, SwapEstimate, TranferStep, WithdrawAction } from '../types/server';
import Clock from './Clock';
import StateChannelBalances from './StateChannelBalances';
import { injected } from './web3/connectors';


interface SwappingProps {
  route: Array<TranferStep>,
  updateRoute: Function,
}

const ADMIN_MODE = false

const SwappingNxtp = ({ route, updateRoute }: SwappingProps) => {
  const node = connext.getNode() // TODO: remove
  const [sdk, setSdk] = useState<NxtpSdk>()
  const [sdkChainId, setSdkChainId] = useState<number>()
  const [swapStartedAt, setSwapStartedAt] = useState<number>()
  const [swapDoneAt, setSwapDoneAt] = useState<number>()
  const [isSwapping, setIsSwapping] = useState<boolean>(false)
  const [swapDone, setSwapDone] = useState<boolean>(false)
  const [alerts, setAlerts] = useState<Array<JSX.Element>>([])

  let activeButton = null
  const { activate } = useWeb3React();
  const web3 = useWeb3React<Web3Provider>()

  useEffect(() => {
    const initializeConnext = async () => {
      if (!web3.library) return
      setAlerts([])

      const chainProviders: { [chainId: number]: providers.JsonRpcProvider } = {
        4: new providers.JsonRpcProvider(process.env.REACT_APP_RPC_URL_RINKEBY),
        5: new providers.JsonRpcProvider(process.env.REACT_APP_RPC_URL_GORLI),
      }
      const signer = web3.library.getSigner()

      try {
        const _sdk = await NxtpSdk.init(chainProviders, signer, pino({ level: "info" }))
        setSdkChainId(web3.chainId)
        setSdk(_sdk)

        // _sdk.attach(NxtpSdkEvents.SenderTransactionPrepared, (data) => {
        //   console.log("SenderTransactionPrepared:", data);
        //   // const { txData } = data;
        //   // const table = activeTransferTableColumns;
        //   // table.push({
        //   //   txData,
        //   //   status: NxtpSdkEvents.SenderTransactionPrepared,
        //   // });
        //   // setActiveTransferTableColumns(table);
        // });

        // _sdk.attach(NxtpSdkEvents.SenderTransactionFulfilled, (data) => {
        //   console.log("SenderTransactionFulfilled:", data);
        //   // setActiveTransferTableColumns(
        //   //   activeTransferTableColumns.filter((t) => t.txData.transactionId !== data.txData.transactionId),
        //   // );
        // });

        // _sdk.attach(NxtpSdkEvents.SenderTransactionCancelled, (data) => {
        //   console.log("SenderTransactionCancelled:", data);
        //   // setActiveTransferTableColumns(
        //   //   activeTransferTableColumns.filter((t) => t.txData.transactionId !== data.txData.transactionId),
        //   // );
        // });

        // _sdk.attach(NxtpSdkEvents.ReceiverTransactionPrepared, (data) => {
        //   console.log("ReceiverTransactionPrepared:", data);
        //   // const { txData } = data;
        //   // const index = activeTransferTableColumns.findIndex((col) => col.txData.transactionId === txData.transactionId);
        //   // activeTransferTableColumns[index].status = NxtpSdkEvents.ReceiverTransactionPrepared;
        //   // setActiveTransferTableColumns(activeTransferTableColumns);
        // });

        // _sdk.attach(NxtpSdkEvents.ReceiverTransactionFulfilled, (data) => {
        //   console.log("ReceiverTransactionFulfilled:", data);
        //   // setActiveTransferTableColumns(
        //   //   activeTransferTableColumns.filter((t) => t.txData.transactionId !== data.txData.transactionId),
        //   // );
        // });

        // _sdk.attach(NxtpSdkEvents.ReceiverTransactionCancelled, (data) => {
        //   console.log("ReceiverTransactionCancelled:", data);
        //   // setActiveTransferTableColumns(
        //   //   activeTransferTableColumns.filter((t) => t.txData.transactionId !== data.txData.transactionId),
        //   // );
        // });
        // const activeTxs = await _sdk.getActiveTransactions();
        // console.log('activeTxs', activeTxs)
      } catch (e) {
        setAlerts([
          <Alert
            message="Failed to connect to Connext"
            description="Please try again later."
            type="error"
            showIcon
          />
        ])
      }
    }

    if (sdkChainId !== web3.chainId) {
      initializeConnext()
    }
  }, [web3, sdkChainId])

  // Swap
  const updateStatus = (step: TranferStep, status: Execution) => {
    console.log('STATUS_CHANGE:', status)
    step.execution = status

    updateRoute(route)
  }

  const triggerDeposit = (step: TranferStep) => {
    if (!node || !web3.library) return
    const depositAction = step.action as DepositAction

    return connext.triggerDeposit(node, web3.library.getSigner(), depositAction.chainId, depositAction.token.id, BigInt(depositAction.amount), (status: Execution) => updateStatus(step, status))
  }

  const triggerSwap = (step: TranferStep) => {
    if (!node) return
    const swapAction = step.action as SwapAction
    const swapEstimate = step.estimate as SwapEstimate
    const chainId = getChainByKey(swapAction.chainKey).id // will be replaced by swapAction.chainId

    return connext.triggerSwap(node, chainId, swapEstimate.path, swapAction.fromToken.id, swapAction.toToken.id, swapAction.fromAmount, (status: Execution) => updateStatus(step, status))
  }

  const triggerParaswap = async (step: TranferStep) => {
    if (!web3.account || !web3.library) return
    const swapAction = step.action as ParaswapAction
    const chainId = getChainByKey(swapAction.chainKey).id // will be replaced by swapAction.chainId
    const fromAddress = web3.account
    const toAddress = swapAction.target === 'wallet' ? fromAddress : await connext.getChannelAddress(node, chainId)

    return connext.executeParaswap(chainId, web3.library.getSigner(), node, swapAction.fromToken.id, swapAction.toToken.id, swapAction.fromAmount, fromAddress, toAddress, (status: Execution) => updateStatus(step, status))
  }

  const triggerOneIchSwap = async (step: TranferStep) => {
    if (!web3.account || !web3.library) return
    const swapAction = step.action as ParaswapAction
    const chainId = getChainByKey(swapAction.chainKey).id // will be replaced by swapAction.chainId
    const fromAddress = web3.account
    const toAddress = swapAction.target === 'wallet' ? fromAddress : await connext.getChannelAddress(node, chainId)

    return connext.executeOneInchSwap(chainId, web3.library.getSigner(), node, swapAction.fromToken.id, swapAction.toToken.id, swapAction.fromAmount, fromAddress, toAddress, (status: Execution) => updateStatus(step, status))
  }

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

  const triggerTransfer = async (step: TranferStep) => {
    if (!sdk || !web3.account) return
    // status
    const { status, update } = initStatus((status: Execution) => updateStatus(step, status))
    const loginProcess = createAndPushProcess(update, status, 'Sign for Login')
    const approveProcess = createAndPushProcess(update, status, 'Approve Token')
    const submitProcess = createAndPushProcess(update, status, 'Submit Cross Chain Transfer')
    const proceedProcess = createAndPushProcess(update, status, 'Sign to Proceed Transfer')

    const crossAction = step.action as CrossAction
    const fromChainId = getChainByKey(crossAction.chainKey).id // will be replaced by crossAction.chainId
    const toChainId = getChainByKey(crossAction.toChainKey).id // will be replaced by crossAction.toChainId

    const transactionId = getRandomBytes32()
    const expiry = (Math.floor(Date.now() / 1000) + 3600 * 24 * 3).toString() // 3 days


    try {
      await sdk.transfer({
        router: undefined,
        sendingAssetId: crossAction.fromToken.id,
        sendingChainId: fromChainId,
        receivingChainId: toChainId,
        receivingAssetId: crossAction.toToken.id,
        receivingAddress: web3.account,
        amount: crossAction.amount.toString(),
        transactionId,
        expiry
        // callData?: string;
      })
    } catch (e) {
      console.log(e)
      setStatusFailed(update, status, loginProcess)
      setStatusFailed(update, status, approveProcess)
      setStatusFailed(update, status, submitProcess)
      setStatusFailed(update, status, proceedProcess)
      throw e
    }
    status.status = 'DONE'
    setStatusDone(update, status, loginProcess)
    setStatusDone(update, status, approveProcess)
    setStatusDone(update, status, submitProcess)
    setStatusDone(update, status, proceedProcess)
    return status
  }

  const triggerWithdraw = (step: TranferStep) => {
    if (!node || !web3.account) return
    const withdrawAction = step.action as WithdrawAction
    const chainId = getChainByKey(withdrawAction.chainKey).id // will be replaced by withdrawAction.chainId
    const recipient = withdrawAction.recipient ?? web3.account

    return connext.triggerWithdraw(node, chainId, recipient, withdrawAction.token.id, withdrawAction.amount, (status: Execution) => updateStatus(step, status))
  }

  // TODO: move in own component
  const switchChain = async (chainId: number) => {
    if (web3.chainId === chainId) return // already on right chain

    const ethereum = (window as any).ethereum
    if (typeof ethereum === 'undefined') return

    try {
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: getChainById(chainId).metamask?.chainId }],
      })
    } catch (error) {
      console.error(error)
      if (error.code === 4902) {
        addChain(chainId)
      }
    }
  }
  // TODO: move in own component
  const addChain = async (chainId: number) => {
    const ethereum = (window as any).ethereum
    if (typeof ethereum === 'undefined') return

    const params = getChainById(chainId).metamask
    try {
      await ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [params],
      })
    } catch (error) {
      console.error(`Error adding chain ${chainId}: ${error.message}`)
    }
  }
  // TODO: move in own component
  const addToken = async (token: Token) => {
    try {
      // wasAdded is a boolean. Like any RPC method, an error may be thrown.
      const wasAdded = await (window as any).ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20', // Initially only supports ERC20, but eventually more!
          options: {
            address: token.id, // The address that the token is at.
            symbol: token.symbol, // A ticker symbol or shorthand, up to 5 chars.
            decimals: token.decimals, // The number of decimals in the token
            image: token.logoURI, // A string url of the token logo
          },
        },
      });

      if (wasAdded) {
        console.log('Token Added');
      } else {
        console.log('Token not Added');
      }
    } catch (error) {
      console.log(error);
    }
  }

  const switchAndAddToken = async (token: Token) => {
    await switchChain(token.chainId)

    setTimeout(() => addToken(token), 100)
  }

  const parseWalletSteps = () => {
    const isDone = !!web3.account
    const isActive = !isDone

    const button = <Button type="primary" onClick={() => activate(injected)}>Connect with MetaMask</Button>
    const buttonText = <Typography.Text onClick={() => activate(injected)}>Connect with MetaMask</Typography.Text>

    if (isActive) {
      activeButton = button
    }

    const color = isDone ? 'green' : 'blue'
    return [
      <Timeline.Item key="wallet_left" color={color}>
        <h4 style={{ marginBottom: 0 }}>
          Connect your Wallet
        </h4>
      </Timeline.Item>,
      <Timeline.Item key="wallet_right" color={color}>
        {!web3.account ?
          buttonText
          :
          <p style={{ display: 'flex' }}>
            <Typography.Text type="success">
              Connected with {web3.account.substr(0, 4)}...
            </Typography.Text>
            <Typography.Text style={{ marginLeft: 'auto' }}>
              <Clock startedAt={1} successAt={1} />
            </Typography.Text>
          </p>
        }
      </Timeline.Item>,
    ]
  }

  const parseChainSteps = () => {
    const isDone = web3.chainId === route[0].action.chainId
    const isActive = !isDone && web3.account && !swapDone

    const chain = getChainById(route[0].action.chainId)
    const button = <Button type="primary" disabled={!web3.account} onClick={() => switchChain(route[0].action.chainId)}>Switch Chain to {chain.name}</Button>
    const buttonText = <Typography.Text onClick={() => switchChain(route[0].action.chainId)}>Switch Chain to {chain.name}</Typography.Text>
    if (isActive) {
      activeButton = button
    }

    const color = isDone ? 'green' : (isActive ? 'blue' : 'gray')
    return [
      <Timeline.Item key="chain_left" color={color}>
        <h4 style={{ marginBottom: 0 }}>
          Switch to {chain.name}
        </h4>
      </Timeline.Item>,
      <Timeline.Item key="chain_right" color={color}>
        {web3.chainId !== route[0].action.chainId ?
          buttonText
          :
          <p style={{ display: 'flex' }}>
            <Typography.Text type="success">
              On {chain.name} Chain
            </Typography.Text>
            <Typography.Text style={{ marginLeft: 'auto' }}>
              <Clock startedAt={1} successAt={1} />
            </Typography.Text>
          </p>
        }
      </Timeline.Item>,
    ]
  }

  const parseExecution = (execution?: Execution) => {
    if (!execution) {
      return []
    }

    return execution.process.map((process, index) => {
      const type = process.status === 'DONE' ? 'success' : (process.status === 'FAILED' ? 'danger' : undefined)
      return (
        <p key={index} style={{ display: 'flex' }}>
          <Typography.Text
            type={type}
            className={process.status === 'PENDING' ? 'flashing' : undefined}
          >
            {process.message}
          </Typography.Text>
          <Typography.Text style={{ marginLeft: 'auto' }}>
            <Clock startedAt={process.startedAt} successAt={process.doneAt} failedAt={process.failedAt} />
          </Typography.Text>
        </p>
      )
    })
  }

  const getChainAvatar = (chainKey: ChainKey) => {
    const chain = getChainByKey(chainKey)

    return (
      <Tooltip title={chain.name}>
        <Avatar size="small" src={chain.iconUrl} alt={chain.name}>{chain.name[0]}</Avatar>
      </Tooltip>
    )
  }

  const getExchangeAvatar = (chainKey: ChainKey) => {
    const chain = getChainByKey(chainKey)

    return (
      <Tooltip title={chain.exchange?.name}>
        <Avatar size="small" src={chain.exchange?.iconUrl} alt={chain.exchange?.name}></Avatar>
      </Tooltip>
    )
  }

  const connextAvatar = (
    <Tooltip title="Connext">
      <Avatar size="small" src={connextIcon} alt="Connext"></Avatar>
    </Tooltip>
  )

  const paraswapAvatar = (
    <Tooltip title="Paraswap">
      <Avatar size="small" src={paraswapIcon} alt="Paraswap"></Avatar>
    </Tooltip>
  )

  const oneinchAvatar = (
    <Tooltip title="1inch">
      <Avatar size="small" src={oneinchIcon} alt="1inch"></Avatar>
    </Tooltip>
  )

  const crossChain = route.filter(step => step.action.type === 'cross').length > 0
  const startSwapButton = <Button type="primary" onClick={() => startCrossChainSwap()}>{crossChain ? 'Start Cross Chain Swap' : 'Start Swap'}</Button>

  const parseStepToTimeline = (step: TranferStep, index: number) => {
    const executionSteps = parseExecution(step.execution)
    const color = step.execution && step.execution.status === 'DONE' ? 'green' : (step.execution ? 'blue' : 'gray')
    const hasFailed = step.execution && step.execution.status === 'FAILED'

    switch (step.action.type) {
      case 'deposit': {
        const triggerButton = <Button type="primary" disabled={!node || !web3.library || web3.chainId !== route[0].action.chainId} onClick={() => triggerStep(step)}>trigger Deposit</Button>
        return [
          <Timeline.Item key={index + '_left'} color={color}>
            <h4>Deposit from {web3.account ? web3.account.substr(0, 4) : '0x'}...</h4>
            <span>{formatTokenAmount(step.action.token, step.estimate?.fromAmount)}</span>
          </Timeline.Item>,
          <Timeline.Item key={index + '_right'} color={color}>
            {ADMIN_MODE && triggerButton}
            {step.execution && executionSteps}
            {hasFailed ? triggerButton : undefined}
          </Timeline.Item>,
        ]
      }

      case 'swap': {
        const triggerButton = <Button type="primary" disabled={!node} onClick={() => triggerStep(step)} >trigger Swap</Button>
        return [
          <Timeline.Item key={index + '_left'} color={color}>
            <h4>Swap on {getExchangeAvatar(step.action.chainKey)}</h4>
            <span>{formatTokenAmount(step.action.fromToken, step.estimate?.fromAmount)} <ArrowRightOutlined /> {formatTokenAmount(step.action.toToken, step.estimate?.toAmount)}</span>
          </Timeline.Item>,
          <Timeline.Item key={index + '_right'} color={color}>
            {!step.execution && ADMIN_MODE ? triggerButton : executionSteps}
            {hasFailed ? triggerButton : undefined}
          </Timeline.Item>,
        ]
      }

      case 'paraswap': {
        const triggerButton = <Button type="primary" disabled={!node} onClick={() => triggerParaswap(step)} >trigger Swap</Button>
        return [
          <Timeline.Item key={index + '_left'} color={color}>
            <h4>Swap{step.action.target === 'channel' ? ' & Deposit' : ''} on {paraswapAvatar}</h4>
            <span>{formatTokenAmount(step.action.fromToken, step.estimate?.fromAmount)} <ArrowRightOutlined /> {formatTokenAmount(step.action.toToken, step.estimate?.toAmount)}</span>
          </Timeline.Item>,
          <Timeline.Item key={index + '_right'} color={color}>
            {!step.execution && ADMIN_MODE ? triggerButton : executionSteps}
            {hasFailed ? triggerButton : undefined}
          </Timeline.Item>,
        ]
      }

      case '1inch': {
        const triggerButton = <Button type="primary" disabled={!node} onClick={() => triggerOneIchSwap(step)} >trigger Swap</Button>
        return [
          <Timeline.Item key={index + '_left'} color={color}>
            <h4>Swap{step.action.target === 'channel' ? ' & Deposit' : ''} on {oneinchAvatar}</h4>
            <span>{formatTokenAmount(step.action.fromToken, step.estimate?.fromAmount)} <ArrowRightOutlined /> {formatTokenAmount(step.action.toToken, step.estimate?.toAmount)}</span>
          </Timeline.Item>,
          <Timeline.Item key={index + '_right'} color={color}>
            {!step.execution && ADMIN_MODE ? triggerButton : executionSteps}
            {hasFailed ? triggerButton : undefined}
          </Timeline.Item>,
        ]
      }

      case 'cross': {
        const triggerButton = <Button type="primary" disabled={!node} onClick={() => triggerStep(step)} >trigger Transfer</Button>
        return [
          <Timeline.Item key={index + '_left'} color={color}>
            <h4>Transfer from {getChainAvatar(step.action.chainKey)} to {getChainAvatar(step.action.toChainKey)} via {connextAvatar}</h4>
            <span>{formatTokenAmount(step.action.fromToken, step.estimate?.fromAmount)} <ArrowRightOutlined /> {formatTokenAmount(step.action.toToken, step.estimate?.toAmount)}</span>
          </Timeline.Item>,
          <Timeline.Item key={index + '_right'} color={color}>
            {!step.execution && ADMIN_MODE ? triggerButton : executionSteps}
            {hasFailed ? triggerButton : undefined}
          </Timeline.Item>,
        ]
      }

      case 'withdraw':
        const triggerButton = <Button type="primary" disabled={!node || !web3.account} onClick={() => triggerStep(step)}>trigger Withdraw</Button>
        const token = step.action.token
        return [
          <Timeline.Item key={index + '_left'} color={color}>
            <h4>Withdraw to {web3.account ? web3.account.substr(0, 4) : '0x'}...</h4>
            <span>{formatTokenAmount(step.action.token, step.estimate?.toAmount)} (<span onClick={() => switchAndAddToken(token)}>Add Token</span>)</span>
          </Timeline.Item>,
          <Timeline.Item key={index + '_right'} color={color}>
            {!step.execution && ADMIN_MODE ? triggerButton : executionSteps}
            {hasFailed ? triggerButton : undefined}
          </Timeline.Item>,
        ]

      default:
        console.warn('should never reach here')
    }
  }

  const triggerStep = async (step: TranferStep) => {
    let triggerFunc
    switch (step.action.type) {
      case 'deposit':
        triggerFunc = triggerDeposit
        break
      case 'swap':
        triggerFunc = triggerSwap
        break
      case 'paraswap':
        triggerFunc = triggerParaswap
        break
      case '1inch':
        triggerFunc = triggerOneIchSwap
        break
      case 'cross':
        triggerFunc = triggerTransfer
        break
      case 'withdraw':
        triggerFunc = triggerWithdraw
        break
      default:
        throw new Error('Invalid Step')
    }

    return triggerFunc(step)
  }

  const startCrossChainSwap = async () => {
    setIsSwapping(true)
    setSwapStartedAt(Date.now())

    try {
      for (const step of route) {
        await triggerStep(step)
      }
    } catch (e) {
      console.error(e)
      setIsSwapping(false)
      setSwapDoneAt(Date.now())
      return
    }

    setIsSwapping(false)
    setSwapDoneAt(Date.now())
    setSwapDone(true)
  }

  if (!activeButton && !isSwapping && !swapDone) {
    activeButton = startSwapButton
  }
  if (swapDone) {
    activeButton = <Typography.Text>DONE - successful transfered</Typography.Text>
  }

  return (<>
    {alerts}
    <br />

    <Timeline mode="alternate">
      <Timeline.Item color="green"></Timeline.Item>

      {/* Wallet */}
      {parseWalletSteps()}

      {/* Chain */}
      {parseChainSteps()}

      {/* Connext */}
      {/* {parseConnextSteps()} */}

      {/* Steps */}
      {route.map(parseStepToTimeline)}
    </Timeline>

    <div style={{ display: 'flex' }}>
      <Typography.Text style={{ marginLeft: 'auto' }}>
        {swapStartedAt ? <span className="totalTime"><Clock startedAt={swapStartedAt} successAt={swapDoneAt} /></span> : <span>&nbsp;</span>}
      </Typography.Text>
    </div>

    <div style={{ textAlign: 'center', transform: 'scale(1.5)', marginBottom: 20 }}>
      {activeButton}
    </div>
    {ADMIN_MODE && <StateChannelBalances node={node}></StateChannelBalances>}
  </>)
}

export default SwappingNxtp
