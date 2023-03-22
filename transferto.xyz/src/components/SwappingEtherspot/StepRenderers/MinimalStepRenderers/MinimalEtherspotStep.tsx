import {
  ArrowRightOutlined,
  CheckCircleOutlined,
  CloseOutlined,
  LoadingOutlined,
  PauseCircleOutlined,
} from '@ant-design/icons'
import { Col, Row, Typography } from 'antd'

import { renderProcessError, renderProcessMessage } from '../../../../services/processRenderer'
import { formatTokenAmount } from '../../../../services/utils'
import { Execution, Step, Token } from '../../../../types'

interface EtherspotStepProps {
  stakingStep?: Step
  isSwapping: boolean
  etherspotStepExecution?: Execution
  index: number
  previousStepInfo: { token?: Token; amount?: string }
  alternativeToToken?: Token
}

export const MinimalEtherspotStep = ({
  etherspotStepExecution,
  isSwapping,
  previousStepInfo,
  stakingStep,
  alternativeToToken,
}: EtherspotStepProps) => {
  const parseEtherspotExecution = () => {
    if (!etherspotStepExecution) {
      return <></>
    }

    const isDone = etherspotStepExecution?.status === 'DONE'
    const isFailed = etherspotStepExecution?.status === 'FAILED'
    const isLoading = isSwapping && etherspotStepExecution?.status === 'PENDING'
    const isPaused = !isSwapping && etherspotStepExecution?.status === 'PENDING'
    const color = isDone
      ? 'green'
      : isFailed
      ? 'red'
      : etherspotStepExecution.status !== 'DONE'
      ? 'blue'
      : 'gray'
    return (
      <>
        <Typography.Paragraph style={{ color }}>
          <span>
            {isLoading ? (
              <LoadingOutlined />
            ) : isPaused ? (
              <PauseCircleOutlined />
            ) : isDone ? (
              <CheckCircleOutlined />
            ) : isFailed ? (
              <CloseOutlined />
            ) : null}
          </span>{' '}
          {renderProcessMessage(
            etherspotStepExecution.process[etherspotStepExecution.process.length - 1],
          )}
        </Typography.Paragraph>
        {isFailed && (
          <Typography.Paragraph>
            {renderProcessError(
              etherspotStepExecution.process[etherspotStepExecution.process.length - 1],
            )}
          </Typography.Paragraph>
        )}
      </>
    )
  }

  const parseMinimalEtherspotStep = () => {
    return (
      <Row justify="center" align="middle" style={{ textAlign: 'center' }}>
        <Col span={24} style={{ marginBottom: 8 }}>
          <Typography.Text>
            {formatTokenAmount(previousStepInfo.token!, previousStepInfo.amount)}{' '}
            <ArrowRightOutlined />{' '}
            {!!stakingStep
              ? formatTokenAmount(
                  alternativeToToken || stakingStep.action.toToken,
                  stakingStep.estimate.toAmountMin,
                )
              : 'Loading...'}
          </Typography.Text>
        </Col>
        <Col span={24}>{parseEtherspotExecution()}</Col>
      </Row>
    )
  }

  return parseMinimalEtherspotStep()
}
