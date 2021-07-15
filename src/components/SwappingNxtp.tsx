import { ArrowRightOutlined } from '@ant-design/icons';
import { NxtpSdk, NxtpSdkEvents } from '@connext/nxtp-sdk';
import { getRandomBytes32 } from "@connext/nxtp-utils";
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { Avatar, Button, Timeline, Tooltip, Typography } from 'antd';
import { providers } from 'ethers';
import pino from "pino";
import { useState } from 'react';
import connextIcon from '../assets/icons/connext.png';
import oneinchIcon from '../assets/icons/oneinch.png';
import paraswapIcon from '../assets/icons/paraswap.png';
import { readNxtpMessagingToken, storeNxtpMessagingToken } from '../services/localStorage';
import { addToken, switchChain } from '../services/metamask';
import { deepClone, formatTokenAmount } from '../services/utils';
import { ChainKey, Token } from '../types';
import { getChainById, getChainByKey } from '../types/lists';
import { CrossAction, emptyExecution, Execution, Process, TranferStep } from '../types/server';
import Clock from './Clock';
import { injected } from './web3/connectors';


interface SwappingProps {
  route: Array<TranferStep>,
  updateRoute: Function,
}

const ADMIN_MODE = false

const SwappingNxtp = ({ route, updateRoute }: SwappingProps) => {
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

  const initializeConnext = async () => {
    if (sdk && sdkChainId === web3.chainId) {
      return sdk
    }
    if (!web3.library) {
      throw Error('Connect Wallet first.')
    }
    setAlerts([])

    const chainProviders: { [chainId: number]: providers.JsonRpcProvider } = {
      4: new providers.JsonRpcProvider(process.env.REACT_APP_RPC_URL_RINKEBY),
      5: new providers.JsonRpcProvider(process.env.REACT_APP_RPC_URL_GORLI),
    }
    const signer = web3.library.getSigner()

    try {
      console.log('init sdk')
      const _sdk = await NxtpSdk.init(chainProviders, signer, pino({ level: "info" }));
      setSdkChainId(web3.chainId)
      setSdk(_sdk)
      return _sdk
      // const activeTxs = await _sdk.getActiveTransactions();
      // console.log('activeTxs', activeTxs)
    } catch (e) {
      throw e
    }
  }

  // Swap
  const updateStatus = (step: TranferStep, status: Execution) => {
    console.log('STATUS_CHANGE:', status)
    step.execution = status

    updateRoute(route)
  }

  const triggerDeposit = (step: TranferStep) => {
    // const depositAction = step.action as DepositAction

    //return connext.triggerDeposit(node, web3.library.getSigner(), depositAction.chainId, depositAction.token.id, BigInt(depositAction.amount), (status: Execution) => updateStatus(step, status))
  }

  const triggerSwap = (step: TranferStep) => {
    // const swapAction = step.action as SwapAction
    // const swapEstimate = step.estimate as SwapEstimate
    // const chainId = getChainByKey(swapAction.chainKey).id // will be replaced by swapAction.chainId

    //return connext.triggerSwap(node, chainId, swapEstimate.path, swapAction.fromToken.id, swapAction.toToken.id, swapAction.fromAmount, (status: Execution) => updateStatus(step, status))
  }

  const triggerParaswap = async (step: TranferStep) => {
    // const swapAction = step.action as ParaswapAction
    // const chainId = getChainByKey(swapAction.chainKey).id // will be replaced by swapAction.chainId
    // const fromAddress = web3.account
    // const toAddress = fromAddress

    //return connext.executeParaswap(chainId, web3.library.getSigner(), node, swapAction.fromToken.id, swapAction.toToken.id, swapAction.fromAmount, fromAddress, toAddress, (status: Execution) => updateStatus(step, status))
  }

  const triggerOneIchSwap = async (step: TranferStep) => {
    // const swapAction = step.action as ParaswapAction
    // const chainId = getChainByKey(swapAction.chainKey).id // will be replaced by swapAction.chainId
    // const fromAddress = web3.account
    // const toAddress = fromAddress
    //return connext.executeOneInchSwap(chainId, web3.library.getSigner(), node, swapAction.fromToken.id, swapAction.toToken.id, swapAction.fromAmount, fromAddress, toAddress, (status: Execution) => updateStatus(step, status))
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
    if (!web3.account) return

    // status
    const { status, update } = initStatus((status: Execution) => updateStatus(step, status))

    // login
    const sdk = await initializeConnext()
    const loginProcess = createAndPushProcess(update, status, 'Sign for Login')
    try {
      const oldToken = readNxtpMessagingToken()
      if (oldToken) {
        try {
          await sdk.connectMessaging(oldToken)
        } catch {
          const token = await sdk.connectMessaging()
          storeNxtpMessagingToken(token)
        }
      } else {
        const token = await sdk.connectMessaging()
        storeNxtpMessagingToken(token)
      }
      setStatusDone(update, status, loginProcess)
    } catch (e) {
      setStatusFailed(update, status, loginProcess)
      throw e
    }

    // transfer
    const approveProcess: Process = createAndPushProcess(update, status, 'Approve Token')
    let submitProcess: Process | undefined
    let proceedProcess: Process | undefined

    const crossAction = step.action as CrossAction
    const fromChain = getChainByKey(crossAction.chainKey)
    const toChain = getChainByKey(crossAction.toChainKey)

    const transactionId = getRandomBytes32()
    const expiry = (Math.floor(Date.now() / 1000) + 3600 * 24 * 3).toString() // 3 days
    const transferPromise = sdk.transfer({
      router: undefined,
      sendingAssetId: crossAction.fromToken.id,
      sendingChainId: fromChain.id,
      receivingChainId: toChain.id,
      receivingAssetId: crossAction.toToken.id,
      receivingAddress: web3.account,
      amount: crossAction.amount.toString(),
      transactionId,
      expiry
      // callData?: string;
    })

    // approve sent => wait
    sdk.attachOnce(NxtpSdkEvents.SenderTransactionPrepareTokenApproval, (data) => {
      console.log('SenderTransactionPrepareTokenApproval', data)
      approveProcess.txHash = data.transactionResponse.hash
      approveProcess.txLink = fromChain.metamask.blockExplorerUrls[0] + 'tx/' + approveProcess.txHash
      approveProcess.message = (<>Approve Token - Wait for <a href={approveProcess.txLink} target="_blank" rel="nofollow noreferrer">Tx</a></>)
      update(status)
    })
    // approved = done => next
    sdk.attachOnce(NxtpSdkEvents.SenderTokenApprovalMined, (data) => {
      console.log('SenderTokenApprovalMined', data)
      approveProcess.message = (<>Approve Token (<a href={approveProcess.txLink} target="_blank" rel="nofollow noreferrer">Tx</a>)</>)
      setStatusDone(update, status, approveProcess)
      submitProcess = createAndPushProcess(update, status, 'Submit Cross Chain Transfer')
    })

    // sumbit sent => wait
    sdk.attachOnce(NxtpSdkEvents.SenderTransactionPrepareSubmitted, (data) => {
      console.log('SenderTransactionPrepareSubmitted', data)
      if (submitProcess) {
        submitProcess.txHash = data.transactionResponse.hash
        submitProcess.txLink = fromChain.metamask.blockExplorerUrls[0] + 'tx/' + approveProcess.txHash
        submitProcess.message = (<>Submit Transfer - Wait for <a href={approveProcess.txLink} target="_blank" rel="nofollow noreferrer">Tx</a></>)
        update(status)
      }
    })
    // sumitted = done => next
    sdk.attachOnce(NxtpSdkEvents.SenderTransactionPrepared, (data) => {
      console.log('SenderTransactionPrepared', data)
      if (submitProcess) {
        submitProcess.message = (<>Submit Transfer (<a href={approveProcess.txLink} target="_blank" rel="nofollow noreferrer">Tx</a>)</>)
        setStatusDone(update, status, submitProcess)
      }
      proceedProcess = createAndPushProcess(update, status, 'Proceed Transfer')
    })

    // ReceiverTransactionPrepared => sign
    sdk.attachOnce(NxtpSdkEvents.ReceiverTransactionPrepared, (data) => {
      console.log('ReceiverTransactionPrepared', data)
      if (proceedProcess) {
        proceedProcess.message = 'Proceed Transfer - Sign'
        update(status)
      }
    })
    // fullfilled = done
    sdk.attachOnce(NxtpSdkEvents.ReceiverTransactionFulfilled, (data) => {
      console.log('ReceiverTransactionFulfilled', data)
      if (proceedProcess) {
        proceedProcess.message = 'Proceed Transfer'
        setStatusDone(update, status, proceedProcess)
      }
    })
    // all done?
    sdk.attachOnce(NxtpSdkEvents.SenderTransactionFulfilled, (data) => {
      console.log('SenderTransactionFulfilled', data)
    })

    // sdk.attachOnce(NxtpSdkEvents.SenderTransactionCancelled, (data) => {
    //   console.log('SenderTransactionCancelled', data)
    // })
    // sdk.attachOnce(NxtpSdkEvents.ReceiverTransactionCancelled, (data) => {
    //   console.log('ReceiverTransactionCancelled', data)
    // })

    try {
      await transferPromise
    } catch (e) {
      if (approveProcess && approveProcess.status !== 'DONE') {
        setStatusFailed(update, status, approveProcess)
      }
      if (submitProcess && submitProcess.status !== 'DONE') {
        setStatusFailed(update, status, submitProcess)
      }
      if (proceedProcess && proceedProcess.status !== 'DONE') {
        setStatusFailed(update, status, proceedProcess)
      }
      throw e
    }

    // all done?
    status.status = 'DONE'
    if (approveProcess) setStatusDone(update, status, approveProcess)
    if (submitProcess) setStatusDone(update, status, submitProcess)
    if (proceedProcess) setStatusDone(update, status, proceedProcess)
    return status
  }

  const triggerWithdraw = (step: TranferStep) => {
    // const withdrawAction = step.action as WithdrawAction
    // const chainId = getChainByKey(withdrawAction.chainKey).id // will be replaced by withdrawAction.chainId
    // const recipient = withdrawAction.recipient ?? web3.account

    //return connext.triggerWithdraw(node, chainId, recipient, withdrawAction.token.id, withdrawAction.amount, (status: Execution) => updateStatus(step, status))
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
        const triggerButton = <Button type="primary" disabled={!web3.library || web3.chainId !== route[0].action.chainId} onClick={() => triggerStep(step)}>trigger Deposit</Button>
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
        const triggerButton = <Button type="primary" disabled={false} onClick={() => triggerStep(step)} >trigger Swap</Button>
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
        const triggerButton = <Button type="primary" disabled={false} onClick={() => triggerParaswap(step)} >trigger Swap</Button>
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
        const triggerButton = <Button type="primary" disabled={false} onClick={() => triggerOneIchSwap(step)} >trigger Swap</Button>
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
        const triggerButton = <Button type="primary" disabled={false} onClick={() => triggerStep(step)} >trigger Transfer</Button>
        return [
          <Timeline.Item key={index + '_left'} color={color}>
            <h4>Transfer from {getChainAvatar(step.action.chainKey)} to {getChainAvatar(step.action.toChainKey)} via {connextAvatar}</h4>
            <span>{formatTokenAmount(step.action.fromToken, step.estimate?.fromAmount)} <ArrowRightOutlined /> {formatTokenAmount(step.action.toToken, step.estimate?.toAmount)}</span>
          </Timeline.Item>,
          <Timeline.Item key={index + '_right'} color={color}>
            {!step.execution && ADMIN_MODE ? triggerButton : executionSteps}
          </Timeline.Item>,
        ]
      }

      case 'withdraw':
        const triggerButton = <Button type="primary" disabled={!web3.account} onClick={() => triggerStep(step)}>trigger Withdraw</Button>
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
  </>)
}

export default SwappingNxtp
