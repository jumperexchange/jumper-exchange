import { ArrowRightOutlined, LoadingOutlined, PauseCircleOutlined } from '@ant-design/icons'
import { Timeline, Typography } from 'antd'

import { sKLIMA_ADDRESS } from '../../../constants'
import { renderProcessError, renderProcessMessage } from '../../../services/processRenderer'
import { formatTokenAmount } from '../../../services/utils'
import { Execution, Step, Token } from '../../../types'
import Clock from '../../Clock'

const SKLIMA_TOKEN_POL = {
  symbol: 'sKLIMA',
  decimals: 9,
  name: 'sKLIMA',
  chainId: 137,
  address: sKLIMA_ADDRESS,
}

interface EtherspotStepProps {
  stakingStep: Step
  isSwapping: boolean
  etherspotStepExecution?: Execution
  index: number
  previousStepInfo: { token?: Token; amount?: string }
  isMobile: boolean
}

export const EtherspotStep = ({
  etherspotStepExecution,
  stakingStep,
  isSwapping,
  index,
  previousStepInfo,
  isMobile,
}: EtherspotStepProps) => {
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
    const isDone = etherspotStepExecution && etherspotStepExecution.status === 'DONE'
    const isLoading =
      isSwapping && etherspotStepExecution && etherspotStepExecution.status === 'PENDING'
    const isPaused =
      !isSwapping && etherspotStepExecution && etherspotStepExecution.status === 'PENDING'
    const color = isDone ? 'green' : etherspotStepExecution ? 'blue' : 'gray'

    return [
      <Timeline.Item position={'right'} key={index + '_left'} color={color}>
        <h4>Stake for sKLIMA</h4>
        <span>
          {formatTokenAmount(previousStepInfo.token!, previousStepInfo.amount!)}{' '}
          <ArrowRightOutlined />{' '}
          {formatTokenAmount(SKLIMA_TOKEN_POL, stakingStep.estimate?.toAmount)}
        </span>
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

  return parseEtherspotStep()
}
