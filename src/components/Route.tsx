import { Button, Steps } from 'antd'

import { formatTokenAmount } from '../services/utils'
import {
  CrossAction,
  CrossEstimate,
  getChainById,
  Route as RouteType,
  Step,
  SwapAction,
  SwapEstimate,
} from '../types'

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
    switch (step.action.type) {
      case 'swap':
        const swapAction = step.action as SwapAction
        const swapEstimate = step.estimate as SwapEstimate
        return {
          title: 'Swap Tokens',
          description: `${formatTokenAmount(
            swapAction.token,
            swapEstimate.fromAmount,
          )} for ${formatTokenAmount(
            swapAction.toToken,
            swapEstimate.toAmount,
          )} via ${formatToolName(swapAction.tool)}`,
        }
      case 'cross':
        const crossAction = step.action as CrossAction
        const crossEstimate = step.estimate as CrossEstimate
        return {
          title: 'Cross Chains',
          description: `${getChainById(crossAction.chainId).name}: ${formatTokenAmount(
            crossAction.token,
            crossEstimate.fromAmount,
          )} to ${getChainById(crossAction.toChainId).name}: ${formatTokenAmount(
            crossAction.toToken,
            crossEstimate.toAmount,
          )} via ${formatToolName(crossAction.tool)}`,
        }
      case 'withdraw':
        return {
          title: 'Withdraw',
          description: `${formatTokenAmount(step.action.token, step.estimate?.toAmount)} to 0x...`,
        }
      case 'deposit':
        return {
          title: 'Deposit',
          description: `${formatTokenAmount(
            step.action.token,
            step.estimate?.fromAmount,
          )} from 0x...`,
        }
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
