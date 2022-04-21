import { Button, Steps } from 'antd'
import BigNumber from 'bignumber.js'

import { formatTokenAmount, parseSecondsAsTime } from '../services/utils'
import { findTool, getChainById, Route as RouteType, Step } from '../types'

interface RouteProps {
  route: RouteType
  selected: boolean
  onSelect: Function
}

const Route = ({ route, selected, onSelect }: RouteProps) => {
  const formatToolName = (toolKey: string) => {
    const tool = findTool(toolKey)
    if (tool) {
      return tool.name
    } else {
      return toolKey
    }
  }

  const parseStepShort = (step: Step) => {
    switch (step.type) {
      case 'swap':
        return (
          <>
            Swap to {formatTokenAmount(step.action.toToken, step.estimate.toAmount)} via{' '}
            {formatToolName(step.tool)}
          </>
        )
      case 'cross':
        return (
          <>
            Transfer to {formatTokenAmount(step.action.toToken, step.estimate.toAmount)} via{' '}
            {formatToolName(step.tool)}
          </>
        )
      default:
        // eslint-disable-next-line no-console
        console.error('invalid short step')
        return <></>
    }
  }

  const parseStep = (step: Step) => {
    const { action, estimate } = step
    switch (step.type) {
      case 'swap':
        return {
          title: 'Swap Tokens',
          description: `${formatTokenAmount(
            action.fromToken,
            estimate.fromAmount,
          )} for ${formatTokenAmount(action.toToken, estimate.toAmount)} via ${formatToolName(
            step.tool,
          )}`,
        }
      case 'cross':
        return {
          title: 'Cross Chains',
          description: `${getChainById(action.fromChainId).name}: ${formatTokenAmount(
            action.fromToken,
            estimate.fromAmount,
          )} to ${getChainById(action.toChainId).name}: ${formatTokenAmount(
            action.toToken,
            estimate.toAmount,
          )} via ${formatToolName(step.tool)}`,
        }
      case 'lifi':
        return {
          title: 'LI.FI Contract',
          description: (
            <>
              Single transaction including:
              <br />
              <ol style={{ paddingLeft: 22 }}>
                {step.includedSteps.map(parseStepShort).map((line, index) => (
                  <li key={index}>{line}</li>
                ))}
              </ol>
            </>
          ),
        }
      default:
        return {
          title: 'Invalid Step',
          description: '',
        }
    }
  }

  const aggregatedDuration = route.steps.reduce<number>(
    (duration, step) => duration + step.estimate?.executionDuration || 1,
    0,
  )

  const parsedDuration = parseSecondsAsTime(aggregatedDuration)
  return (
    <div
      className="swap-route"
      style={{
        padding: 24,
        paddingTop: 24,
        paddingBottom: 24,
        marginLeft: 20,
        marginRight: 20,
        marginTop: 30,
        marginBottom: 30,
      }}
      onClick={() => onSelect()}>
      <Steps
        progressDot
        size="small"
        direction="vertical"
        current={5}
        className="progress-step-list">
        {route.steps.map((step) => {
          let { title, description } = parseStep(step)
          return <Steps.Step key={title} title={title} description={description}></Steps.Step>
        })}
      </Steps>

      <div className="selected">
        <div style={{ textAlign: 'justify', width: 'fit-content', margin: '0 auto' }}>
          Estimated token: <b>{formatTokenAmount(route.toToken, route.toAmount)}</b>
          <br />
          Estimated result:{' '}
          {!new BigNumber(route.toAmountUSD).isZero() ? `${route.toAmountUSD} USD` : '~'}
          <br />
          Estimated gas costs: {route.gasCostUSD} USD
          <br />
          Estimated duration: {parsedDuration} min
          <br />
        </div>

        <Button
          shape="round"
          disabled={selected}
          type="primary"
          size={'large'}
          onClick={() => onSelect()}>
          {selected ? 'Selected' : 'Click To Select Route'}
        </Button>
      </div>
    </div>
  )
}

export default Route
