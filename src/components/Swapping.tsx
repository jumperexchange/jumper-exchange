import { ArrowRightOutlined, LoadingOutlined } from '@ant-design/icons'
import { Web3Provider } from '@ethersproject/providers'
import {
  Chain,
  ChainKey,
  CrossAction,
  CrossEstimate,
  CrossStep,
  Execution,
  getChainById,
  getChainByKey,
  SwapAction,
  SwapEstimate,
  SwapStep,
  Token,
} from '@lifinance/types'
import { useWeb3React } from '@web3-react/core'
import { Avatar, Button, Divider, Row, Space, Spin, Timeline, Tooltip, Typography } from 'antd'
import { BigNumber } from 'bignumber.js'
import { useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import { Link } from 'react-router-dom'

import connextIcon from '../assets/icons/connext.png'
import hopIcon from '../assets/icons/hop.png'
import oneinchIcon from '../assets/icons/oneinch.png'
import paraswapIcon from '../assets/icons/paraswap.png'
import walletIcon from '../assets/wallet.png'
import { executeOneInchSwap } from '../services/1inch.execute'
import { getBalancesForWallet } from '../services/balanceService'
import { executeHopCross } from '../services/hop.execute'
import { executeHorizonCross } from '../services/horizon.execute'
import { lifinance } from '../services/lifinance'
import { addToken, switchChain } from '../services/metamask'
import { executeNXTPCross } from '../services/nxtp.execute'
import { executeParaswap } from '../services/paraswap.execute'
import {
  createAndPushProcess,
  initStatus,
  setStatusDone,
  setStatusFailed,
} from '../services/status'
import { executeUniswap } from '../services/uniswaps.execute'
import { formatTokenAmount } from '../services/utils'
import { ChainPortfolio, getIcon, TransferStep } from '../types'
import Clock from './Clock'
import LoadingIndicator from './LoadingIndicator'

interface SwappingProps {
  route: Array<TransferStep>
  updateRoute: Function
  onSwapDone: Function
}

const Swapping = ({ route, updateRoute, onSwapDone }: SwappingProps) => {
  const isMobile = useMediaQuery({ query: `(max-width: 760px)` })

  const [swapStartedAt, setSwapStartedAt] = useState<number>()
  const [swapDoneAt, setSwapDoneAt] = useState<number>()
  const [isSwapping, setIsSwapping] = useState<boolean>(false)
  const [alerts] = useState<Array<JSX.Element>>([])
  const [finalBalance, setFinalBalance] = useState<{ token: Token; portfolio: ChainPortfolio }>()

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
      setIsSwapping(false)
      return false
    }
    setStatusDone(update, status, switchProcess)
    return true
  }

  const triggerSwap = async (step: SwapStep, previousStep?: TransferStep) => {
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
      case 'spookyswap':
      case 'viperswap':
      case 'sushiswap':
        return await executeUniswap(
          swapAction.chainId,
          web3.library.getSigner(),
          swapAction.token,
          swapAction.toToken,
          fromAmount,
          fromAddress,
          toAddress,
          swapEstimate.data.path,
          (status: Execution) => updateStatus(step, status),
        )
      case 'paraswap':
        return await executeParaswap(
          web3.library.getSigner(),
          swapAction,
          swapEstimate,
          fromAmount,
          fromAddress,
          toAddress,
          (status: Execution) => updateStatus(step, status),
        )
      case '1inch':
        return await executeOneInchSwap(
          web3.library.getSigner(),
          swapAction,
          swapEstimate,
          fromAmount,
          fromAddress,
          toAddress,
          (status: Execution) => updateStatus(step, status),
        )
      default:
        throw new Error('Should never reach here, swap not defined')
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
        return await executeNXTPCross(
          web3.library.getSigner(),
          step,
          fromAmount,
          web3.account,
          (status: Execution) => updateStatus(step, status),
        )
      case 'hop':
        return await executeHopCross(
          web3.library.getSigner(),
          crossAction.token.key,
          fromAmount.toFixed(0),
          crossAction.chainId,
          crossAction.toChainId,
          (status: Execution) => updateStatus(step, status),
        )
      case 'horizon':
        return await executeHorizonCross(
          crossAction.token,
          fromAmount,
          crossAction.chainId,
          crossAction.toChainId,
          web3.account,
          (status: Execution) => updateStatus(step, status),
        )
      default:
        throw new Error('Should never reach here, bridge not defined')
    }
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
            className={process.status === 'PENDING' ? 'flashing' : undefined}>
            <p>{process.message}</p>
            {hasFailed && (
              <Typography.Text type="secondary" style={{ whiteSpace: 'pre-wrap' }}>
                {'errorCode' in process && `Error Code: ${process.errorCode} \n`}
                {`${process.errorMessage.substring(0, 150)}${
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

  const getExchangeAvatar = (chainId: number) => {
    const chain = getChainById(chainId)

    return (
      <Tooltip title={chain.exchange?.name}>
        <Avatar
          size="small"
          src={getIcon(chain.exchange?.name)}
          alt={chain.exchange?.name}></Avatar>
      </Tooltip>
    )
  }

  const connextAvatar = (
    <Tooltip title="Connext">
      <Avatar size="small" src={connextIcon} alt="Connext"></Avatar>
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

  const parseStepToTimeline = (step: TransferStep, index: number, route: Array<TransferStep>) => {
    const executionSteps = parseExecution(step.execution)
    const isDone = step.execution && step.execution.status === 'DONE'
    const isLoading = step.execution && step.execution.status === 'PENDING'
    const color = isDone ? 'green' : step.execution ? 'blue' : 'gray'

    switch (step.action.type) {
      case 'swap': {
        return [
          <Timeline.Item
            position={isMobile ? 'right' : 'right'}
            key={index + '_left'}
            color={color}>
            <h4>
              Swap on{' '}
              {step.action.tool === '1inch'
                ? oneinchAvatar
                : step.action.tool === 'paraswap'
                ? paraswapAvatar
                : getExchangeAvatar(step.action.chainId)}
            </h4>
            <span>
              {formatTokenAmount(step.action.token, step.estimate?.fromAmount)}{' '}
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

      case 'cross': {
        const crossAction = step.action as CrossAction
        const crossEstimate = step.estimate as CrossEstimate
        let avatar
        switch (crossAction.tool) {
          case 'nxtp':
            avatar = connextAvatar
            break
          case 'hop':
            avatar = hopAvatar
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
              Transfer from {getChainAvatar(getChainById(crossAction.chainId).key)} to{' '}
              {getChainAvatar(getChainById(crossAction.toChainId).key)} via {avatar}
            </h4>
            <span>
              {formatTokenAmount(crossAction.token, crossEstimate.fromAmount)}{' '}
              <ArrowRightOutlined />{' '}
              {formatTokenAmount(crossAction.toToken, crossEstimate.toAmount)}
            </span>
          </Timeline.Item>,
          <Timeline.Item
            position={isMobile ? 'right' : 'left'}
            style={{ paddingBottom: isMobile ? 30 : 0 }}
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

  const triggerStep = async (index: number, route: Array<TransferStep>) => {
    setIsSwapping(true)
    const step = route[index]
    const previousStep = index > 0 ? route[index - 1] : undefined
    try {
      switch (step.action.type) {
        case 'swap':
          return await triggerSwap(step as SwapStep, previousStep)
        case 'cross':
          return await triggerCross(step, previousStep)
        default:
          setIsSwapping(false)
          throw new Error('Invalid Step')
      }
    } catch {
      setIsSwapping(false)
    }
  }

  const triggerLifi = async () => {
    // ensure chain is set
    if (web3.chainId !== route[0].action.chainId) {
      if (!(await checkChain(route[0]))) return
    }

    lifinance.executeLifi(web3.library!.getSigner(), route, (status: Execution) =>
      updateStatus(route[0], status),
    )
  }

  const isLifiSupported = (route: Array<TransferStep>) => {
    const crossStep = route.find((step) => step.action.type === 'cross')
    if (!crossStep) return false // perform simple swaps directly

    const crossAction = crossStep.action as CrossAction

    return (
      crossAction.tool === 'nxtp' &&
      lifinance.supportedChains.includes(crossAction.chainId) &&
      lifinance.supportedChains.includes(crossAction.toChainId)
    )
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

  const getRecevingInfo = (step: TransferStep) => {
    let toChain: Chain, toToken: Token
    switch (step.action.type) {
      case 'cross':
        toChain = getChainById((step as CrossStep).action.toChainId)
        toToken = (step as CrossStep).action.toToken
        break
      case 'swap':
        toChain = getChainById((step as SwapStep).action.chainId)
        toToken = (step as SwapStep).action.toToken
        break
      default:
        toChain = getChainById(step.action.chainId)
        toToken = step.action.token
    }
    return { toChain, toToken }
  }

  const getFinalBalace = async (route: TransferStep[]) => {
    const lastStep = route[route.length - 1]
    const { toChain, toToken } = getRecevingInfo(lastStep)
    const portfolio = await getBalancesForWallet(web3.account!, [toChain.id])
    const chainPortfolio = portfolio[toChain.key].find((coin) => coin.id === toToken.id)
    setFinalBalance({ token: toToken, portfolio: chainPortfolio! })
  }

  // check where we are an trigger next
  const checkSwapping = async () => {
    if (!isSwapping) return

    // lifi supported?
    if (isLifiSupported(route)) {
      if (!route[0].execution) {
        triggerLifi()
      } else if (route[0].execution.status === 'DONE') {
        await getFinalBalace(route)
        setIsSwapping(false)
        setSwapDoneAt(Date.now())
        onSwapDone()
      }
      return
    }

    for (let index = 0; index < route.length; index++) {
      if (!route[index].execution) {
        return triggerStep(index, route).catch(() => {
          // stop if a step fails
          setIsSwapping(false)
        })
      } else if (route[index].execution?.status === 'DONE') {
        continue // step is already done, continue
      } else {
        return // step is already runing, wait
      }
    }
    await getFinalBalace(route)
    setIsSwapping(false)
    setSwapDoneAt(Date.now())
    onSwapDone()
  }
  checkSwapping()

  const getMainButton = () => {
    // PENDING
    if (isSwapping) {
      return <></>
    }

    // DONE
    const isDone = route.filter((step) => step.execution?.status !== 'DONE').length === 0
    if (isDone) {
      const lastStep = route[route.length - 1]
      const { toChain } = getRecevingInfo(lastStep)
      return (
        <Space direction="vertical">
          <Typography.Text strong>Swap Successful!</Typography.Text>
          {finalBalance && (
            <Tooltip title="Click to add this token to your wallet.">
              <span
                style={{ cursor: 'copy' }}
                onClick={async () => {
                  if (web3.chainId !== toChain.id) {
                    await switchChain(toChain.id)
                    await (window as any).ethereum.once('networkChanged', async (id: any) => {
                      await addToken(finalBalance.token)
                    })
                  } else {
                    await addToken(finalBalance.token)
                  }
                }}>
                <Typography.Text>
                  {'You now have '}
                  {finalBalance?.portfolio.amount.toString().substring(0, 8)}
                  {` ${finalBalance?.portfolio.symbol}`}
                  {` on ${toChain.name}`}
                </Typography.Text>
              </span>
            </Tooltip>
          )}
          <Link to="/dashboard">
            <Button type="link">Dashboard</Button>
          </Link>
        </Space>
      )
    }

    // FAILED
    const isFailed = route.filter((step) => step.execution?.status === 'FAILED').length > 0
    if (isFailed) {
      return (
        <Button type="primary" onClick={() => restartCrossChainSwap()} style={{ marginTop: 10 }}>
          Restart from Failed Step
        </Button>
      )
    }

    // NOT_STARTED
    const isCrossChainSwap = route.filter((step) => step.action.type === 'cross').length > 0
    return (
      <Button type="primary" onClick={() => startCrossChainSwap()} style={{ marginTop: 10 }}>
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

  return (
    <>
      {alerts}
      <br />

      <Timeline mode={isMobile ? 'left' : 'alternate'} className="swapping-modal-timeline">
        {/* Steps */}
        {route.map(parseStepToTimeline)}
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

        {currentProcess && currentProcess.status === 'ACTION_REQUIRED' && (
          <>
            <Row justify="center" style={{ marginBottom: 6 }}>
              <Typography.Text>{currentProcess.message}</Typography.Text>
            </Row>
            <Row justify="center">
              <img src={walletIcon} alt="Please Check Your Wallet" />
            </Row>
          </>
        )}

        {currentProcess && currentProcess.status === 'PENDING' && (
          <>
            <Row justify="center">
              <Typography.Text className="flashing">{currentProcess.message}</Typography.Text>
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
