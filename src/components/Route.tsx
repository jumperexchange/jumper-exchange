import { Button, Steps } from 'antd';
import { formatTokenAmount } from '../services/utils';
import { CrossAction, CrossEstimate, getChainById, SwapAction, SwapEstimate, TransferStep } from '../types';

interface RouteProps {
  route: Array<TransferStep>
  selected: boolean
  onSelect: Function
}

const Route = ({ route, selected, onSelect }: RouteProps) => {

  const parseStep = (step: TransferStep) => {
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
          description: `${getChainById(crossAction.chainId).key}: ${formatTokenAmount(crossAction.token, crossEstimate.fromAmount)} to ${getChainById(crossAction.toChainId).key}: ${formatTokenAmount(crossAction.toToken, crossEstimate.toAmount)} via ${crossAction.tool}`,
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
