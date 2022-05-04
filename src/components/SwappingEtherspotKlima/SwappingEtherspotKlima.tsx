import { Web3Provider } from '@ethersproject/providers'
import { ChainId, Execution, ExecutionSettings, Process } from '@lifinance/sdk'
import { getRpcProvider } from '@lifinance/sdk/dist/connectors'
import { useWeb3React } from '@web3-react/core'
import { Button, Divider, Modal, Row, Space, Spin, Timeline, Tooltip, Typography } from 'antd'
import BigNumber from 'bignumber.js'
import { constants, ethers } from 'ethers'
import { GatewayBatchStates, Sdk } from 'etherspot'
import { useEffect, useState } from 'react'

import walletIcon from '../../assets/wallet.png'
import { KLIMA_ADDRESS, sKLIMA_ADDRESS, STAKE_KLIMA_CONTRACT_ADDRESS } from '../../constants'
import { useIsMobile } from '../../hooks/useIsMobile'
import LiFi from '../../LiFi'
import {
  getSetAllowanceTransaction,
  getStakeKlimaTransaction,
  getTransferTransaction,
} from '../../services/etherspotTxService'
import { isWalletConnectWallet, storeRoute } from '../../services/localStorage'
import { switchChain, switchChainAndAddToken } from '../../services/metamask'
import Notification, { NotificationType } from '../../services/notifications'
import { renderProcessMessage } from '../../services/processRenderer'
import { ExtendedTransactionRequest } from '../../services/routingService'
import { formatTokenAmount } from '../../services/utils'
import { getChainById, isCrossStep, isLifiStep, Route, Step, TokenAmount } from '../../types'
import Clock from '../Clock'
import LoadingIndicator from '../LoadingIndicator'
import { WalletConnectChainSwitchModal } from '../WalletConnectChainSwitchModal'
import { EtherspotStep } from './StepRenderers/EtherspotStep'
import { LIFIRouteSteps } from './StepRenderers/LIFIRouteSteps'
import { SimpleTransferStep } from './StepRenderers/SimpleTransferStep'

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
  route: {
    lifiRoute?: Route
    gasStep: Step
    stakingStep: Step
    simpleTransfer?: ExtendedTransactionRequest
  }
  etherspot?: Sdk
  settings: SwapSettings
  updateRoute: Function
  onSwapDone: Function
  fixedRecipient?: boolean
}

