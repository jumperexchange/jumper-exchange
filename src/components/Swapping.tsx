import { ArrowRightOutlined } from '@ant-design/icons';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React,  } from '@web3-react/core';
import { Avatar, Button, Timeline, Tooltip, Typography } from 'antd';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import connextIcon from '../assets/icons/connext.png';
import paraswapIcon from '../assets/icons/paraswap.png';
import oneinchIcon from '../assets/icons/oneinch.png';
import { formatTokenAmount } from '../services/utils';
import { ChainKey } from '../types';
import { getChainByKey } from '../types/lists';
import { CrossAction, Execution, ParaswapAction, SwapAction, SwapEstimate, TranferStep } from '../types/server';
import Clock from './Clock';
import { switchChain } from '../services/metamask';
import { executeParaswap } from '../services/paraswap.execute';
import { executeOneInchSwap } from '../services/1inch.execute';
import { executeUniswap } from '../services/uniswaps.execute';
import { getRpcProviders } from './web3/connectors';
import * as nxtp from '../services/nxtp'
import { executeNXTPCross } from '../services/nxtp.execute';


interface SwappingProps {
  route: Array<TranferStep>,
  updateRoute: Function,
}

const ADMIN_MODE = false

const Swapping = ({ route, updateRoute }: SwappingProps) => {

  const [swapStartedAt, setSwapStartedAt] = useState<number>()
  const [swapDoneAt, setSwapDoneAt] = useState<number>()
  const [isSwapping, setIsSwapping] = useState<boolean>(false)
  const [swapDone, setSwapDone] = useState<boolean>(false)
  const [alerts] = useState<Array<JSX.Element>>([])

  let activeButton = null
  // const { activate } = useWeb3React();

  // Wallet
  const web3 = useWeb3React<Web3Provider>()



  // Swap
  const updateStatus = (step: TranferStep, status: Execution) => {
    console.log('STATUS_CHANGE:', status)
    step.execution = status

    updateRoute(route)
  }

  const triggerSwap = async (step: TranferStep, previousStep?: TranferStep) => {
    if (!web3.account || !web3.library) return
    const swapAction = step.action as SwapAction
    const swapEstimate = step.estimate as SwapEstimate
    const fromAddress = web3.account
    const toAddress = fromAddress
    if (web3.chainId !== swapAction.chainId) {
      await switchChain(swapAction.chainId)
    }
    const swapExecution = await executeUniswap(swapAction.chainId, web3.library.getSigner(), swapAction.fromToken.id, swapAction.fromAmount, fromAddress, toAddress, swapEstimate.path, (status: Execution) => updateStatus(step, status))
    return swapExecution
  }

  const triggerParaswap = async (step: TranferStep, previousStep?: TranferStep) => {
    if (!web3.account || !web3.library) return
    const swapAction = step.action as ParaswapAction
    const fromAddress = web3.account
    const toAddress = fromAddress //swapAction.target === 'wallet' ? fromAddress : await connext.getChannelAddress(node, chainId)

    if (web3.chainId !== swapAction.chainId) {
      await switchChain(swapAction.chainId)
    }
    return executeParaswap(swapAction.chainId, web3.library.getSigner(), swapAction.fromToken.id, swapAction.toToken.id, swapAction.fromAmount, fromAddress, toAddress, (status: Execution) => updateStatus(step, status))
  }

  const triggerOneIchSwap = async (step: TranferStep, previousStep?: TranferStep) => {
    if (!web3.account || !web3.library) return
    const swapAction = step.action as ParaswapAction
    const chainId = getChainByKey(swapAction.chainKey).id // will be replaced by swapAction.chainId
    const fromAddress = web3.account
    const toAddress = fromAddress // swapAction.target === 'wallet' ? fromAddress : await connext.getChannelAddress(node, chainId)

    if (web3.chainId !== chainId) {
      await switchChain(chainId)
    }
    return executeOneInchSwap(chainId, web3.library.getSigner(), swapAction.fromToken.id, swapAction.toToken.id, swapAction.fromAmount, fromAddress, toAddress, (status: Execution) => updateStatus(step, status))
  }

  const triggerCross = async (step: TranferStep, previousStep?: TranferStep) => {
    if (!web3.account || !web3.library) return
    const crossAction = step.action as CrossAction
    let fromAmount : bigint
    if (previousStep && previousStep.execution && previousStep.execution.toAmount) {
      fromAmount = BigInt(previousStep.execution.toAmount)
    } else {
      fromAmount = BigInt(crossAction.amount)
    }

      if (web3.chainId !== crossAction.chainId) {
      await switchChain(crossAction.chainId)
    }

    const chainProviders = getRpcProviders([ 56, 100, 137])
    const nxtpSDK = await nxtp.setup(web3.library.getSigner(), chainProviders)
    const cross = executeNXTPCross(nxtpSDK, step, fromAmount.toString(), web3.account, (status: Execution) => updateStatus(step, status));

    // const switchAndAddToken = async (token: Token) => {
    //     await switchChain(token.chainId)
    //     setTimeout(() => addToken(token), 100)
    // }

    return cross
  }


  const parseExecution = (execution?: Execution) => {
    if (!execution) {
      return []
    }

    return execution.process.map((process, index) => {
      const type = process.status === 'DONE' ? 'success' : (process.status === 'FAILED' ? 'danger' : undefined)
      const hasFailed = process.status === 'FAILED'
      return (
        <p key={index} style={{display: 'flex'}}>
          <Typography.Text
            type={type}
            className={process.status === 'PENDING' ? 'flashing' : undefined}
          >
            <p>{process.message}</p>
            {hasFailed && <Typography.Text type="secondary" style={{whiteSpace: "pre-wrap"}}>
              {'errorCode' in process && `Error Code: ${process.errorCode} \n`}
              {process.errorMessage}
            </Typography.Text>}

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

      case 'swap': {
        const triggerButton = <Button type="primary" disabled={!hasFailed} onClick={() => triggerStep(index, route)} >retrigger step</Button>
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
        const triggerButton = <Button type="primary" disabled={!hasFailed} onClick={() => triggerStep(index, route)} >retrigger step</Button>
        return [
          <Timeline.Item key={index + '_left'} color={color}>
            <h4>Swap on {paraswapAvatar}</h4>
            <span>{formatTokenAmount(step.action.fromToken, step.estimate?.fromAmount)} <ArrowRightOutlined /> {formatTokenAmount(step.action.toToken, step.estimate?.toAmount)}</span>
          </Timeline.Item>,
          <Timeline.Item key={index + '_right'} color={color}>
            {!step.execution && ADMIN_MODE ? triggerButton : executionSteps}
            {hasFailed ? triggerButton : undefined}
          </Timeline.Item>,
        ]
      }

      case '1inch': {
        const triggerButton = <Button type="primary"  disabled={!hasFailed} onClick={() => triggerStep(index, route)} >retrigger step</Button>
        return [
          <Timeline.Item key={index + '_left'} color={color}>
            <h4>Swap on {oneinchAvatar}</h4>
            <span>{formatTokenAmount(step.action.fromToken, step.estimate?.fromAmount)} <ArrowRightOutlined /> {formatTokenAmount(step.action.toToken, step.estimate?.toAmount)}</span>
          </Timeline.Item>,
          <Timeline.Item key={index + '_right'} color={color}>
            {!step.execution && ADMIN_MODE ? triggerButton : executionSteps}
            {hasFailed ? triggerButton : undefined}
          </Timeline.Item>,
        ]
      }

      case 'cross': {
        const triggerButton = <Button type="primary" disabled={!hasFailed} onClick={() => triggerStep(index, route)} >retrigger step</Button>
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
        triggerFunc = triggerCross
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
    {/* {ADMIN_MODE && <StateChannelBalances node={node}></StateChannelBalances>} */}
  </>)
}

export default Swapping
