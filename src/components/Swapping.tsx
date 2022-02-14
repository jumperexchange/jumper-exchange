import { ArrowRightOutlined, LoadingOutlined, PauseCircleOutlined } from '@ant-design/icons'
import { Web3Provider } from '@ethersproject/providers'
import LiFi, {
  ExecutionSettings,
  getEthereumDecryptionHook,
  getEthereumPublicKeyHook,
  StepTool,
} from '@lifinance/sdk'
import { useWeb3React } from '@web3-react/core'
import { Avatar, Button, Divider, Row, Space, Spin, Timeline, Tooltip, Typography } from 'antd'
import BigNumber from 'bignumber.js'
import { constants } from 'ethers'
import { useEffect, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import { Link } from 'react-router-dom'

import walletIcon from '../assets/wallet.png'
import { storeRoute } from '../services/localStorage'
import { switchChain, switchChainAndAddToken } from '../services/metamask'
import Notification, { NotificationType } from '../services/notifications'
import { renderProcessError, renderProcessMessage } from '../services/processRenderer'
import { formatTokenAmount, parseSecondsAsTime } from '../services/utils'
import {
  ChainKey,
  findTool,
  getChainById,
  getChainByKey,
  isCrossStep,
  isLifiStep,
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
  options: {
    encryption: boolean
  }
}

const getFinalBalance = (account: string, route: Route): Promise<TokenAmount | null> => {
  const lastStep = route.steps[route.steps.length - 1]
  const { toToken } = getReceivingInfo(lastStep)
  return LiFi.getTokenBalance(account, toToken)
}

const getReceivingInfo = (step: Step) => {
  const toChain = getChainById(step.action.toChainId)
  const toToken = step.action.toToken
  return { toChain, toToken }
}

const Swapping = ({ route, updateRoute, onSwapDone, options }: SwappingProps) => {
  const { steps } = route

  const isMobile = useMediaQuery({ query: `(max-width: 760px)` })

  const [swapStartedAt, setSwapStartedAt] = useState<number>()
  const [swapDoneAt, setSwapDoneAt] = useState<number>()
  const [isSwapping, setIsSwapping] = useState<boolean>(false)
  const [alerts] = useState<Array<JSX.Element>>([])
  const [finalTokenAmount, setFinalTokenAmount] = useState<TokenAmount | null>()

  // Wallet
  const web3 = useWeb3React<Web3Provider>()

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

  const parseExecution = (step: Step) => {
    if (!step.execution) {
      return []
    }
    return step.execution.process.map((process, index, processList) => {
      const type =
        process.status === 'DONE' ? 'success' : process.status === 'FAILED' ? 'danger' : undefined
      const hasFailed = process.status === 'FAILED'
      const isLastPendingProcess = index === processList.length - 1 && process.status === 'PENDING'
      return (
        <span key={index} style={{ display: 'flex' }}>
          <Typography.Text
            type={type}
            style={{ maxWidth: 250 }}
            className={isSwapping && isLastPendingProcess ? 'flashing' : undefined}>
            <p>{renderProcessMessage(process)}</p>

            {hasFailed && (
              <Typography.Text type="secondary" style={{ whiteSpace: 'pre-wrap' }}>
                {renderProcessError(step, process)}
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
        <Avatar size="small" src={chain.logoURI} alt={chain.name}></Avatar>
      </Tooltip>
    )
  }

  const getAvatar = (toolKey: StepTool) => {
    const tool = findTool(toolKey)
    return (
      <Tooltip title={tool?.name}>
        <Avatar size="small" src={tool?.logoURI} alt={tool?.name}></Avatar>
      </Tooltip>
    )
  }

  const parseStepToTimeline = (step: Step, index: number) => {
    const executionSteps = parseExecution(step)
    const isDone = step.execution && step.execution.status === 'DONE'
    const isLoading = isSwapping && step.execution && step.execution.status === 'PENDING'
    const isPaused = !isSwapping && step.execution && step.execution.status === 'PENDING'
    const color = isDone ? 'green' : step.execution ? 'blue' : 'gray'
    const executionDuration = !!step.estimate.executionDuration && (
      <>
        <br />
        <span>Estimated duration: {parseSecondsAsTime(step.estimate.executionDuration)} min</span>
      </>
    )

    switch (step.type) {
      case 'swap': {
        return [
          <Timeline.Item
            position={isMobile ? 'right' : 'right'}
            key={index + '_left'}
            color={color}>
            <h4>Swap on {getAvatar(step.tool)}</h4>
            <span>
              {formatTokenAmount(step.action.fromToken, step.estimate?.fromAmount)}{' '}
              <ArrowRightOutlined />{' '}
              {formatTokenAmount(step.action.toToken, step.estimate?.toAmount)}
            </span>
            {executionDuration}
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
        return [
          <Timeline.Item
            position={isMobile ? 'right' : 'right'}
            key={index + '_left'}
            color={color}>
            <h4>
              Transfer from {getChainAvatar(getChainById(action.fromChainId).key)} to{' '}
              {getChainAvatar(getChainById(action.toChainId).key)} via {getAvatar(step.tool)}
            </h4>
            <span>
              {formatTokenAmount(action.fromToken, estimate.fromAmount)} <ArrowRightOutlined />{' '}
              {formatTokenAmount(action.toToken, estimate.toAmount)}
            </span>
            {executionDuration}
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
              {getChainAvatar(getChainById(step.action.toChainId).key)} via {getAvatar(step.tool)}
            </h4>
            <span>
              {formatTokenAmount(step.action.fromToken, step.estimate?.fromAmount)}{' '}
              <ArrowRightOutlined />{' '}
              {formatTokenAmount(step.action.toToken, step.estimate?.toAmount)}
            </span>
            {executionDuration}
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

  const startCrossChainSwap = async () => {
    if (!web3.account || !web3.library) return

    const signer = web3.library.getSigner()

    const settings: ExecutionSettings = {
      updateCallback: updateCallback,
      switchChainHook: switchChainHook,
      decryptHook: options.encryption
        ? getEthereumDecryptionHook(await signer.getAddress())
        : undefined,
      getPublicKeyHook: options.encryption
        ? getEthereumPublicKeyHook(await signer.getAddress())
        : undefined,
    }
    storeRoute(route)
    setIsSwapping(true)
    setSwapStartedAt(Date.now())
    try {
      await LiFi.executeRoute(signer, route, settings)
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Execution failed!', route)
      // eslint-disable-next-line no-console
      console.error(e)
      Notification.showNotification(NotificationType.TRANSACTION_ERROR)
      setIsSwapping(false)
      return
    }
    setFinalTokenAmount(await getFinalBalance(web3.account!, route))
    setIsSwapping(false)
    setSwapDoneAt(Date.now())
    Notification.showNotification(NotificationType.TRANSACTION_SUCCESSFULL)
    onSwapDone()
  }

  const resumeExecution = async () => {
    if (!web3.account || !web3.library) return
    const signer = web3.library.getSigner()

    const settings: ExecutionSettings = {
      updateCallback,
      switchChainHook,
      decryptHook: options.encryption
        ? getEthereumDecryptionHook(await signer.getAddress())
        : undefined,
      getPublicKeyHook: options.encryption
        ? getEthereumPublicKeyHook(await signer.getAddress())
        : undefined,
    }

    setIsSwapping(true)
    try {
      await LiFi.resumeRoute(web3.library.getSigner(), route, settings)
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Execution failed!', route)
      // eslint-disable-next-line no-console
      console.error(e)
      Notification.showNotification(NotificationType.TRANSACTION_ERROR)
      setIsSwapping(false)
      return
    }
    setFinalTokenAmount(await getFinalBalance(web3.account!, route))
    setIsSwapping(false)
    setSwapDoneAt(Date.now())
    Notification.showNotification(NotificationType.TRANSACTION_SUCCESSFULL)
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

  const switchChainHook = async (requiredChainId: number) => {
    if (!web3.account || !web3.library) return
    if ((await web3.library.getSigner().getChainId()) !== requiredChainId) {
      const switched = await switchChain(requiredChainId)
      if (!switched) {
        throw new Error('Chain was not switched')
      }
    }
    return web3.library.getSigner()
  }

  // called on every execution status change
  const updateCallback = (updatedRoute: Route) => {
    storeRoute(updatedRoute)
    updateRoute(updatedRoute)
  }

  const getMainButton = () => {
    // PENDING
    if (isSwapping) {
      return <></>
    }
    const isCrossChainSwap = !!steps.find((step) => isCrossStep(step) || isLifiStep(step))

    // DONE
    const isDone = steps.filter((step) => step.execution?.status !== 'DONE').length === 0
    if (isDone) {
      const lastStep = steps[steps.length - 1]
      const { toChain } = getReceivingInfo(lastStep)
      const receivedAmount = lastStep.execution?.toAmount
      return (
        <Space direction="vertical">
          <Typography.Text strong>Swap Successful!</Typography.Text>
          {finalTokenAmount &&
            (finalTokenAmount.address === constants.AddressZero ? (
              <>
                {!!receivedAmount && (
                  <>
                    <Typography.Text>
                      {'You received '}
                      {new BigNumber(receivedAmount)
                        .shiftedBy(-finalTokenAmount.decimals)
                        .toFixed(4)}
                      {` ${finalTokenAmount.symbol}`}
                    </Typography.Text>
                    <br />
                  </>
                )}
                <Typography.Text
                  type={receivedAmount ? 'secondary' : undefined}
                  style={{ fontSize: receivedAmount ? 12 : 14 }}>
                  {'You now have '}
                  {new BigNumber(finalTokenAmount.amount).toFixed(4)}
                  {` ${finalTokenAmount.symbol}`}
                  {` on ${toChain.name}`}
                </Typography.Text>
              </>
            ) : (
              <Tooltip title="Click to add this token to your wallet.">
                <span
                  style={{ cursor: 'copy' }}
                  onClick={() => switchChainAndAddToken(toChain.id, finalTokenAmount)}>
                  {!!receivedAmount && (
                    <>
                      <Typography.Text>
                        {'You received '}
                        {new BigNumber(receivedAmount)
                          .shiftedBy(-finalTokenAmount.decimals)
                          .toFixed(4)}
                        {` ${finalTokenAmount.symbol}`}
                      </Typography.Text>
                      <br />
                    </>
                  )}
                  <Typography.Text
                    type={receivedAmount ? 'secondary' : undefined}
                    style={{ fontSize: receivedAmount ? 12 : 14 }}>
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

    const chainSwitchRequired = steps.some(
      (step) => step.execution?.status === 'CHAIN_SWITCH_REQUIRED',
    )
    if (chainSwitchRequired) {
      return <></>
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
