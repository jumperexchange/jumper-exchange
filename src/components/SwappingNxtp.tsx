import { ArrowRightOutlined, LoadingOutlined } from '@ant-design/icons';
import { NxtpSdk } from '@connext/nxtp-sdk';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { Avatar, Button, Row, Spin, Timeline, Tooltip, Typography } from 'antd';
import { BaseType } from 'antd/lib/typography/Base';
import { providers } from 'ethers';
import pino from "pino";
import { useState } from 'react';
import connextIcon from '../assets/icons/connext.png';
import oneinchIcon from '../assets/icons/oneinch.png';
import paraswapIcon from '../assets/icons/paraswap.png';
import walletIcon from '../assets/wallet.png';
import { addToken, switchChain } from '../services/metamask';
import { triggerTransfer } from '../services/nxtp';
import { formatTokenAmount } from '../services/utils';
import { ChainKey, Token } from '../types';
import { getChainById, getChainByKey } from '../types/lists';
import { Execution, TranferStep } from '../types/server';
import Clock from './Clock';
import { injected } from './web3/connectors';


interface SwappingProps {
  route: Array<TranferStep>,
}

const ADMIN_MODE = false

const SwappingNxtp = ({ route }: SwappingProps) => {
  const [alerts, setAlerts] = useState<Array<JSX.Element>>([])

  let activeButton = null
  const { activate } = useWeb3React();
  const web3 = useWeb3React<Web3Provider>()

  const [sdkChainId, setSdkChainId] = useState<number>()
  const [sdk, setSdk] = useState<NxtpSdk>()
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
      const _sdk = await NxtpSdk.init(chainProviders, signer, pino({ level: "info" }));
      setSdkChainId(web3.chainId)
      setSdk(_sdk)
      return _sdk
    } catch (e) {
      throw e
    }
  }

  // Swap
  const updateStatus = (step: TranferStep, status: Execution) => {
    console.log('STATUS_CHANGE:', status)
    step.execution = status

    // updateRoute(route)
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

  const triggerNxtp = async (step: TranferStep) => {

    triggerTransfer(await initializeConnext(), web3.account!, step, updateStatus)
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
    const isActive = !isDone && web3.account

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
      const typeMapping: { [Status: string]: BaseType } = {
        'DONE': 'success',
        'ACTION_REQUIRED': 'secondary',
        'FAILED': 'danger',
      }
      const type = typeMapping[process.status]
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
        triggerFunc = triggerNxtp
        break
      case 'withdraw':
        triggerFunc = triggerWithdraw
        break
      default:
        throw new Error('Invalid Step')
    }

    return triggerFunc(step)
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

  const getLastProcess = () => {
    let lastProcess
    for (const step of route) {
      if (step.execution?.process) {
        for (const process of step.execution?.process) {
          lastProcess = process
        }
      }
    }
    return lastProcess
  }

  const currentProcess = getCurrentProcess()
  const swapStartedAt = route[0].execution?.process[0]?.startedAt
  const lastProcess = getLastProcess()
  const swapDoneAt = lastProcess?.doneAt || lastProcess?.failedAt


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
          <img src={walletIcon} alt="Wallet" />
        </Row>
        <Row justify="center">
          <Typography.Text style={{ marginTop: 10 }}>{currentProcess.message}</Typography.Text>
        </Row>
      </>
    }

    <div style={{ textAlign: 'center', transform: 'scale(1.5)', marginBottom: 20 }}>
      {activeButton}
    </div>
  </>)
}

export default SwappingNxtp
