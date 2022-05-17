import { ArrowRightOutlined, LoadingOutlined, PauseCircleOutlined } from '@ant-design/icons'
import { Timeline, Typography } from 'antd'

import { renderProcessError, renderProcessMessage } from '../../../services/processRenderer'
import { ExtendedTransactionRequest } from '../../../services/routingService'
import { formatTokenAmount } from '../../../services/utils'
import { Execution } from '../../../types'
import Clock from '../../Clock'

interface SimpleTransferStepProps {
  simpleTransfer: ExtendedTransactionRequest
  isSwapping: boolean
  simpleTransferDestination?: string
  simpleStepExecution?: Execution
  isMobile: boolean
}

export const SimpleTransferStep = ({
  simpleTransfer,
  isSwapping,
  simpleTransferDestination,
  simpleStepExecution,
  isMobile,
}: SimpleTransferStepProps) => {
  const parseSimpleTransferExecution = () => {
    if (!simpleStepExecution) {
      return []
    }
    return simpleStepExecution.process.map((process, index, processList) => {
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

  const parseSimpleTransferDestination = (destination?: string) => {
    return destination?.substring(0, 9) + '...'
  }
  const parseSimpleTransferStep = () => {
    const index = 0
    const isDone = simpleStepExecution && simpleStepExecution.status === 'DONE'
    const isLoading = isSwapping && simpleStepExecution && simpleStepExecution.status === 'PENDING'
    const isPaused = !isSwapping && simpleStepExecution && simpleStepExecution.status === 'PENDING'
    const color = isDone ? 'green' : simpleStepExecution ? 'blue' : 'gray'

    return [
      <Timeline.Item position={isMobile ? 'right' : 'right'} key={index + '_left'} color={color}>
        <h4>Transfer USDC</h4>
        <span>
          {formatTokenAmount(simpleTransfer.token, simpleTransfer.amount)} <ArrowRightOutlined />{' '}
          {parseSimpleTransferDestination(simpleTransferDestination)}
        </span>
      </Timeline.Item>,
      <Timeline.Item
        position={isMobile ? 'right' : 'left'}
        key={index + '_right'}
        color={color}
        dot={isLoading ? <LoadingOutlined /> : isPaused ? <PauseCircleOutlined /> : null}>
        {parseSimpleTransferExecution()}
      </Timeline.Item>,
    ]
  }

  return parseSimpleTransferStep()
}