const SwappingEtherspotKlima = ({
  route,
  etherspot,
  updateRoute,
  settings,
  onSwapDone,
}: SwappingProps) => {
  const isMobile = useIsMobile()
  const [swapStartedAt, setSwapStartedAt] = useState<number>()
  const [swapDoneAt, setSwapDoneAt] = useState<number>()
  const [isSwapping, setIsSwapping] = useState<boolean>(false)
  const [finalTokenAmount, setFinalTokenAmount] = useState<TokenAmount | null>()
  const [showWalletConnectChainSwitchModal, setShowWalletConnectChainSwitchModal] = useState<{
    show: boolean
    chainId: number
    promiseResolver?: Function
  }>({ show: false, chainId: 1 })
  const [etherspotStepExecution, setEtherspotStepExecution] = useState<Execution>()
  const [simpleTransferExecution, setSimpleTransferExecution] = useState<Execution>()

  // Wallet
  const web3 = useWeb3React<Web3Provider>()

  useEffect(() => {
    if (route.lifiRoute) {
      const { steps } = route.lifiRoute
      // check if route is eligible for automatic resuming
      const allDone = steps.every((step) => step.execution?.status === 'DONE')
      const isFailed = steps.some((step) => step.execution?.status === 'FAILED')

      const alreadyStarted = steps.some((step) => step.execution)
      if (!allDone && !isFailed && alreadyStarted) {
        resumeLIFIRoute()
      }

      // move execution to background when modal is closed
      return function cleanup() {
        if (route.lifiRoute) {
          LiFi.moveExecutionToBackground(route.lifiRoute!)
        }
      }
    }
  }, [])

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
      fromChain: route.stakingStep.action.fromChainId,
      fromToken: route.stakingStep.action.fromToken.address,
      fromAddress: etherspot.state.accountAddress!,
      fromAmount: route.stakingStep.action.fromAmount, // TODO: check if correct value
      toChain: route.stakingStep.action.fromChainId,
      toToken: route.stakingStep.action.toToken.address, // hardcode return gastoken
      slippage: route.gasStep.action.slippage,
      integrator: 'lifi-etherspot',
      allowExchanges: [route.stakingStep.tool],
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
    route.stakingStep = resolvedPromises[3]

    if (!route.gasStep.transactionRequest || !route.stakingStep.transactionRequest) {
      throw new Error('Swap transaction missing')
    }

    // reset gateway batch
    etherspot.clearGatewayBatch()

    const totalAmount = ethers.BigNumber.from(route.gasStep.estimate.fromAmount).add(
      route.stakingStep.estimate.fromAmount,
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
      to: route.stakingStep.transactionRequest.to as string,
      data: route.stakingStep.transactionRequest.data as string,
    })
    const amountKlima = route.stakingStep.estimate.toAmountMin
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

  const startExecution = async () => {
    if (route.lifiRoute) {
      await startLIFIRoute()
    } else {
      await startSimpleTransfer()
    }
  }

  const startLIFIRoute = async () => {
    if (!web3.account || !web3.library || !route.lifiRoute) return
    const signer = web3.library.getSigner()

    const executionSettings: ExecutionSettings = {
      updateCallback: updateCallback,
      switchChainHook: switchChainHook,
      infiniteApproval: settings.infiniteApproval,
    }
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

  const startSimpleTransfer = async () => {
    if (!web3.account || !web3.library || !route.simpleTransfer) return
    setIsSwapping(true)
    setSwapStartedAt(Date.now())
    try {
      await executeSimpleTransfer()
      await finalizeEtherSpotStep(await executeEtherspotStep())
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Execution failed!', route.simpleTransfer)
      // eslint-disable-next-line no-console
      console.error(e)
      handleSimpleTransferError(e)
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

  const resumeLIFIRoute = async () => {
    if (!web3.account || !web3.library || !route.lifiRoute) return

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

  const restartExecution = async () => {
    // remove failed
    if (route.lifiRoute) {
      const { steps } = route.lifiRoute!
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
      resumeLIFIRoute()
    }

    if (route.simpleTransfer) {
      if (simpleTransferExecution && simpleTransferExecution.status === 'FAILED') {
        setEtherspotStepExecution(undefined)
      }
      if (etherspotStepExecution && etherspotStepExecution.status === 'FAILED') {
        setEtherspotStepExecution(undefined)
      }
      startSimpleTransfer()
    }
  }

  const executeSimpleTransfer = async () => {
    const processList: Process[] = []
    if (!web3.library || !route.simpleTransfer) return
    const signer = web3.library!.getSigner()
    if (route.simpleTransfer.chainId !== (await signer.getChainId())) {
      processList.push({
        id: 'chainSwitch',
        message: 'Switch Chain',
        startedAt: Date.now(),
        status: 'ACTION_REQUIRED',
      })
      setSimpleTransferExecution({
        status: 'ACTION_REQUIRED',
        process: processList,
      })

      await switchChain(route.simpleTransfer.chainId!)
      const signer = web3.library!.getSigner()
      if ((await signer.getChainId()) !== route.simpleTransfer.chainId) {
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
    processList.push({
      id: 'signTransfer',
      message: 'Sign Transaction',
      startedAt: Date.now(),
      status: 'ACTION_REQUIRED',
    })
    setSimpleTransferExecution({
      status: 'ACTION_REQUIRED',
      process: processList,
    })
    let tx

    tx = await signer.sendTransaction(route.simpleTransfer.tx)

    processList.map((process) => {
      if (process.id === 'signTransfer') {
        process.status = 'DONE'
        process.doneAt = Date.now()
      }
      return process
    })
    processList.push({
      id: 'wait',
      message: 'Wait For Transfer',
      startedAt: Date.now(),
      status: 'PENDING',
    })
    setSimpleTransferExecution({
      status: 'PENDING',
      process: processList,
    })

    await tx.wait()

    processList.map((process) => {
      if (process.id === 'wait') {
        process.status = 'DONE'
        process.doneAt = Date.now()
      }
      return process
    })

    setSimpleTransferExecution({
      status: 'DONE',
      process: processList,
    })
  }

  const handleSimpleTransferError = (e: any) => {
    if (etherspotStepExecution) return // We are already on the next step
    if (!simpleTransferExecution) {
      setSimpleTransferExecution({
        status: 'FAILED',
        process: [
          {
            errorMessage: e.message,
            status: 'FAILED',
            message: 'Prepare Transaction',
            startedAt: Date.now(),
            doneAt: Date.now(),
          },
        ],
      })
    } else {
      const processList = simpleTransferExecution.process
      processList[processList.length - 1].status = 'FAILED'
      processList[processList.length - 1].errorMessage = e.errorMessage
      processList[processList.length - 1].doneAt = Date.now()
      setSimpleTransferExecution({
        status: 'FAILED',
        process: processList,
      })
    }
  }

  const handlePotentialEtherSpotError = (e: any) => {
    if (
      (route.lifiRoute &&
        route.lifiRoute.steps.some((step) => step.execution?.status === 'FAILED')) ||
      (route.simpleTransfer &&
        (!simpleTransferExecution || simpleTransferExecution?.status === 'FAILED'))
    ) {
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

    // FIXME: May be needed if user is bridging from chain which is not supported by etherspot
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

    await etherspot.estimateGatewayBatch()

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
    let hasTransaction = !!(batch.transaction && batch.transaction.hash)
    while (!hasTransaction) {
      try {
        batch = await etherspot.getGatewaySubmittedBatch({
          hash: batch.hash,
        })
      } catch (e) {
        // ignore failed requests and try again
        // eslint-disable-next-line no-console
        console.error(e)
      }

      if (batch.state === GatewayBatchStates.Reverted) {
        // eslint-disable-next-line no-console
        console.error(batch)
        throw new Error('Execution Reverted')
      }

      hasTransaction = !!(batch.transaction && batch.transaction.hash)
      if (!hasTransaction) {
        await new Promise((resolve) => {
          setTimeout(resolve, 3000)
        })
      }
    }

    // Add Transaction
    const chain = getChainById(ChainId.POL)
    processList.map((process) => {
      if (process.id === 'wait') {
        process.txHash = batch.transaction.hash
        process.txLink = chain.metamask.blockExplorerUrls[0] + 'tx/' + batch.transaction.hash
      }
      return process
    })
    setEtherspotStepExecution({
      status: 'PENDING',
      process: processList,
    })

    // Wait for Transaction
    const provider = await getRpcProvider(ChainId.POL)
    let receipt
    while (!receipt) {
      try {
        const tx = await provider.getTransaction(batch.transaction.hash!)
        if (tx) {
          receipt = await tx.wait()
        }
      } catch (e) {
        // ignore failed requests and try again
        // eslint-disable-next-line no-console
        console.error(e)
      }

      if (!receipt) {
        await new Promise((resolve) => {
          setTimeout(resolve, 3000)
        })
      }
    }

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
    const amountSKlimaParsed = route.stakingStep.estimate.toAmountMin

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
    // const { steps } = route.lifiRoute!
    let steps
    if (route.lifiRoute) {
      steps = route.lifiRoute.steps
    } else {
      steps = [{ execution: simpleTransferExecution, action: {} } as Step]
    }

    // PENDING
    if (isSwapping) {
      return <></>
    }
    const isCrossChainSwap = !!route.lifiRoute?.steps.find(
      (step) => isCrossStep(step) || isLifiStep(step),
    )

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
            You received{` `}
            {formatTokenAmount(finalTokenAmount, receivedAmount.toString())}
          </Typography.Text>
          <Typography.Text
            type={!receivedAmount.isZero() ? 'secondary' : undefined}
            style={{ fontSize: !receivedAmount.isZero() ? 12 : 14 }}>
            <br />
            {`You now have ${finalTokenAmount.amount} ${finalTokenAmount.symbol}`}
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
        </Space>
      )
    }

    // FAILED
    const isFailed =
      steps.some((step) => step.execution?.status === 'FAILED') ||
      etherspotStepExecution?.status === 'FAILED'

    if (isFailed) {
      return (
        <Button type="primary" onClick={() => restartExecution()} style={{ marginTop: 10 }}>
          Restart from Failed Step
        </Button>
      )
    }

    const chainSwitchRequired =
      steps.some((step) => step.execution?.status === 'CHAIN_SWITCH_REQUIRED') ||
      etherspotStepExecution?.status === 'CHAIN_SWITCH_REQUIRED'
    if (chainSwitchRequired) {
      return <></>
    }

    // NOT_STARTED
    return (
      <Button type="primary" onClick={() => startExecution()} style={{ marginTop: 10 }}>
        {isCrossChainSwap ? 'Start Cross Chain Swap' : 'Start Swap'}
      </Button>
    )
  }

  const getCurrentProcess = () => {
    if (route.lifiRoute) {
      const { steps } = route.lifiRoute!
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
    } else {
      if (simpleTransferExecution) {
        for (const process of simpleTransferExecution.process) {
          if (process.status === 'ACTION_REQUIRED' || process.status === 'PENDING') {
            return process
          }
        }
      }
      if (etherspotStepExecution) {
        for (const process of etherspotStepExecution.process) {
          if (process.status === 'ACTION_REQUIRED' || process.status === 'PENDING') {
            return process
          }
        }
      }
    }
  }

  const currentProcess = getCurrentProcess()

  const getLastStepBeforeStakingStepInfo = () => {
    if (route.lifiRoute) {
      const lastLIFIStep = route.lifiRoute.steps[route.lifiRoute.steps.length - 1]
      return {
        token: lastLIFIStep.action.toToken,
        amount: lastLIFIStep.estimate.toAmountMin,
      }
    } else {
      return {
        token: route.simpleTransfer?.token,
        amount: route.simpleTransfer?.amount,
      }
    }
  }
  return (
    <>
      <Timeline mode={isMobile ? 'left' : 'alternate'} className="swapping-modal-timeline">
        {/* Steps */}
        {!!route.simpleTransfer &&
          !route.lifiRoute &&
          SimpleTransferStep({
            simpleTransfer: route.simpleTransfer,
            simpleStepExecution: simpleTransferExecution,
            isSwapping: isSwapping,
            simpleTransferDestination: etherspot?.state.accountAddress!,
          })}
        {!!route.lifiRoute &&
          !route.simpleTransfer &&
          LIFIRouteSteps({ lifiRoute: route.lifiRoute!, isSwapping: isSwapping })}
        {!!route.stakingStep &&
          EtherspotStep({
            index: route.simpleTransfer ? 1 : route.lifiRoute?.steps.length || 100,
            previousStepInfo: getLastStepBeforeStakingStepInfo(),
            etherspotStepExecution: etherspotStepExecution,
            stakingStep: route.stakingStep,
            isSwapping,
          })}
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
