import { ArrowRightOutlined, LoadingOutlined } from '@ant-design/icons';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { Avatar, Button, Row, Spin, Timeline, Tooltip, Typography } from 'antd';
import { BaseType } from 'antd/lib/typography/Base';
import connextIcon from '../assets/icons/connext.png';
import walletIcon from '../assets/wallet.png';
import { switchChain } from '../services/metamask';
import { formatTokenAmount } from '../services/utils';
import { ChainKey } from '../types';
import { getChainById, getChainByKey } from '../types/lists';
import { Execution, TranferStep } from '../types/server';
import Clock from './Clock';
import { injected } from './web3/connectors';


interface SwappingProps {
  route: Array<TranferStep>,
}

const connextAvatar = (
  <Tooltip title="Connext">
    <Avatar size="small" src={connextIcon} alt="Connext"></Avatar>
  </Tooltip>
)

const SwappingNxtp = ({ route }: SwappingProps) => {
  let activeButton = null
  const { activate } = useWeb3React();
  const web3 = useWeb3React<Web3Provider>()

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

  const parseStepToTimeline = (step: TranferStep, index: number) => {
    const executionSteps = parseExecution(step.execution)
    const color = step.execution && step.execution.status === 'DONE' ? 'green' : (step.execution ? 'blue' : 'gray')

    switch (step.action.type) {
      case 'cross': {
        return [
          <Timeline.Item key={index + '_left'} color={color}>
            <h4>Transfer from {getChainAvatar(step.action.chainKey)} to {getChainAvatar(step.action.toChainKey)} via {connextAvatar}</h4>
            <span>{formatTokenAmount(step.action.fromToken, step.estimate?.fromAmount)} <ArrowRightOutlined /> {formatTokenAmount(step.action.toToken, step.estimate?.toAmount)}</span>
          </Timeline.Item>,
          <Timeline.Item key={index + '_right'} color={color}>
            {executionSteps}
          </Timeline.Item>,
        ]
      }

      default:
        console.warn('should never reach here')
    }
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

  const mode = window.innerWidth > 500 ? 'alternate' : 'left'
  return (<>
    <Timeline mode={mode}>
      <Timeline.Item color="green"></Timeline.Item>

      {/* Wallet */}
      {parseWalletSteps()}

      {/* Chain */}
      {parseChainSteps()}

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
