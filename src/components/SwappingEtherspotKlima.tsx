import { ArrowRightOutlined, LoadingOutlined, PauseCircleOutlined } from '@ant-design/icons'
import { Web3Provider } from '@ethersproject/providers'
import { ChainId, Execution, ExecutionSettings, Process, StepTool } from '@lifinance/sdk'
import { useWeb3React } from '@web3-react/core'
import {
  Avatar,
  Button,
  Divider,
  Modal,
  Row,
  Space,
  Spin,
  Timeline,
  Tooltip,
  Typography,
} from 'antd'
import BigNumber from 'bignumber.js'
import { BigNumberish, constants, ethers } from 'ethers'
import { GatewayBatchStates, Sdk } from 'etherspot'
import { useEffect, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import { Link } from 'react-router-dom'

import walletIcon from '../assets/wallet.png'
import {
  erc20Abi,
  KLIMA_ADDRESS,
  sKLIMA_ADDRESS,
  STAKE_KLIMA_CONTRACT_ADDRESS,
  stakeKlimaAbi,
} from '../constants'
import LiFi from '../LiFi'
import { isWalletConnectWallet, storeRoute } from '../services/localStorage'
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
import { WalletConnectChainSwitchModal } from './WalletConnectChainSwitchModal'

const SKLIMA_TOKEN_POL = {
  symbol: 'sKLIMA',
  decimals: 9,
  name: 'sKLIMA',
  chainId: 137,
  address: sKLIMA_ADDRESS,
}

interface SwapSettings {
  infiniteApproval: boolean
}

interface SwappingProps {
  route: { lifiRoute: Route; gasStep: Step; klimaStep: Step }
  etherspot?: Sdk
  settings: SwapSettings
  updateRoute: Function
  onSwapDone: Function
  fixedRecipient?: boolean
}

const getSetAllowanceTransaction = async (
  tokenAddress: string,
  approvalAddress: string,
  amount: BigNumberish,
) => {
  const erc20 = new ethers.Contract(tokenAddress, erc20Abi)
  return erc20.populateTransaction.approve(approvalAddress, amount)
}

const getStakeKlimaTransaction = (amount: BigNumberish) => {
  const contract = new ethers.Contract(STAKE_KLIMA_CONTRACT_ADDRESS, stakeKlimaAbi)
  return contract.populateTransaction.stake(amount)
}
const getTransferTransaction = async (
  tokenAddress: string,
  toAddress: string,
  amount: BigNumberish,
) => {
  const erc20 = new ethers.Contract(tokenAddress, erc20Abi)
  return erc20.populateTransaction.transfer(toAddress, amount)
}

const SwappingEtherspotKlima = ({
  route,
  etherspot,
  updateRoute,
  settings,
  onSwapDone,
}: SwappingProps) => {
  const { steps } = route.lifiRoute

  const isMobile = useMediaQuery({ query: `(max-width: 760px)` })

  const [swapStartedAt, setSwapStartedAt] = useState<number>()
  const [swapDoneAt, setSwapDoneAt] = useState<number>()
  const [isSwapping, setIsSwapping] = useState<boolean>(false)
  const [alerts] = useState<Array<JSX.Element>>([])
  const [finalTokenAmount, setFinalTokenAmount] = useState<TokenAmount | null>()
  const [showWalletConnectChainSwitchModal, setShowWalletConnectChainSwitchModal] = useState<{
    show: boolean
    chainId: number
    promiseResolver?: Function
  }>({ show: false, chainId: 1 })
  const [etherspotStepExecution, setEtherspotStepExecution] = useState<Execution>()
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
      LiFi.moveExecutionToBackground(route.lifiRoute)
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
                {renderProcessError(process)}
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

    const executionItem = [
      <Timeline.Item
        position={isMobile ? 'right' : 'left'}
        key={index + '_right'}
        color={color}
        dot={isLoading ? <LoadingOutlined /> : isPaused ? <PauseCircleOutlined /> : null}>
        {executionSteps}
      </Timeline.Item>,
    ]

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
          !!step.execution || route.lifiRoute.steps.length - 1 === index ? executionItem : <></>,
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
          !!step.execution || route.lifiRoute.steps.length - 1 === index ? executionItem : <></>,
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
          !!step.execution || route.lifiRoute.steps.length - 1 === index ? executionItem : <></>,
        ]
      }

      default:
        // eslint-disable-next-line no-console
        console.warn('should never reach here')
    }
  }

  const prepareEtherSpotStep = async () => {
    if (!etherspot) {
      throw new Error('Etherspot not initialized.')
    }
    const tokenPolygonKLIMAPromise = LiFi.getToken(ChainId.POL, KLIMA_ADDRESS)!
    const tokenPolygonSKLIMAPromise = LiFi.getToken(ChainId.POL, sKLIMA_ADDRESS)!

    const gasStepRefreshPromise = LiFi.getQuote({
      fromChain: route.gasStep.action.fromChainId,
      fromToken: route.gasStep.action.fromToken.address,
      fromAddress: etherspot.state.accountAddress!,
      fromAmount: route.gasStep.action.fromAmount, // TODO: check if correct value
      toChain: route.gasStep.action.fromChainId,
      toToken: route.gasStep.action.toToken.address, // hardcode return gastoken
      slippage: route.gasStep.action.slippage,
      integrator: 'lifi-etherspot',
      allowExchanges: [route.gasStep.tool],
    })
    const klimaStepRefreshPromise = LiFi.getQuote({
      fromChain: route.klimaStep.action.fromChainId,
      fromToken: route.klimaStep.action.fromToken.address,
      fromAddress: etherspot.state.accountAddress!,
      fromAmount: route.klimaStep.action.fromAmount, // TODO: check if correct value
      toChain: route.klimaStep.action.fromChainId,
      toToken: route.klimaStep.action.toToken.address, // hardcode return gastoken
      slippage: route.gasStep.action.slippage,
      integrator: 'lifi-etherspot',
      allowExchanges: [route.klimaStep.tool],
    })

    const resolvedPromises = await Promise.all([
      tokenPolygonKLIMAPromise,
      tokenPolygonSKLIMAPromise,
      gasStepRefreshPromise,
      klimaStepRefreshPromise,
    ])
    const tokenPolygonKLIMA = resolvedPromises[0]
    const tokenPolygonSKLIMA = resolvedPromises[1]
    route.gasStep = resolvedPromises[2]
    route.klimaStep = resolvedPromises[3]

    if (!route.gasStep.transactionRequest || !route.klimaStep.transactionRequest) {
      throw new Error('Swap transaction missing')
    }

    // reset gateway batch
    etherspot.clearGatewayBatch()

    const totalAmount = ethers.BigNumber.from(route.gasStep.estimate.fromAmount).add(
      route.klimaStep.estimate.fromAmount,
    )
    const txAllowTotal = await getSetAllowanceTransaction(
      route.gasStep.action.fromToken.address,
      route.gasStep.estimate.approvalAddress as string,
      totalAmount,
    )
    await etherspot.batchExecuteAccountTransaction({
      to: txAllowTotal.to as string,
      data: txAllowTotal.data as string,
    })

    // Swap
    await etherspot.batchExecuteAccountTransaction({
      to: route.gasStep.transactionRequest.to as string,
      data: route.gasStep.transactionRequest.data as string,
    })

    await etherspot.batchExecuteAccountTransaction({
      to: route.klimaStep.transactionRequest.to as string,
      data: route.klimaStep.transactionRequest.data as string,
    })
    const amountKlima = route.klimaStep.estimate.toAmountMin
    // approve KLIMA: e.g. https://polygonscan.com/tx/0xb1aca780869956f7a79d9915ff58fd47acbaf9b34f0eb13f9b18d1772f1abef2
    const txAllow = await getSetAllowanceTransaction(
      tokenPolygonKLIMA!.address,
      STAKE_KLIMA_CONTRACT_ADDRESS,
      amountKlima,
    )
    await etherspot.batchExecuteAccountTransaction({
      to: txAllow.to as string,
      data: txAllow.data as string,
    })

    // stake KLIMA: e.g. https://polygonscan.com/tx/0x5c392aa3487a1fa9e617c5697fe050d9d85930a44508ce74c90caf1bd36264bf
    const txStake = await getStakeKlimaTransaction(amountKlima)
    await etherspot.batchExecuteAccountTransaction({
      to: txStake.to as string,
      data: txStake.data as string,
    })
    const txTransfer = await getTransferTransaction(
      tokenPolygonSKLIMA!.address,
      web3.account!,
      amountKlima,
    )
    await etherspot.batchExecuteAccountTransaction({
      to: txTransfer.to as string,
      data: txTransfer.data as string,
    })
  }

  const startCrossChainSwap = async () => {
    if (!web3.account || !web3.library) return
    const signer = web3.library.getSigner()

    const executionSettings: ExecutionSettings = {
      updateCallback: updateCallback,
      switchChainHook: switchChainHook,
      infiniteApproval: settings.infiniteApproval,
    }
    storeRoute(route.lifiRoute)
    setIsSwapping(true)
    setSwapStartedAt(Date.now())
    try {
      await LiFi.executeRoute(signer, route.lifiRoute, executionSettings)
      await finalizeEtherSpotStep(await executeEtherspotStep())
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Execution failed!', route.lifiRoute)
      // eslint-disable-next-line no-console
      console.error(e)
      handlePotentialEtherSpotError(e)
      Notification.showNotification(NotificationType.TRANSACTION_ERROR)
      setIsSwapping(false)
      return
    }
    setIsSwapping(false)
    setSwapDoneAt(Date.now())
    Notification.showNotification(NotificationType.TRANSACTION_SUCCESSFULL)
    onSwapDone()
  }

  const resumeExecution = async () => {
    if (!web3.account || !web3.library) return

    const executionSettings: ExecutionSettings = {
      updateCallback,
      switchChainHook,
      infiniteApproval: settings.infiniteApproval,
    }

    setIsSwapping(true)
    try {
      await LiFi.resumeRoute(web3.library.getSigner(), route.lifiRoute, executionSettings)
      await finalizeEtherSpotStep(await executeEtherspotStep())
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Execution failed!', route)
      // eslint-disable-next-line no-console
      console.error(e)
      handlePotentialEtherSpotError(e)
      Notification.showNotification(NotificationType.TRANSACTION_ERROR)
      setIsSwapping(false)
      return
    }
    setIsSwapping(false)
    setSwapDoneAt(Date.now())
    Notification.showNotification(NotificationType.TRANSACTION_SUCCESSFULL)
    onSwapDone()
  }

  const restartCrossChainSwap = async () => {
    // remove failed

    for (let index = 0; index < steps.length; index++) {
      const stepHasFailed = steps[index].execution?.status === 'FAILED'
      // check if the step has been cancelled which is a "failed" state
      const stepHasBeenCancelled = steps[index].execution?.process.some(
        (process) => process.status === 'CANCELLED',
      )

      if (steps[index].execution && (stepHasFailed || stepHasBeenCancelled)) {
        steps[index].execution!.status = 'RESUME'
        steps[index].execution!.process.pop() // remove last (failed) process
        updateRoute(route.lifiRoute)
      }
    }
    if (etherspotStepExecution) {
      setEtherspotStepExecution(undefined)
    }
    // start again
    resumeExecution()
  }

  const handlePotentialEtherSpotError = (e: any) => {
    if (route.lifiRoute.steps.some((step) => step.execution?.status === 'FAILED')) {
      return
    }

    if (!etherspotStepExecution) {
      setEtherspotStepExecution({
        status: 'FAILED',
        process: [
          {
            errorMessage: e.errorMessage,
            status: 'FAILED',
            message: 'Prepare Transaction',
            startedAt: Date.now(),
            doneAt: Date.now(),
          },
        ],
      })
    } else {
      const processList = etherspotStepExecution.process
      processList[processList.length - 1].status = 'FAILED'
      processList[processList.length - 1].errorMessage = e.errorMessage
      processList[processList.length - 1].doneAt = Date.now()
      setEtherspotStepExecution({
        status: 'FAILED',
        process: processList,
      })
    }
  }

  const executeEtherspotStep = async () => {
    const processList: Process[] = []

    // FIXME: My be needed if user is bridging from chain which is not supported by etherspot
    if (!etherspot) {
      processList.push({
        id: 'chainSwitch',
        message: 'Switch Chain',
        startedAt: Date.now(),
        status: 'ACTION_REQUIRED',
      })
      setEtherspotStepExecution({
        status: 'ACTION_REQUIRED',
        process: processList,
      })

      await switchChain(ChainId.POL)
      const signer = web3.library!.getSigner()
      if ((await signer.getChainId()) !== ChainId.POL) {
        throw Error('Chain was not switched!')
      }

      processList.map((process) => {
        if (process.id === 'chainSwitch') {
          process.status = 'DONE'
          process.doneAt = Date.now()
        }
        return process
      })
    }
    if (!etherspot) {
      throw new Error('Etherspot not initialized.')
    }

    processList.push({
      id: 'prepare',
      message: 'Initialize Etherspot',
      startedAt: Date.now(),
      status: 'PENDING',
    })

    setEtherspotStepExecution({
      status: 'PENDING',
      process: processList,
    })
    await prepareEtherSpotStep()

    const estimate = await etherspot.estimateGatewayBatch()
    // eslint-disable-next-line no-console
    console.log(estimate)

    processList.map((process) => {
      if (process.id === 'prepare') {
        process.status = 'DONE'
        process.doneAt = Date.now()
      }
      return process
    })
    processList.push({
      id: 'sign',
      message: 'Provide Signature',
      startedAt: Date.now(),
      status: 'ACTION_REQUIRED',
    })
    setEtherspotStepExecution({
      status: 'ACTION_REQUIRED',
      process: processList,
    })
    let batch = await etherspot.submitGatewayBatch()
    processList.map((process) => {
      if (process.id === 'sign') {
        process.status = 'DONE'
        process.doneAt = Date.now()
      }
      return process
    })
    processList.push({
      id: 'wait',
      message: 'Wait For Execution',
      startedAt: Date.now(),
      status: 'PENDING',
    })
    setEtherspotStepExecution({
      status: 'PENDING',
      process: processList,
    })

    // info: batch.state seams to wait for a lot of confirmations (6 minutes) before changing to 'Sent'
    let isDone = !!(batch.transaction && batch.transaction.hash)
    while (!isDone) {
      batch = await etherspot.getGatewaySubmittedBatch({
        hash: batch.hash,
      })

      if (batch.state === GatewayBatchStates.Reverted) {
        // eslint-disable-next-line no-console
        console.error(batch)
        throw new Error('Execution Reverted')
      }

      isDone = !!(batch.transaction && batch.transaction.hash)
      if (!isDone) {
        await new Promise((resolve) => {
          setTimeout(resolve, 3000)
        })
      }
    }
    // eslint-disable-next-line no-console
    console.log('gateway executed batch', batch.transaction.hash, batch)
    const chain = getChainById(ChainId.POL)
    processList.map((process) => {
      if (process.id === 'wait') {
        process.status = 'DONE'
        process.message = 'Staking successful'
        process.txHash = batch.transaction.hash
        process.txLink = chain.metamask.blockExplorerUrls[0] + 'tx/' + batch.transaction.hash
        process.doneAt = Date.now()
      }
      return process
    })

    const stepExecution: Execution = {
      status: 'DONE',
      process: processList,
    }
    setEtherspotStepExecution(stepExecution)
    return stepExecution
  }

  const finalizeEtherSpotStep = async (stepExecution: Execution) => {
    const tokenAmountSKlima = (await LiFi.getTokenBalance(web3.account!, SKLIMA_TOKEN_POL))!
    const amountSKlimaParsed = route.klimaStep.estimate.toAmountMin

    const doneList = stepExecution.process.map((p) => {
      p.status = 'DONE'
      return p
    })

    setEtherspotStepExecution({
      status: 'DONE',
      process: doneList,
      toAmount: amountSKlimaParsed.toString(),
    })

    setFinalTokenAmount(tokenAmountSKlima)
  }

  const switchChainHook = async (requiredChainId: number) => {
    if (!web3.account || !web3.library) return

    if (isWalletConnectWallet(web3.account)) {
      let promiseResolver
      const signerAwaiter = new Promise<void>((resolve) => (promiseResolver = resolve))

      setShowWalletConnectChainSwitchModal({
        show: true,
        chainId: requiredChainId,
        promiseResolver,
      })

      await signerAwaiter
      return web3.library.getSigner()
    }

    if ((await web3.library.getSigner().getChainId()) !== requiredChainId) {
      // Fallback is Metamask
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
    const isDone =
      steps.filter((step) => step.execution?.status !== 'DONE').length === 0 &&
      etherspotStepExecution?.status === 'DONE'
    if (isDone) {
      const toChain = getChainById(ChainId.POL)
      const receivedAmount = new BigNumber(etherspotStepExecution?.toAmount || '0')
      const successMessage = !!finalTokenAmount ? (
        <>
          <Typography.Text>
            You received {receivedAmount.shiftedBy(-finalTokenAmount.decimals).toFixed(4)}
            {` ${finalTokenAmount.symbol}`}
          </Typography.Text>
          <Typography.Text
            type={!receivedAmount.isZero() ? 'secondary' : undefined}
            style={{ fontSize: !receivedAmount.isZero() ? 12 : 14 }}>
            <br />
            {'You now have '}
            {new BigNumber(finalTokenAmount.amount).toFixed(4)}
            {` ${finalTokenAmount.symbol}`}
            {` on ${toChain.name}`}
          </Typography.Text>
        </>
      ) : (
        ''
      )

      return (
        <Space direction="vertical">
          <Typography.Text strong>Staking Successful!</Typography.Text>
          {finalTokenAmount &&
            (finalTokenAmount.address === constants.AddressZero ? (
              <span>{successMessage}</span>
            ) : (
              <Tooltip title="Click to add this token to your wallet.">
                <span
                  style={{ cursor: 'copy' }}
                  onClick={() => switchChainAndAddToken(toChain.id, finalTokenAmount)}>
                  {successMessage}
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
    const isFailed =
      steps.some((step) => step.execution?.status === 'FAILED') ||
      etherspotStepExecution?.status === 'FAILED'
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

  const parseEtherspotExecution = () => {
    if (!etherspotStepExecution) {
      return []
    }
    return etherspotStepExecution.process.map((process, index, processList) => {
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
                {renderProcessError(process)}
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
  const parseEtherspotStep = () => {
    const lastLiFiStep = route.lifiRoute.steps[route.lifiRoute.steps.length - 1]
    const index = route.lifiRoute.steps.length
    const isDone = etherspotStepExecution && etherspotStepExecution.status === 'DONE'
    const isLoading =
      isSwapping && etherspotStepExecution && etherspotStepExecution.status === 'PENDING'
    const isPaused =
      !isSwapping && etherspotStepExecution && etherspotStepExecution.status === 'PENDING'
    const color = isDone ? 'green' : etherspotStepExecution ? 'blue' : 'gray'
    // const executionDuration = !!step.estimate.executionDuration && (
    //   <>
    //     <br />
    //     <span>Estimated duration: {parseSecondsAsTime(step.estimate.executionDuration)} min</span>
    //   </>
    // )
    return [
      <Timeline.Item position={isMobile ? 'right' : 'right'} key={index + '_left'} color={color}>
        <h4>Stake for sKLIMA</h4>
        <span>
          {formatTokenAmount(lastLiFiStep.action.toToken, lastLiFiStep.estimate?.toAmount)}{' '}
          <ArrowRightOutlined />{' '}
          {formatTokenAmount(SKLIMA_TOKEN_POL, route.klimaStep.estimate?.toAmount)}
        </span>
        {/* {executionDuration} */}
      </Timeline.Item>,
      <Timeline.Item
        position={isMobile ? 'right' : 'left'}
        key={index + '_right'}
        color={color}
        dot={isLoading ? <LoadingOutlined /> : isPaused ? <PauseCircleOutlined /> : null}>
        {parseEtherspotExecution()}
      </Timeline.Item>,
    ]
  }

  return (
    <>
      {alerts}
      <br />

      <Timeline mode={isMobile ? 'left' : 'alternate'} className="swapping-modal-timeline">
        {/* Steps */}
        {steps.map(parseStepToTimeline)}
        {parseEtherspotStep()}
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
        <Modal
          className="wallet-selection-modal"
          visible={showWalletConnectChainSwitchModal.show}
          onOk={() =>
            setShowWalletConnectChainSwitchModal({
              show: false,
              chainId: 1,
            })
          }
          onCancel={() =>
            setShowWalletConnectChainSwitchModal({
              show: false,
              chainId: 1,
            })
          }
          footer={null}>
          <WalletConnectChainSwitchModal
            chainId={showWalletConnectChainSwitchModal.chainId}
            okHandler={() => {
              if (showWalletConnectChainSwitchModal.promiseResolver) {
                showWalletConnectChainSwitchModal.promiseResolver()
              }
              setShowWalletConnectChainSwitchModal({
                show: false,
                chainId: 1,
              })
            }}
          />
        </Modal>
      </div>
    </>
  )
}

export default SwappingEtherspotKlima
