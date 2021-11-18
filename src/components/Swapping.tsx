import { ArrowRightOutlined, LoadingOutlined, PauseCircleOutlined } from '@ant-design/icons'
import { Web3Provider } from '@ethersproject/providers'
import { useWeb3React } from '@web3-react/core'
import { Avatar, Button, Divider, Row, Space, Spin, Timeline, Tooltip, Typography } from 'antd'
import { BigNumber } from 'bignumber.js'
import { constants } from 'ethers'
import { useCallback, useEffect, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import { Link } from 'react-router-dom'

import connextIcon from '../assets/icons/connext.png'
import harmonyIcon from '../assets/icons/harmony.png'
import hopIcon from '../assets/icons/hop.png'
import oneinchIcon from '../assets/icons/oneinch.png'
import paraswapIcon from '../assets/icons/paraswap.png'
import walletIcon from '../assets/wallet.png'
import { oneInch } from '../services/1Inch'
import { getBalancesForWallet } from '../services/balanceService'
import { HopExecutionManager } from '../services/hop.execute'
import { HorizonExecutionManager } from '../services/horizon.execute'
import { lifinance } from '../services/lifinance'
import { storeActiveRoute } from '../services/localStorage'
import { switchChain, switchChainAndAddToken } from '../services/metamask'
import { NXTPExecutionManager } from '../services/nxtp.execute'
import { paraswap } from '../services/paraswap'
import { renderProcessMessage } from '../services/processRenderer'
import {
  createAndPushProcess,
  initStatus,
  setStatusDone,
  setStatusFailed,
} from '../services/status'
import SwapExecutionManager from '../services/swap.execute'
import { uniswap } from '../services/uniswaps'
import { formatTokenAmount } from '../services/utils'
import {
  ChainKey,
  ChainPortfolio,
  Execution,
  getChainById,
  getChainByKey,
  getIcon,
  Process,
  Route,
  Step,
  SwapStep,
  Token,
} from '../types'
import Clock from './Clock'
import LoadingIndicator from './LoadingIndicator'

interface SwappingProps {
  route: Route
  updateRoute: Function
  onSwapDone: Function
}

const getFinalBalace = async (account: string, route: Route) => {
  const lastStep = route.steps[route.steps.length - 1]
  const { toChain, toToken } = getRecevingInfo(lastStep)
  const portfolio = await getBalancesForWallet(account, [toChain.id])
  const chainPortfolio = portfolio[toChain.key].find((coin) => coin.id === toToken.id)
  return { token: toToken, portfolio: chainPortfolio! }
}

const getRecevingInfo = (step: Step) => {
  const toChain = getChainById(step.action.toChainId)
  const toToken = step.action.toToken
  return { toChain, toToken }
}

const isLifiSupported = (route: Route) => {
  const crossStep = route.steps.find((step) => step.type === 'cross')
  if (!crossStep) return false // perform simple swaps directly

  const crossAction = crossStep.action

  return (
    crossStep.tool === 'nxtp' &&
    lifinance.supportedChains.includes(crossAction.fromChainId) &&
    lifinance.supportedChains.includes(crossAction.toChainId)
  )
}

const Swapping = ({ route, updateRoute, onSwapDone }: SwappingProps) => {
  const { steps } = route

  const isMobile = useMediaQuery({ query: `(max-width: 760px)` })

  const [swapStartedAt, setSwapStartedAt] = useState<number>()
  const [swapDoneAt, setSwapDoneAt] = useState<number>()
  const [isSwapping, setIsSwapping] = useState<boolean>(false)
  const [alerts] = useState<Array<JSX.Element>>([])
  const [finalBalance, setFinalBalance] = useState<{ token: Token; portfolio: ChainPortfolio }>()

  const [swapExecutionManager] = useState<SwapExecutionManager>(new SwapExecutionManager())
  const [nxtpExecutionManager] = useState<NXTPExecutionManager>(new NXTPExecutionManager())
  const [hopExecutionManager] = useState<HopExecutionManager>(new HopExecutionManager())
  const [horizonExecutionManager] = useState<HorizonExecutionManager>(new HorizonExecutionManager())

  // Wallet
  const web3 = useWeb3React<Web3Provider>()

  useEffect(() => {
    return () => {
      swapExecutionManager.setShouldContinue(false)
      nxtpExecutionManager.setShouldContinue(false)
      hopExecutionManager.setShouldContinue(false)
      horizonExecutionManager.setShouldContinue(false)
    }
  }, [swapExecutionManager, nxtpExecutionManager, hopExecutionManager, horizonExecutionManager])

  // Swap
  const updateStatus = useCallback(
    (step: Step, status: Execution) => {
      step.execution = status
      storeActiveRoute(route)
      updateRoute(route)
    },
    [route, updateRoute],
  )

  const checkChain = useCallback(
    async (step: Step) => {
      const { status, update } = initStatus(
        (status: Execution) => updateStatus(step, status),
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
    },
    [updateStatus],
  )

  const triggerSwap = useCallback(
    async (step: SwapStep, previousStep?: Step) => {
      if (!web3.account || !web3.library) return

      // update amount using output of previous execution. In the future this should be handled by calling `updateRoute`
      if (previousStep && previousStep.execution && previousStep.execution.toAmount) {
        step.action.fromAmount = previousStep.execution.toAmount
      }

      // ensure chain is set
      if (web3.chainId !== step.action.fromChainId) {
        if (!(await checkChain(step))) return
      }

      const swapParams = {
        signer: web3.library.getSigner(),
        step,
        updateStatus: (status: Execution) => updateStatus(step, status),
      }

      switch (step.tool) {
        case 'paraswap':
          return await swapExecutionManager.executeSwap({
            ...swapParams,
            parseReceipt: paraswap.parseReceipt,
          })
        case '1inch':
          return await swapExecutionManager.executeSwap({
            ...swapParams,
            parseReceipt: oneInch.parseReceipt,
          })
        default:
          return await swapExecutionManager.executeSwap({
            ...swapParams,
            parseReceipt: uniswap.parseReceipt,
          })
      }
    },
    [web3, checkChain, updateStatus, swapExecutionManager],
  )

  const triggerCross = useCallback(
    async (step: Step, previousStep?: Step) => {
      if (!web3.account || !web3.library) return
      const crossAction = step.action
      const crossExecution = step.execution

      // get right amount
      let fromAmount: BigNumber
      if (previousStep && previousStep.execution && previousStep.execution.toAmount) {
        fromAmount = new BigNumber(previousStep.execution.toAmount)
        fromAmount = new BigNumber(previousStep.execution.toAmount)
      } else {
        fromAmount = new BigNumber(crossAction.fromAmount)
      }

      // ensure chain is set
      if (web3.chainId !== step.action.fromChainId) {
        if (!(await checkChain(step))) return
      }

      switch (step.tool) {
        case 'nxtp':
          return await nxtpExecutionManager.executeCross(
            web3.library.getSigner(),
            step,
            fromAmount,
            web3.account,
            (status: Execution) => updateStatus(step, status),
            crossExecution,
          )
        case 'hop':
          return await hopExecutionManager.executeCross(
            web3.library.getSigner(),
            crossAction.fromToken.key,
            fromAmount.toFixed(0),
            crossAction.fromChainId,
            crossAction.toChainId,
            (status: Execution) => updateStatus(step, status),
            crossExecution,
          )
        case 'horizon':
          return await horizonExecutionManager.executeCross(
            crossAction.fromToken,
            fromAmount,
            crossAction.fromChainId,
            crossAction.toChainId,
            web3.account,
            (status: Execution) => updateStatus(step, status),
            crossExecution,
          )
        default:
          throw new Error('Should never reach here, bridge not defined')
      }
    },
    [
      web3,
      updateStatus,
      checkChain,
      nxtpExecutionManager,
      hopExecutionManager,
      horizonExecutionManager,
    ],
  )

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

      default:
        // eslint-disable-next-line no-console
        console.warn('should never reach here')
    }
  }

  const triggerStep = useCallback(
    async (index: number) => {
      // setIsSwapping(true)
      const step = steps[index]
      const previousStep = index > 0 ? steps[index - 1] : undefined
      const { status, update } = initStatus(
        (status: Execution) => updateStatus(step, status),
        steps[index].execution,
      )
      try {
        switch (step.type) {
          case 'swap':
            return await triggerSwap(step, previousStep)
          case 'cross':
            await await triggerCross(step, previousStep)
            break
          default:
            setIsSwapping(false)
            throw new Error('Invalid Step')
        }
      } catch (e: any) {
        const lastProcess = status.process[status.process.length - 1] as Process
        if (lastProcess.status === 'FAILED') {
          // already set to failed. don't reset
          setIsSwapping(false)
          return
        }
        if (e.message) lastProcess.errorMessage = e.message
        if (e.code) lastProcess.errorCode = e.code
        setStatusFailed(update, status, lastProcess)
        setIsSwapping(false)
        return
      }
    },
    [triggerCross, triggerSwap, updateStatus],
  )

  const triggerLifi = useCallback(async () => {
    // ensure chain is set
    if (web3.chainId !== steps[0].action.fromChainId) {
      if (!(await checkChain(steps[0]))) return
    }

    await lifinance.executeLifi(web3.library!.getSigner(), route, (status: Execution) =>
      updateStatus(steps[0], status),
    )
  }, [route, updateStatus, checkChain, web3.chainId, web3.library])

  const startCrossChainSwap = async () => {
    storeActiveRoute(route)
    setIsSwapping(true)
    setSwapStartedAt(Date.now())
  }

  const resumeCrossChainSwap = useCallback(async () => {
    for (let index = 0; index < steps.length; index++) {
      if (steps[index].execution?.status === 'PENDING') {
        steps[index].execution!.status = 'RESUME'
        updateRoute(route)
        break
      }
    }
    setIsSwapping(true)
  }, [route, updateRoute])

  const restartCrossChainSwap = async () => {
    // remove failed
    for (let index = 0; index < steps.length; index++) {
      if (steps[index].execution?.status === 'FAILED') {
        steps[index].execution = undefined
        updateRoute(route)
      }
    }
    // start again
    setIsSwapping(true)
  }

  // check where we are an trigger next
  useEffect(() => {
    const checkSwapping = async () => {
      if (!isSwapping) {
        const allDone = steps.every((step) => step.execution?.status === 'DONE')
        const isFailed = steps.some((step) => step.execution?.status === 'FAILED')
        const alreadyStarted = steps.some((step) => step.execution)
        const resuming = steps.some((step) => step.execution?.status === 'RESUME')
        if (!allDone && !isFailed && alreadyStarted && !resuming) {
          await resumeCrossChainSwap()
          return
        } else {
          return
        }
      }
      // lifi supported?
      if (isLifiSupported(route)) {
        if (!steps[0].execution) {
          triggerLifi()
        } else if (steps[0].execution.status === 'DONE') {
          setFinalBalance(await getFinalBalace(web3.account!, route))
          setIsSwapping(false)
          setSwapDoneAt(Date.now())
          onSwapDone()
        }
        return
      }

      for (let index = 0; index < steps.length; index++) {
        if (!steps[index].execution) {
          return triggerStep(index).catch(() => {
            // stop if a step fails
            setIsSwapping(false)
          })
        } else if (steps[index].execution?.status === 'RESUME') {
          return triggerStep(index).catch(() => {
            // stop if a step fails
            setIsSwapping(false)
          })
        } else if (steps[index].execution?.status === 'DONE') {
          continue // step is already done, continue
        } else {
          return // step is already runing, wait
        }
      }
      setFinalBalance(await getFinalBalace(web3.account!, route))
      setIsSwapping(false)
      setSwapDoneAt(Date.now())
      onSwapDone()
    }
    checkSwapping()
  }, [isSwapping, updateStatus]) // eslint-disable-line react-hooks/exhaustive-deps

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
          {finalBalance &&
            finalBalance.portfolio &&
            (finalBalance.token.id === constants.AddressZero ? (
              <Typography.Text>
                {'You now have '}
                {finalBalance.portfolio.amount.toFixed(4)}
                {` ${finalBalance.portfolio.symbol}`}
                {` on ${toChain.name}`}
              </Typography.Text>
            ) : (
              <Tooltip title="Click to add this token to your wallet.">
                <span
                  style={{ cursor: 'copy' }}
                  onClick={() => switchChainAndAddToken(toChain.id, finalBalance.token)}>
                  <Typography.Text>
                    {'You now have '}
                    {finalBalance.portfolio.amount.toFixed(4)}
                    {` ${finalBalance.portfolio.symbol}`}
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
