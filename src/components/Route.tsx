import { Button, Steps } from 'antd'

import { formatTokenAmount } from '../services/utils'
import { getChainById, Route as RouteType, Step } from '../types'

interface RouteProps {
  route: RouteType
  selected: boolean
  onSelect: Function
}

const Route = ({ route, selected, onSelect }: RouteProps) => {
  const formatToolName = (name: string) => {
    const nameOnly = name.split('-')[0]
    return nameOnly[0].toUpperCase() + nameOnly.slice(1)
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
      // case 'lifi':
      default:
        throw new Error(`Unknown step type ${step.type}`)
    }
  }

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
