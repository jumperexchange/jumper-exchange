import { ArrowRightOutlined, LoadingOutlined } from '@ant-design/icons'
import { Web3Provider } from '@ethersproject/providers'
import { useWeb3React } from '@web3-react/core'
import { Alert, Avatar, Button, Col, Row, Spin, Timeline, Tooltip, Typography } from 'antd'
import { BaseType } from 'antd/lib/typography/Base'

import { switchChain } from '../../services/metamask'
import { renderProcessMessage } from '../../services/processRenderer'
import { formatTokenAmount } from '../../services/utils'
import { Execution, getChainById, getIcon, Route, Step } from '../../types'
import Clock from '../Clock'
import { injected } from '../web3/connectors'

interface SwappingProps {
  route: Route
}

const SwappingNxtp = ({ route }: SwappingProps) => {
  let activeButton = null
  const { activate } = useWeb3React()
  const web3 = useWeb3React<Web3Provider>()

  const parseWalletSteps = () => {
    const isDone = !!web3.account
    const isActive = !isDone

    const button = (
      <Button type="primary" onClick={() => activate(injected)}>
        Connect with MetaMask
      </Button>
    )
    const buttonText = (
      <Typography.Text onClick={() => activate(injected)}>Connect with MetaMask</Typography.Text>
    )

    if (isActive) {
      activeButton = button
    }

    const color = isDone ? 'green' : 'blue'
    return [
      <Timeline.Item key="wallet_left" color={color}>
        <h4 style={{ marginBottom: 0 }}>Connect your Wallet</h4>
      </Timeline.Item>,
      <Timeline.Item key="wallet_right" color={color}>
        {!web3.account ? (
          buttonText
        ) : (
          <p style={{ display: 'flex' }}>
            <Typography.Text type="success">
              Connected with {web3.account.substr(0, 4)}...
            </Typography.Text>
            <Typography.Text style={{ marginLeft: 'auto' }}>
              <Clock startedAt={1} successAt={1} />
            </Typography.Text>
          </p>
        )}
      </Timeline.Item>,
    ]
  }

  const parseChainSteps = () => {
    const isDone = web3.chainId === route.steps[0].action.fromChainId
    const isActive = !isDone && web3.account

    const chain = getChainById(route.steps[0].action.fromChainId)
    const button = (
      <Button
        type="primary"
        disabled={!web3.account}
        onClick={() => switchChain(route.steps[0].action.fromChainId)}>
        Switch Chain to {chain.name}
      </Button>
    )
    const buttonText = (
      <Typography.Text onClick={() => switchChain(route.steps[0].action.fromChainId)}>
        Switch Chain to {chain.name}
      </Typography.Text>
    )
    if (isActive) {
      activeButton = button
    }

    const color = isDone ? 'green' : isActive ? 'blue' : 'gray'
    return [
      <Timeline.Item key="chain_left" color={color}>
        <h4 style={{ marginBottom: 0 }}>Switch to {chain.name}</h4>
      </Timeline.Item>,
      <Timeline.Item key="chain_right" color={color}>
        {web3.chainId !== route.steps[0].action.fromChainId ? (
          buttonText
        ) : (
          <p style={{ display: 'flex' }}>
            <Typography.Text type="success">On {chain.name} Chain</Typography.Text>
            <Typography.Text style={{ marginLeft: 'auto' }}>
              <Clock startedAt={1} successAt={1} />
            </Typography.Text>
          </p>
        )}
      </Timeline.Item>,
    ]
  }

  const refreshPage = () => {
    window.location.reload()
  }

  const parseExecution = (execution?: Execution) => {
    if (!execution) {
      return []
    }

    return execution.process.map((process, index) => {
      const typeMapping: { [Status: string]: BaseType } = {
        DONE: 'success',
        ACTION_REQUIRED: 'secondary',
        FAILED: 'danger',
      }
      const type = typeMapping[process.status]

      const colorMapping: { [Status: string]: string } = {
        DONE: 'green',
        ACTION_REQUIRED: 'blue',
        PENDING: 'blue',
        FAILED: 'red',
      }
      const color = colorMapping[process.status]

      return (
        <Timeline.Item key={index + '_right'} color={color}>
          <span style={{ display: 'flex' }}>
            <Typography.Text
              type={type}
              className={process.status === 'PENDING' ? 'flashing' : undefined}>
              {renderProcessMessage(process)}
            </Typography.Text>
            <Typography.Text style={{ marginLeft: 'auto' }}>
              <Clock
                startedAt={process.startedAt}
                successAt={process.doneAt}
                failedAt={process.failedAt}
              />
            </Typography.Text>
          </span>

          {process.status === 'FAILED' && process.errorMessage && (
            <Alert message={process.errorMessage} type="error" />
          )}
        </Timeline.Item>
      )
    })
  }

  const getChainAvatar = (chainId: number) => {
    const chain = getChainById(chainId)

    return (
      <Tooltip title={chain.name}>
        <Avatar
          size="small"
          src={getIcon(chain.key)}
          alt={chain.name}
          style={{ marginTop: '-3px' }}>
          {chain.name[0]}
        </Avatar>
      </Tooltip>
    )
  }

  const parseStepToTimeline = (step: Step, index: number) => {
    const executionSteps = parseExecution(step.execution)

    switch (step.type) {
      case 'cross': {
        return executionSteps
      }

      default:
        // eslint-disable-next-line no-console
        console.warn('should never reach here')
    }
  }

  const getCurrentProcess = () => {
    for (const step of route.steps) {
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
    for (const step of route.steps) {
      if (step.execution?.process) {
        for (const process of step.execution?.process) {
          lastProcess = process
        }
      }
    }
    return lastProcess
  }

  const currentProcess = getCurrentProcess()
  const swapStartedAt = route.steps[0].execution?.process[0]?.startedAt
  const lastProcess = getLastProcess()
  const swapDoneAt = lastProcess?.doneAt || lastProcess?.failedAt

  const mode = 'left'
  const step = route.steps[0]
  return (
    <>
      <h2 style={{ textAlign: 'center' }}>
        Transfer from {getChainAvatar(step.action.fromChainId)} to{' '}
        {getChainAvatar(step.action.toChainId)}
      </h2>
      <p style={{ textAlign: 'center' }}>
        {formatTokenAmount(step.action.fromToken, step.estimate?.fromAmount)}
        <ArrowRightOutlined />
        {formatTokenAmount(step.action.toToken, step.estimate?.toAmount)}
      </p>

      <Timeline mode={mode} style={{ maxWidth: 400, margin: 'auto' }}>
        <Timeline.Item color="green"></Timeline.Item>

        {/* Wallet */}
        {!web3.account && parseWalletSteps()}

        {/* Chain */}
        {web3.chainId !== route.steps[0].action.fromChainId && parseChainSteps()}

        {/* Steps */}
        {route.steps.map(parseStepToTimeline)}
      </Timeline>

      <div style={{ display: 'flex', maxWidth: 400, margin: 'auto' }}>
        <Typography.Text style={{ marginLeft: 'auto' }}>
          {swapStartedAt ? (
            <span className="totalTime">
              <Clock startedAt={swapStartedAt} successAt={swapDoneAt} />
            </span>
          ) : (
            <span>&nbsp;</span>
          )}
        </Typography.Text>
      </div>

      {currentProcess && currentProcess.status === 'PENDING' && (
        <>
          <Row justify="center">
            <Spin
              style={{ margin: 10 }}
              indicator={<LoadingOutlined style={{ fontSize: 28 }} spin />}
            />
          </Row>
          <Row justify="center">
            <Col style={{ display: 'flex', flexDirection: 'column' }}>
              <Typography.Text
                style={{ marginTop: 24, fontSize: 18, fontWeight: 700 }}
                className="flashing">
                {currentProcess.footerMessage || renderProcessMessage(currentProcess)}
              </Typography.Text>
              {currentProcess.footerMessage &&
                typeof currentProcess.footerMessage === 'string' &&
                currentProcess.footerMessage.includes('Waiting') && (
                  <Typography.Text style={{ fontSize: 14 }}>
                    If this step takes longer than 5m, please refresh the page.
                  </Typography.Text>
                )}
            </Col>
          </Row>
        </>
      )}
      {currentProcess && currentProcess.status === 'ACTION_REQUIRED' && (
        <>
          <Row justify="center">
            <Typography.Text style={{ marginTop: 24, fontSize: 18, fontWeight: 700 }}>
              {currentProcess.footerMessage || renderProcessMessage(currentProcess)}
            </Typography.Text>
          </Row>
        </>
      )}

      {lastProcess && lastProcess.status === 'FAILED' && (
        <>
          <Row justify="center">
            <Button type="primary" size="large" onClick={() => refreshPage()}>
              Refresh Page and Retry
            </Button>
          </Row>
        </>
      )}

      <div style={{ textAlign: 'center', transform: 'scale(1.5)', marginBottom: 20 }}>
        {activeButton}
      </div>
    </>
  )
}

export default SwappingNxtp
