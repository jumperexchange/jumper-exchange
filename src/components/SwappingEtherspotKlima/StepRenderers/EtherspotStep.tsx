import { ArrowRightOutlined, LoadingOutlined, PauseCircleOutlined } from '@ant-design/icons'
import { Timeline, Typography } from 'antd'

import { sKLIMA_ADDRESS } from '../../../constants'
import { useIsMobile } from '../../../hooks/useIsMobile'
import { renderProcessError, renderProcessMessage } from '../../../services/processRenderer'
import { formatTokenAmount } from '../../../services/utils'
import { Execution, Route, Step } from '../../../types'
import Clock from '../../Clock'

const SKLIMA_TOKEN_POL = {
  symbol: 'sKLIMA',
  decimals: 9,
  name: 'sKLIMA',
  chainId: 137,
  address: sKLIMA_ADDRESS,
}

interface EtherspotStepProps {
  lifiRoute: Route
  stakingStep: Step
  isSwapping: boolean
  etherspotStepExecution?: Execution
}

export const EtherspotStep = ({
  lifiRoute,
  etherspotStepExecution,
  stakingStep,
  isSwapping,
}: EtherspotStepProps) => {
  const isMobile = useIsMobile()

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
    const lastLiFiStep = lifiRoute.steps[lifiRoute.steps.length - 1]
    const index = lifiRoute.steps.length
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
          {formatTokenAmount(SKLIMA_TOKEN_POL, stakingStep.estimate?.toAmount)}
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

  return <>{parseEtherspotStep()}</>
}
