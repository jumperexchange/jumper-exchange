import { ArrowRightOutlined } from '@ant-design/icons';
import { BrowserNode } from '@connext/vector-browser-node';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { Alert, Avatar, Button, Timeline, Tooltip, Typography } from 'antd';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import connextIcon from '../assets/icons/connext.png';
import paraswapIcon from '../assets/icons/paraswap.png';
import oneinchIcon from '../assets/icons/oneinch.png';
import * as connext from '../services/connext';
import { deepClone, formatTokenAmount } from '../services/utils';
import { ChainKey, Token } from '../types';
import { getChainById, getChainByKey } from '../types/lists';
import { CrossAction, Execution, ParaswapAction, SwapAction, SwapEstimate, TranferStep, emptyExecution } from '../types/server';
import Clock from './Clock';
import StateChannelBalances from './StateChannelBalances';
import { injected } from './web3/connectors';
import { addToken, switchChain } from '../services/metamask';
import { executeParaswap } from '../services/paraswap.execute';
import { executeOneInchSwap } from '../services/1inch.execute';

interface SwappingProps {
  route: Array<TranferStep>,
  updateRoute: Function,
}

const ADMIN_MODE = false

const Swapping = ({ route, updateRoute }: SwappingProps) => {
  // Connext
  const [node, setNode] = useState<BrowserNode>(connext.getNode())
  const [loggingIn, setLoggingIn] = useState<boolean>(false)
  const [connextLoginStartedAt, setConnextLoginStartedAt] = useState<number>()
  const [connextLoginDoneAt, setConnextLoginDoneAt] = useState<number>()
  const [swapStartedAt, setSwapStartedAt] = useState<number>()
  const [swapDoneAt, setSwapDoneAt] = useState<number>()
  const [isSwapping, setIsSwapping] = useState<boolean>(false)
  const [swapDone, setSwapDone] = useState<boolean>(false)
  const [alerts, setAlerts] = useState<Array<JSX.Element>>([])

  let activeButton = null
  const { activate } = useWeb3React();

  const initializeConnext = async () => {
    setLoggingIn(true)
    setConnextLoginStartedAt(Date.now())
    setAlerts([])
    try {
      const _node = await connext.initNode()
      setNode(_node)
      setConnextLoginDoneAt(Date.now())
    } catch (e) {
      setAlerts([
        <Alert
          message="Failed to connect to Connext"
          description="Please disable shields or ad blockers or allow third party cookies in your browser and try again. Connext requires cross-site cookies to store your channel states."
          type="error"
          showIcon
        />
      ])
    } finally {
      setLoggingIn(false)
    }
  }

  // Wallet
  const web3 = useWeb3React<Web3Provider>()

  // Swap
  const updateStatus = (step: TranferStep, status: Execution) => {
    console.log('STATUS_CHANGE:', status)
    step.execution = status

    updateRoute(route)
  }

  // const triggerDeposit = (step: TranferStep) => {
  //   if (!node || !web3.library) return
  //   const depositAction = step.action as DepositAction

  //   return connext.triggerDeposit(node, web3.library.getSigner(), depositAction.chainId, depositAction.token.id, BigInt(depositAction.amount), (status: Execution) => updateStatus(step, status))
  // }

  const triggerSwap = (step: TranferStep, previousStep?: TranferStep) => {
    if (!node) return
    const swapAction = step.action as SwapAction
    const swapEstimate = step.estimate as SwapEstimate
    const chainId = getChainByKey(swapAction.chainKey).id // will be replaced by swapAction.chainId

    return connext.triggerSwap(node, chainId, swapEstimate.path, swapAction.fromToken.id, swapAction.toToken.id, swapAction.fromAmount, (status: Execution) => updateStatus(step, status))
  }

  const triggerParaswap = async (step: TranferStep, previousStep?: TranferStep) => {
    if (!web3.account || !web3.library) return
    const swapAction = step.action as ParaswapAction
    const chainId = getChainByKey(swapAction.chainKey).id // will be replaced by swapAction.chainId
    const fromAddress = web3.account
    const toAddress = swapAction.target === 'wallet' ? fromAddress : await connext.getChannelAddress(node, chainId)

    return executeParaswap(chainId, web3.library.getSigner(), swapAction.fromToken.id, swapAction.toToken.id, swapAction.fromAmount, fromAddress, toAddress, (status: Execution) => updateStatus(step, status))
  }

  const triggerOneIchSwap = async (step: TranferStep, previousStep?: TranferStep) => {
    if (!web3.account || !web3.library) return
    const swapAction = step.action as ParaswapAction
    const chainId = getChainByKey(swapAction.chainKey).id // will be replaced by swapAction.chainId
    const fromAddress = web3.account
    const toAddress = swapAction.target === 'wallet' ? fromAddress : await connext.getChannelAddress(node, chainId)

    return executeOneInchSwap(chainId, web3.library.getSigner(), swapAction.fromToken.id, swapAction.toToken.id, swapAction.fromAmount, fromAddress, toAddress, (status: Execution) => updateStatus(step, status))
  }

  const triggerTransfer = async (step: TranferStep, previousStep?: TranferStep) => {
    if (!node || !web3.library || !web3.account) return
    const crossAction = step.action as CrossAction
    const fromChainId = getChainByKey(crossAction.chainKey).id // will be replaced by crossAction.chainId
    const toChainId = getChainByKey(crossAction.toChainKey).id // will be replaced by crossAction.toChainId
    let fromAmount : bigint
    console.log('previousStep', previousStep)
    if (previousStep && previousStep.execution && previousStep.execution.toAmount) {
      fromAmount = BigInt(previousStep.execution.toAmount)
    } else {
      fromAmount = BigInt(crossAction.amount)
    }

    const status = deepClone(emptyExecution)
    await connext.triggerDeposit(node, web3.library.getSigner(), fromChainId, crossAction.fromToken.id, fromAmount, (status: Execution) => updateStatus(step, status), status)
    await connext.triggerTransfer(node, fromChainId, toChainId, crossAction.fromToken.id, crossAction.toToken.id, fromAmount, (status: Execution) => updateStatus(step, status), status)
    return connext.triggerWithdraw(node, toChainId, web3.account, crossAction.toToken.id, 0, (status: Execution) => updateStatus(step, status), status)
  }

  // const triggerWithdraw = (step: TranferStep) => {
  //   if (!node || !web3.account) return
  //   const withdrawAction = step.action as WithdrawAction
  //   const chainId = getChainByKey(withdrawAction.chainKey).id // will be replaced by withdrawAction.chainId
  //   const recipient = withdrawAction.recipient ?? web3.account

  //   return connext.triggerWithdraw(node, chainId, recipient, withdrawAction.token.id, withdrawAction.amount, (status: Execution) => updateStatus(step, status))
  // }

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
          <p style={{display: 'flex'}}>
            <Typography.Text type="success">
              Connected with {web3.account.substr(0, 4)}...
            </Typography.Text>
            <Typography.Text style={{marginLeft: 'auto'}}>
              <Clock startedAt={1} successAt={1}/>
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
          <p style={{display: 'flex'}}>
            <Typography.Text type="success">
              On {chain.name} Chain
            </Typography.Text>
            <Typography.Text style={{marginLeft: 'auto'}}>
              <Clock startedAt={1} successAt={1}/>
            </Typography.Text>
          </p>
        }
      </Timeline.Item>,
    ]
  }

  const parseConnextSteps = () => {
    if (route.filter(step => step.action.type === 'cross').length === 0) {
      return []
    }
    const isDone = !!node
    const isActive = !isDone && web3.chainId === route[0].action.chainId

    const button = <Button type="primary" disabled={!isActive} onClick={() => initializeConnext()}>Login to Connext</Button>
    const buttonText = <Typography.Text onClick={() => initializeConnext()}>Login to Connext</Typography.Text>
    if (isActive) {
      activeButton = button
    }

    const color = isDone ? 'green' : (isActive ? 'blue' : 'gray')
    return [
      <Timeline.Item key="connext_left" color={color}>
        <h4 style={{ marginBottom: 0 }}>
          Login to Connext
        </h4>
      </Timeline.Item>,
      <Timeline.Item key="connext_right" color={color}>
        {!node && !loggingIn && buttonText}
        {!node && loggingIn &&
          <p style={{display: 'flex'}}>
            <Typography.Text className="flashing">
              In Progress
            </Typography.Text>
            <Typography.Text style={{marginLeft: 'auto'}}>
              { connextLoginStartedAt && <Clock startedAt={connextLoginStartedAt}/> }
            </Typography.Text>
          </p>
        }
        {node &&
          <p style={{display: 'flex'}}>
            <Typography.Text type="success">
              Login successful
            </Typography.Text>
            <Typography.Text style={{marginLeft: 'auto'}}>
              <Clock startedAt={connextLoginStartedAt || 1} successAt={connextLoginDoneAt || 1}/>
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
        <p key={index} style={{display: 'flex'}}>
          <Typography.Text
            type={type}
            className={process.status === 'PENDING' ? 'flashing' : undefined}
          >
            {process.message}
          </Typography.Text>
          <Typography.Text style={{marginLeft: 'auto'}}>
            <Clock startedAt={process.startedAt} successAt={process.doneAt} failedAt={process.failedAt}/>
          </Typography.Text>
        </p>
      )
    })
  }

  const getChainAvatar = (chainKey: ChainKey) => {
    const chain = getChainByKey(chainKey)

    return (
      <Tooltip title={chain.name}>
        <Avatar size="small" src={chain.iconUrl} alt={chain.name}></Avatar>
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

  const parseStepToTimeline = (step: TranferStep, index: number, route: Array<TranferStep>) => {
    const executionSteps = parseExecution(step.execution)
    const color = step.execution && step.execution.status === 'DONE' ? 'green' : (step.execution ? 'blue' : 'gray')
    const hasFailed = step.execution && step.execution.status === 'FAILED'

    switch (step.action.type) {
      case 'deposit': {
        const triggerButton = <Button type="primary" disabled={!node || !web3.library || web3.chainId !== route[0].action.chainId} onClick={() => triggerStep(index, route)}>trigger Deposit</Button>
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
        const triggerButton = <Button type="primary" disabled={!node} onClick={() => triggerStep(index, route)} >trigger Swap</Button>
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
        const triggerButton = <Button type="primary" disabled={!node} onClick={() => triggerStep(index, route)} >trigger Swap</Button>
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
        const triggerButton = <Button type="primary" disabled={!node} onClick={() => triggerStep(index, route)} >trigger Swap</Button>
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
        const triggerButton = <Button type="primary" disabled={!node} onClick={() => triggerStep(index, route)} >trigger Transfer</Button>
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
        const triggerButton = <Button type="primary" disabled={!node || !web3.account} onClick={() => triggerStep(index, route)}>trigger Withdraw</Button>
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

  const triggerStep = async (index: number, route: Array<TranferStep>) => {
    let triggerFunc
    const step = route[index]
    const previousStep = index > 0 ? route[index - 1] : undefined
    switch (step.action.type) {
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
      default:
        throw new Error('Invalid Step')
    }

    return triggerFunc(step, previousStep)
  }

  const startCrossChainSwap = async () => {
    setIsSwapping(true)
    setSwapStartedAt(Date.now())

    try {
      for (let index = 0; index < route.length; index++) {
        await triggerStep(index, route)
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
    activeButton = <Link to="/dashboard"><Button type="link" >DONE - check your balances in our Dashboard</Button></Link>
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
      {parseConnextSteps()}

      {/* Steps */}
      {route.map(parseStepToTimeline)}
    </Timeline>

    <div style={{display: 'flex'}}>
      <Typography.Text  style={{marginLeft: 'auto'}}>
        { swapStartedAt ? <span className="totalTime"><Clock  startedAt={swapStartedAt} successAt={swapDoneAt}/></span> : <span>&nbsp;</span>}
      </Typography.Text>
    </div>

    <div style={{ textAlign: 'center', transform: 'scale(1.5)', marginBottom: 20 }}>
      {activeButton}
    </div>
    {ADMIN_MODE && <StateChannelBalances node={node}></StateChannelBalances>}
  </>)
}

export default Swapping
