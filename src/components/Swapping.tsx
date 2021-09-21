import { ArrowRightOutlined, LoadingOutlined } from '@ant-design/icons';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { Avatar, Button, Row, Spin, Timeline, Tooltip, Typography } from 'antd';
import { BigNumber } from 'bignumber.js';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import connextIcon from '../assets/icons/connext.png';
import oneinchIcon from '../assets/icons/oneinch.png';
import paraswapIcon from '../assets/icons/paraswap.png';
import walletIcon from '../assets/wallet.png';
import { executeOneInchSwap } from '../services/1inch.execute';
import { switchChain } from '../services/metamask';
import { executeNXTPCross } from '../services/nxtp.execute';
import { executeParaswap } from '../services/paraswap.execute';
import { createAndPushProcess, initStatus, setStatusDone, setStatusFailed } from '../services/status';
import { executeUniswap } from '../services/uniswaps.execute';
import { formatTokenAmount } from '../services/utils';
import { ChainKey, CrossAction, CrossEstimate, Execution, getChainById, getChainByKey, getIcon, SwapAction, SwapEstimate, TransferStep } from '../types';
import Clock from './Clock';

interface SwappingProps {
  route: Array<TransferStep>,
  updateRoute: Function,
}

const Swapping = ({ route, updateRoute }: SwappingProps) => {

  const [swapStartedAt, setSwapStartedAt] = useState<number>()
  const [swapDoneAt, setSwapDoneAt] = useState<number>()
  const [isSwapping, setIsSwapping] = useState<boolean>(false)
  const [alerts] = useState<Array<JSX.Element>>([])


  // Wallet
  const web3 = useWeb3React<Web3Provider>()

  // Swap
  const updateStatus = (step: TransferStep, status: Execution) => {
    step.execution = status
    updateRoute(route)
  }

  const checkChain = async (step: TransferStep) => {
    const { status, update } = initStatus((status: Execution) => updateStatus(step, status))
    const chain = getChainById(step.action.chainId)
    const switchProcess = createAndPushProcess(update, status, `Change Chain to ${chain.name}`)
    try {
      const switched = await switchChain(step.action.chainId)
      if (!switched) {
        throw new Error('Chain was not switched')
      }
    } catch (e: any) {
      if (e.message) switchProcess.errorMessage = e.message
      if (e.code) switchProcess.errorCode = e.code
      setStatusFailed(update, status, switchProcess)
      return false
    }
    setStatusDone(update, status, switchProcess)
    return true
  }

  const triggerSwap = async (step: TransferStep, previousStep?: TransferStep) => {
    if (!web3.account || !web3.library) return
    const swapAction = step.action as SwapAction
    const swapEstimate = step.estimate as SwapEstimate
    const fromAddress = web3.account
    const toAddress = fromAddress

    // get right amount
    let fromAmount: BigNumber
    if (previousStep && previousStep.execution && previousStep.execution.toAmount) {
      fromAmount = new BigNumber(previousStep.execution.toAmount)
    } else {
      fromAmount = new BigNumber(swapAction.amount)
    }

    // ensure chain is set
    if (web3.chainId !== step.action.chainId) {
      if (!(await checkChain(step))) return
    }
    switch (swapAction.tool) {
      case 'uniswap':
      case 'pancakeswap':
      case 'honeyswap':
      case 'quickswap':
        return await executeUniswap(swapAction.chainId, web3.library.getSigner(), swapAction.token, swapAction.toToken, fromAmount, fromAddress, toAddress, swapEstimate.data.path, (status: Execution) => updateStatus(step, status))
      case 'paraswap':
        return await executeParaswap(swapAction.chainId, web3.library.getSigner(), swapAction.token, swapAction.toToken, fromAmount, fromAddress, toAddress, (status: Execution) => updateStatus(step, status))
      case '1inch':
        return await executeOneInchSwap(swapAction.chainId, web3.library.getSigner(), swapAction.token.id, swapAction.toToken.id, fromAmount, fromAddress, toAddress, (status: Execution) => updateStatus(step, status))
      default:
        console.warn('should never reach here')
    }
  }

  const triggerCross = async (step: TransferStep, previousStep?: TransferStep) => {
    if (!web3.account || !web3.library) return
    const crossAction = step.action as CrossAction

    // get right amount
    let fromAmount: BigNumber
    if (previousStep && previousStep.execution && previousStep.execution.toAmount) {
      fromAmount = new BigNumber(previousStep.execution.toAmount)
    } else {
      fromAmount = new BigNumber(crossAction.amount)
    }

    // ensure chain is set
    if (web3.chainId !== step.action.chainId) {
      if (!(await checkChain(step))) return
    }

    switch (crossAction.tool) {
      case 'nxtp':
        return await executeNXTPCross(web3.library.getSigner(), step, fromAmount, web3.account, (status: Execution) => updateStatus(step, status));
      default:
        console.warn('should never reach here')
    }
  }


  const parseExecution = (execution?: Execution) => {
    if (!execution) {
      return []
    }

    return execution.process.map((process, index) => {
      const type = process.status === 'DONE' ? 'success' : (process.status === 'FAILED' ? 'danger' : undefined)
      const hasFailed = process.status === 'FAILED'
      return (
        <span key={index} style={{ display: 'flex' }}>
          <Typography.Text
            type={type}
            className={process.status === 'PENDING' ? 'flashing' : undefined}
          >
            <p>{process.message}</p>
            {hasFailed && <Typography.Text type="secondary" style={{ whiteSpace: "pre-wrap" }}>
              {'errorCode' in process && `Error Code: ${process.errorCode} \n`}
              {process.errorMessage}
            </Typography.Text>}

          </Typography.Text>
          <Typography.Text style={{ marginLeft: 'auto' }}>
            <Clock startedAt={process.startedAt} successAt={process.doneAt} failedAt={process.failedAt} />
          </Typography.Text>
        </span>
      )
    })
  }

  const getChainAvatar = (chainKey: ChainKey) => {
    const chain = getChainByKey(chainKey)

    return (
      <Tooltip title={chain.name}>
        <Avatar size="small" src={getIcon(chain.key)} alt={chain.name}></Avatar>
      </Tooltip>
    )
  }

  const getExchangeAvatar = (chainId: number) => {
    const chain = getChainById(chainId)

    return (
      <Tooltip title={chain.exchange?.name}>
        <Avatar size="small" src={getIcon(chain.exchange?.name)} alt={chain.exchange?.name}></Avatar>
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

  const parseStepToTimeline = (step: TransferStep, index: number, route: Array<TransferStep>) => {
    const executionSteps = parseExecution(step.execution)
    const color = step.execution && step.execution.status === 'DONE' ? 'green' : (step.execution ? 'blue' : 'gray')
    const hasFailed = step.execution && step.execution.status === 'FAILED'

    switch (step.action.type) {

      case 'swap': {
        const triggerButton = <Button type="primary" disabled={!hasFailed} onClick={() => triggerStep(index, route)} >retrigger step</Button>
        return [
          <Timeline.Item key={index + '_left'} color={color}>
            <h4>Swap on {step.action.tool === '1inch' ? oneinchAvatar : (step.action.tool === 'paraswap' ? paraswapAvatar : getExchangeAvatar(step.action.chainId))}</h4>
            <span>{formatTokenAmount(step.action.token, step.estimate?.fromAmount)} <ArrowRightOutlined /> {formatTokenAmount(step.action.toToken, step.estimate?.toAmount)}</span>
          </Timeline.Item>,
          <Timeline.Item key={index + '_right'} color={color}>
            {executionSteps}
            {hasFailed ? triggerButton : undefined}
          </Timeline.Item>,
        ]
      }

      case 'cross': {
        const crossAction = step.action as CrossAction
        const crossEstimate = step.estimate as CrossEstimate
        const triggerButton = <Button type="primary" disabled={!hasFailed} onClick={() => triggerStep(index, route)} >retrigger step</Button>
        let avatar;
        switch (crossAction.tool) {
          case 'nxtp':
            avatar = connextAvatar
            break;
          default:
            return
        }
        return [
          <Timeline.Item key={index + '_left'} color={color}>
            <h4>Transfer from {getChainAvatar(getChainById(crossAction.chainId).key)} to {getChainAvatar(getChainById(crossAction.toChainId).key)} via {avatar}</h4>
            <span>{formatTokenAmount(crossAction.token, crossEstimate.fromAmount)} <ArrowRightOutlined /> {formatTokenAmount(crossAction.toToken, crossEstimate.toAmount)}</span>
          </Timeline.Item>,
          <Timeline.Item key={index + '_right'} color={color}>
            {executionSteps}
            {hasFailed ? triggerButton : undefined}
          </Timeline.Item>,
        ]
      }

      default:
        console.warn('should never reach here')
    }
  }

  const triggerStep = async (index: number, route: Array<TransferStep>) => {
    const step = route[index]
    const previousStep = index > 0 ? route[index - 1] : undefined
    switch (step.action.type) {
      case 'swap':
        return triggerSwap(step, previousStep)
      case 'cross':
        return triggerCross(step, previousStep)
      default:
        throw new Error('Invalid Step')
    }
  }

  const startCrossChainSwap = async () => {
    setIsSwapping(true)
    setSwapStartedAt(Date.now())
  }

  const restartCrossChainSwap = async () => {
    // remove failed
    for (let index = 0; index < route.length; index++) {
      if (route[index].execution?.status === 'FAILED') {
        route[index].execution = undefined
        updateRoute(route)
      }
    }

    // start again
    setIsSwapping(true)
  }

  // check where we are an trigger next
  const checkSwapping = () => {
    if (!isSwapping) return

    for (let index = 0; index < route.length; index++) {
      if (!route[index].execution) {
        return triggerStep(index, route)
          .catch(() => {
            // stop if a step fails
            setIsSwapping(false)
          })
      } else if (route[index].execution?.status === 'DONE') {
        continue // step is already done, continue
      } else {
        return // step is already runing, wait
      }
    }

    setIsSwapping(false)
    setSwapDoneAt(Date.now())
  }
  checkSwapping()

  const getMainButton = () => {
    // PENDING
    if (isSwapping) {
      return <></>
    }

    // DONE
    const isDone = route.filter(step => step.execution?.status !== 'DONE').length === 0
    if (isDone) {
      // const result = route[route.length - 1].execution
      // console.debug(result)
      return <Link to="/dashboard"><Button type="link" >DONE - check your balances in our Dashboard</Button></Link>
    }

    // FAILED
    const isFailed = route.filter(step => step.execution?.status === 'FAILED').length > 0
    if (isFailed) {
      return <Button type="primary" onClick={() => restartCrossChainSwap()}>
        Restart from Failed Step
      </Button>
    }

    // NOT_STARTED
    const isCrossChainSwap = route.filter(step => step.action.type === 'cross').length > 0
    return (
      <Button type="primary" onClick={() => startCrossChainSwap()}>
        {isCrossChainSwap ? 'Start Cross Chain Swap' : 'Start Swap'}
      </Button>
    )
  }

  const getCurrentProcess = () => {
    for (const step of route) {
      if (step.execution?.process) {
        for (const process of step.execution?.process) {
          if (process.status === 'ACTION_REQUIRED' || process.status === 'PENDING') {
            return process
          }
        }
      }
    }
    return null
  }

  const currentProcess = getCurrentProcess()

  return (<>
    {alerts}
    <br />

    <Timeline mode="alternate">
      <Timeline.Item color="green"></Timeline.Item>

      {/* Steps */}
      {route.map(parseStepToTimeline)}
    </Timeline>

    <div style={{ display: 'flex' }}>
      <Typography.Text style={{ marginLeft: 'auto' }}>
        {swapStartedAt ? <span className="totalTime"><Clock startedAt={swapStartedAt} successAt={swapDoneAt} /></span> : <span>&nbsp;</span>}
      </Typography.Text>
    </div>

    {currentProcess && currentProcess.status === 'PENDING' &&
      <>
        <Row justify="center">
          <Spin style={{ margin: 10 }} indicator={<LoadingOutlined style={{ fontSize: 80 }} spin />} />
        </Row>
        <Row justify="center">
          <Typography.Text style={{ marginTop: 10 }} className="flashing">{currentProcess.message}</Typography.Text>
        </Row>
      </>
    }
    {currentProcess && currentProcess.status === 'ACTION_REQUIRED' &&
      <>
        <Row justify="center">
          <img src={walletIcon} alt="Wallet" width="92" height="100" />
        </Row>
        <Row justify="center">
          <Typography.Text style={{ marginTop: 10 }}>{currentProcess.message}</Typography.Text>
        </Row>
      </>
    }

    <div style={{ textAlign: 'center', transform: 'scale(1.5)', marginBottom: 20 }}>
      {getMainButton()}
    </div>
  </>)
}

export default Swapping
