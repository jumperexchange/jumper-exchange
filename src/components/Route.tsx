import { Button, Steps } from 'antd'

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
          title: 'LiFi Contract',
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
      className={'swap-route ' + (selected ? 'optimal' : '')}
      style={{
        padding: 24,
        paddingTop: 24,
        paddingBottom: 24,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 20,
        marginBottom: 20,
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
        <div style={{ textAlign: 'left', paddingLeft: 20 }}>
          Estimated token: <b>{formatTokenAmount(route.toToken, route.toAmount)}</b>
          <br />
          Estimated result: {route.toAmountUSD} USD
          <br />
          Estimated gas costs: {route.gasCostUSD} USD
          <br />
          Estimated duration: {parsedDuration} min
          <br />
        </div>

        {selected ? (
          <div className="selected-label">Selected</div>
        ) : (
          <Button shape="round" type="text" size={'large'} onClick={() => onSelect()}>
            Click To Select Route
          </Button>
        )}
      </div>
    </div>
  )
}

export default Route
