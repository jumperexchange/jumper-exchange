import { Button, Steps } from 'antd';
import { formatTokenAmount } from '../services/utils';
import { CrossAction, CrossEstimate, getChainById, SwapAction, SwapEstimate, TranferStep } from '../types';

interface RouteProps {
  route: Array<TranferStep>
  selected: boolean
  onSelect: Function
}

const Route = ({ route, selected, onSelect }: RouteProps) => {

  const parseStep = (step: TranferStep) => {
    switch (step.action.type) {
      case "swap":
        const swapAction = step.action as SwapAction
        const swapEstimate = step.estimate as SwapEstimate
        return {
          title: "Swap Tokens",
          description: `${formatTokenAmount(swapAction.token, swapEstimate.fromAmount)} for ${formatTokenAmount(swapAction.toToken, swapEstimate.toAmount)} via ${swapAction.tool}`,
        }
      case "cross":
        const crossAction = step.action as CrossAction
        const crossEstimate = step.estimate as CrossEstimate
        return {
          title: "Cross Chains",
          description: `${formatTokenAmount(crossAction.token, crossEstimate.fromAmount)} on ${getChainById(crossAction.chainId).key} to ${formatTokenAmount(crossAction.toToken, crossEstimate.toAmount)} on ${getChainById(crossAction.toChainId).key}`,
        }
      case "withdraw":
        return {
          title: "Withdraw",
          description: `${formatTokenAmount(step.action.token, step.estimate?.toAmount)} to 0x...`,
        }
      case "deposit":
        return {
          title: "Deposit",
          description: `${formatTokenAmount(step.action.token, step.estimate?.fromAmount)} from 0x...`,
        }
    }
  }

  return (

    <div
      className={'swap-route ' + (selected ? 'optimal' : '')}
      style={{ padding: 24, paddingTop: 24, paddingBottom: 24, marginLeft: 10, marginRight: 10 }}
      onClick={() => onSelect()}
    >
      <Steps progressDot size="small" direction="vertical" current={5} className="progress-step-list">
        {
          route.map(step => {
            let { title, description } = parseStep(step)
            return <Steps.Step key={title} title={title} description={description}></Steps.Step>
          })
        }
      </Steps>

      <div className="selected">
        {selected ? (
          <div className="selected-label">Selected</div>
        ) : (
          <Button shape="round" size={"large"} onClick={() => onSelect()}>Select Route</Button>
        )}
      </div>
    </div>

  )
}

export default Route
