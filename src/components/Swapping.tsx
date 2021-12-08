import { ArrowRightOutlined, LoadingOutlined, PauseCircleOutlined } from '@ant-design/icons'
import { Web3Provider } from '@ethersproject/providers'
import LiFi, {
  createAndPushProcess,
  initStatus,
  setStatusDone,
  setStatusFailed,
} from '@lifinance/sdk'
import { useWeb3React } from '@web3-react/core'
import { Avatar, Button, Divider, Row, Space, Spin, Timeline, Tooltip, Typography } from 'antd'
import BigNumber from 'bignumber.js'
import { constants } from 'ethers'
import { useEffect, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import { Link } from 'react-router-dom'

import cbridgeIcon from '../assets/icons/cbridge.png'
import connextIcon from '../assets/icons/connext.png'
import harmonyIcon from '../assets/icons/harmony.png'
import hopIcon from '../assets/icons/hop.png'
import oneinchIcon from '../assets/icons/oneinch.png'
import paraswapIcon from '../assets/icons/paraswap.png'
import walletIcon from '../assets/wallet.png'
import { storeActiveRoute } from '../services/localStorage'
import { switchChain, switchChainAndAddToken } from '../services/metamask'
import { renderProcessMessage } from '../services/processRenderer'
import { formatTokenAmount } from '../services/utils'
import {
  ChainKey,
  Execution,
  getChainById,
  getChainByKey,
  getIcon,
  Route,
  Step,
  TokenAmount,
} from '../types'
import Clock from './Clock'
import LoadingIndicator from './LoadingIndicator'

interface SwappingProps {
  route: Route
  updateRoute: Function
  onSwapDone: Function
}

const getFinalBalace = (account: string, route: Route): Promise<TokenAmount | null> => {
  const lastStep = route.steps[route.steps.length - 1]
  const { toToken } = getRecevingInfo(lastStep)
  return LiFi.getTokenBalance(account, toToken)
}

const getRecevingInfo = (step: Step) => {
  const toChain = getChainById(step.action.toChainId)
  const toToken = step.action.toToken
  return { toChain, toToken }
}

const Swapping = ({ route, updateRoute, onSwapDone }: SwappingProps) => {
  const { steps } = route

  const isMobile = useMediaQuery({ query: `(max-width: 760px)` })

  const [swapStartedAt, setSwapStartedAt] = useState<number>()
  const [swapDoneAt, setSwapDoneAt] = useState<number>()
  const [isSwapping, setIsSwapping] = useState<boolean>(false)
  const [alerts] = useState<Array<JSX.Element>>([])
  const [finalTokenAmount, setFinalTokenAmount] = useState<TokenAmount | null>()

  // Wallet
  const web3 = useWeb3React<Web3Provider>()

  const connextAvatar = (
    <Tooltip title="NXTP by Connext">
      <Avatar size="small" src={connextIcon} alt="NXTP"></Avatar>
    </Tooltip>
  )

  const hopAvatar = (
    <Tooltip title="Hop">
      <Avatar size="small" src={hopIcon} alt="Hop"></Avatar>
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

  const horizonAvatar = (
    <Tooltip title="horizon bridge">
      <Avatar size="small" src={harmonyIcon} alt="horizon bridge"></Avatar>
    </Tooltip>
  )

  const cbridgeAvatar = (
    <Tooltip title="cBridge">
      <Avatar size="small" src={cbridgeIcon} alt="cBridge"></Avatar>
    </Tooltip>
  )

  useEffect(() => {
    // check if route is eligible for automatic resuming
    const allDone = steps.every((step) => step.execution?.status === 'DONE')
    const isFailed = steps.some((step) => step.execution?.status === 'FAILED')
    const alreadyStarted = steps.some((step) => step.execution)
    if (!allDone && !isFailed && alreadyStarted) {
      resumeExecution()
    }

    // move execution to background when modal is closed
    return function cleanup() {
      LiFi.moveExecutionToBackground(route)
    }
  }, [])

  const checkChain = async (step: Step) => {
    const updateFunction = (step: Step, status: Execution) => {
      step.execution = status
      storeActiveRoute(route)
      updateRoute(route)
    }

    const { status, update } = initStatus(
      (status: Execution) => updateFunction(step, status),
      step.execution,
    )
    const chain = getChainById(step.action.fromChainId)
    const switchProcess = createAndPushProcess(
      'switchProcess',
      update,
      status,
      `Change Chain to ${chain.name}`,
    )
    try {
      const switched = await switchChain(step.action.fromChainId)
      if (!switched) {
        throw new Error('Chain was not switched')
      }
    } catch (e: any) {
      if (e.message) switchProcess.errorMessage = e.message
      if (e.code) switchProcess.errorCode = e.code
      setStatusFailed(update, status, switchProcess)
      setIsSwapping(false)
      return false
    }
    setStatusDone(update, status, switchProcess)
    return true
  }

  const parseExecution = (execution?: Execution) => {
    if (!execution) {
      return []
    }
    return execution.process.map((process, index) => {
      const type =
        process.status === 'DONE' ? 'success' : process.status === 'FAILED' ? 'danger' : undefined
      const hasFailed = process.status === 'FAILED'
      return (
        <span key={index} style={{ display: 'flex' }}>
          <Typography.Text
            type={type}
            style={{ maxWidth: 250 }}
            className={isSwapping && process.status === 'PENDING' ? 'flashing' : undefined}>
            <p>{renderProcessMessage(process)}</p>

            {hasFailed && (
              <Typography.Text type="secondary" style={{ whiteSpace: 'pre-wrap' }}>
                {'errorCode' in process && `Error Code: ${process.errorCode} \n`}
                {'errorMessage' in process &&
                  `${process.errorMessage.substring(0, 150)}${
                    process.errorMessage.length > 150 ? '...' : ''
                  }`}
              </Typography.Text>
            )}
          </Typography.Text>
          <Typography.Text style={{ marginLeft: 'auto', minWidth: 35 }}>
            <Clock
              startedAt={process.startedAt}
              successAt={process.doneAt}
              failedAt={process.failedAt}
            />
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

  const formatToolName = (name: string) => {
    const nameOnly = name.split('-')[0]
    return nameOnly[0].toUpperCase() + nameOnly.slice(1)
  }

  const getExchangeAvatar = (tool: string) => {
    const name = formatToolName(tool)
    return (
      <Tooltip title={name}>
        <Avatar size="small" src={getIcon(name)} alt={name}></Avatar>
      </Tooltip>
    )
  }

  const parseStepToTimeline = (step: Step, index: number) => {
    const executionSteps = parseExecution(step.execution)
    const isDone = step.execution && step.execution.status === 'DONE'
    const isLoading = isSwapping && step.execution && step.execution.status === 'PENDING'
    const isPaused = !isSwapping && step.execution && step.execution.status === 'PENDING'
    const color = isDone ? 'green' : step.execution ? 'blue' : 'gray'
    switch (step.type) {
      case 'swap': {
        return [
          <Timeline.Item
            position={isMobile ? 'right' : 'right'}
            key={index + '_left'}
            color={color}>
            <h4>
              Swap on{' '}
              {step.tool === '1inch'
                ? oneinchAvatar
                : step.tool === 'paraswap'
                ? paraswapAvatar
                : getExchangeAvatar(step.tool)}
            </h4>
            <span>
              {formatTokenAmount(step.action.fromToken, step.estimate?.fromAmount)}{' '}
              <ArrowRightOutlined />{' '}
              {formatTokenAmount(step.action.toToken, step.estimate?.toAmount)}
            </span>
          </Timeline.Item>,
          <Timeline.Item
            position={isMobile ? 'right' : 'left'}
            key={index + '_right'}
            color={color}
            dot={isLoading ? <LoadingOutlined /> : isPaused ? <PauseCircleOutlined /> : null}>
            {executionSteps}
          </Timeline.Item>,
        ]
      }

      case 'cross': {
        const { action, estimate } = step
        let avatar
        switch (step.tool) {
          case 'nxtp':
            avatar = connextAvatar
            break
          case 'hop':
            avatar = hopAvatar
            break
          case 'horizon':
            avatar = horizonAvatar
            break
          case 'cbridge':
            avatar = cbridgeAvatar
            break
          default:
            break
        }
        return [
          <Timeline.Item
            position={isMobile ? 'right' : 'right'}
            key={index + '_left'}
            color={color}>
            <h4>
              Transfer from {getChainAvatar(getChainById(action.fromChainId).key)} to{' '}
              {getChainAvatar(getChainById(action.toChainId).key)} via {avatar}
            </h4>
            <span>
              {formatTokenAmount(action.fromToken, estimate.fromAmount)} <ArrowRightOutlined />{' '}
              {formatTokenAmount(action.toToken, estimate.toAmount)}
            </span>
          </Timeline.Item>,
          <Timeline.Item
            position={isMobile ? 'right' : 'left'}
            style={{ paddingBottom: isMobile ? 30 : 0 }}
            key={index + '_right'}
            color={color}
            dot={isLoading ? <LoadingOutlined /> : isPaused ? <PauseCircleOutlined /> : null}>
            {executionSteps}
          </Timeline.Item>,
        ]
      }

      case 'lifi': {
        return [
          <Timeline.Item
            position={isMobile ? 'right' : 'right'}
            key={index + '_left'}
            color={color}>
            <h4>
              LiFi Contract from {getChainAvatar(getChainById(step.action.fromChainId).key)} to{' '}
              {getChainAvatar(getChainById(step.action.toChainId).key)}
            </h4>
            <span>
              {formatTokenAmount(step.action.fromToken, step.estimate?.fromAmount)}{' '}
              <ArrowRightOutlined />{' '}
              {formatTokenAmount(step.action.toToken, step.estimate?.toAmount)}
            </span>
          </Timeline.Item>,
          <Timeline.Item
            position={isMobile ? 'right' : 'left'}
            key={index + '_right'}
            color={color}
            dot={isLoading ? <LoadingOutlined /> : null}>
            {executionSteps}
          </Timeline.Item>,
        ]
      }

      default:
        // eslint-disable-next-line no-console
        console.warn('should never reach here')
    }
  }

  // called on every execution status change
  const updateCallback = async (updatedRoute: Route) => {
    storeActiveRoute(updatedRoute)
    updateRoute(updatedRoute)

    if (!web3.account || !web3.library) return
    // check if wallet on correct chain for current action
    const currentStep = steps.find((step) => !step.execution)

    if (currentStep && currentStep.action.fromChainId !== web3.chainId) {
      if (!(await checkChain(currentStep))) {
        LiFi.stopExecution(updatedRoute)
        setIsSwapping(false)
      }
      resumeExecution()
    }
  }

  const startCrossChainSwap = async () => {
    if (!web3.account || !web3.library) return
    storeActiveRoute(route)
    setIsSwapping(true)
    setSwapStartedAt(Date.now())
    try {
      const executionPromise = LiFi.executeRoute(web3.library.getSigner(), route)
      LiFi.registerCallback(updateCallback, route)
      await executionPromise
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Execution failed!', route)
      // eslint-disable-next-line no-console
      console.error(e)
      setIsSwapping(false)
      return
    }
    setFinalTokenAmount(await getFinalBalace(web3.account!, route))
    setIsSwapping(false)
    setSwapDoneAt(Date.now())
    onSwapDone()
  }

  const resumeExecution = async () => {
    if (!web3.account || !web3.library) return
    setIsSwapping(true)
    try {
      await LiFi.resumeRoute(web3.library.getSigner(), route, updateCallback)
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Execution failed!', route)
      // eslint-disable-next-line no-console
      console.error(e)
      setIsSwapping(false)
      return
    }
    setFinalTokenAmount(await getFinalBalace(web3.account!, route))
    setIsSwapping(false)
    setSwapDoneAt(Date.now())
    onSwapDone()
  }

  const restartCrossChainSwap = async () => {
    // remove failed
    for (let index = 0; index < steps.length; index++) {
      if (steps[index].execution && steps[index].execution!.status === 'FAILED') {
        steps[index].execution!.status = 'RESUME'
        steps[index].execution!.process.pop() // remove last (failed) process
        updateRoute(route)
      }
    }
    // start again
    resumeExecution()
  }

  const getMainButton = () => {
    // PENDING
    if (isSwapping) {
      return <></>
    }
    const isCrossChainSwap = steps.filter((step) => step.type === 'cross').length > 0

    // DONE
    const isDone = steps.filter((step) => step.execution?.status !== 'DONE').length === 0
    if (isDone) {
      const lastStep = steps[steps.length - 1]
      const { toChain } = getRecevingInfo(lastStep)
      return (
        <Space direction="vertical">
          <Typography.Text strong>Swap Successful!</Typography.Text>
          {finalTokenAmount &&
            (finalTokenAmount.id === constants.AddressZero ? (
              <Typography.Text>
                {'You now have '}
                {new BigNumber(finalTokenAmount.amount).toFixed(4)}
                {` ${finalTokenAmount.symbol}`}
                {` on ${toChain.name}`}
              </Typography.Text>
            ) : (
              <Tooltip title="Click to add this token to your wallet.">
                <span
                  style={{ cursor: 'copy' }}
                  onClick={() => switchChainAndAddToken(toChain.id, finalTokenAmount)}>
                  <Typography.Text>
                    {'You now have '}
                    {new BigNumber(finalTokenAmount.amount).toFixed(4)}
                    {` ${finalTokenAmount.symbol}`}
                    {` on ${toChain.name}`}
                  </Typography.Text>
                </span>
              </Tooltip>
            ))}
          <Link to="/dashboard">
            <Button type="link">Dashboard</Button>
          </Link>
        </Space>
      )
    }

    // FAILED
    const isFailed = steps.some((step) => step.execution?.status === 'FAILED')
    if (isFailed) {
      return (
        <Button type="primary" onClick={() => restartCrossChainSwap()} style={{ marginTop: 10 }}>
          Restart from Failed Step
        </Button>
      )
    }

    // NOT_STARTED
    return (
      <Button type="primary" onClick={() => startCrossChainSwap()} style={{ marginTop: 10 }}>
        {isCrossChainSwap ? 'Start Cross Chain Swap' : 'Start Swap'}
      </Button>
    )
  }

  const getCurrentProcess = () => {
    for (const step of steps) {
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

  return (
    <>
      {alerts}
      <br />

      <Timeline mode={isMobile ? 'left' : 'alternate'} className="swapping-modal-timeline">
        {/* Steps */}
        {steps.map(parseStepToTimeline)}
      </Timeline>

      <div style={{ display: 'flex', backgroundColor: 'rgba(255,255,255, 0)' }}>
        <Typography.Text style={{ marginLeft: 'auto', marginRight: 5 }}>
          {swapStartedAt ? (
            <span className="totalTime">
              <Clock startedAt={swapStartedAt} successAt={swapDoneAt} />
            </span>
          ) : (
            <span>&nbsp;</span>
          )}
        </Typography.Text>
      </div>

      <Divider />

      <div className="swapp-modal-footer">
        <div style={{ textAlign: 'center', transform: 'scale(1.3)' }}>{getMainButton()}</div>

        {isSwapping && currentProcess && currentProcess.status === 'ACTION_REQUIRED' && (
          <>
            <Row justify="center" style={{ marginBottom: 6 }}>
              <Typography.Text>{renderProcessMessage(currentProcess)}</Typography.Text>
            </Row>
            <Row justify="center">
              <img src={walletIcon} alt="Please Check Your Wallet" />
            </Row>
          </>
        )}

        {isSwapping && currentProcess && currentProcess.status === 'PENDING' && (
          <>
            <Row justify="center">
              <Typography.Text className="flashing">
                {renderProcessMessage(currentProcess)}
              </Typography.Text>
            </Row>
            <Row style={{ marginTop: 20 }} justify="center">
              <Spin indicator={<LoadingIndicator />} />
            </Row>
          </>
        )}
      </div>
    </>
  )
}

export default Swapping
