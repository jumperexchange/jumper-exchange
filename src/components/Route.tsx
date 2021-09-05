import { Button, Steps } from 'antd';
import React from 'react';
import { formatTokenAmount } from '../services/utils';
import { TranferStep } from '../types/server';

interface RouteProps {
  route: Array<TranferStep>
  selected: boolean
  onSelect: Function
}

const getUniswapCloneName = (chainId: number) =>{
  switch (chainId){
    case 1:
      return "Uniswap"
    case 56:
      return "PancakeSwap"
    case 100:
      return "Honeyswap"
    case 137:
      return "Quickswap"
    default:
      return ""
  }
}


const Route = ({ route, selected, onSelect }: RouteProps) => {

  const parseStep = (step: TranferStep) => {
    switch (step.action.type) {
      case "swap":
        return {
          title: "Swap Tokens",
          description: `${formatTokenAmount(step.action.fromToken, step.estimate?.fromAmount)} for ${formatTokenAmount(step.action.toToken, step.estimate?.toAmount)} on ${getUniswapCloneName(step.action.chainId)}`,
        }
      case "paraswap":
        return {
          title: `Swap ${step.action.target === 'channel' ? ' and Deposit' : ''} Tokens`,
          description: `${formatTokenAmount(step.action.fromToken, step.estimate?.fromAmount)} for ${formatTokenAmount(step.action.toToken, step.estimate?.toAmount)} via Paraswap`
        }
      case "1inch":
        return {
          title: `Swap ${step.action.target === 'channel' ? ' and Deposit' : ''} Tokens`,
          description: `${formatTokenAmount(step.action.fromToken, step.estimate?.fromAmount)} for ${formatTokenAmount(step.action.toToken, step.estimate?.toAmount)} via 1Inch`
        }
      case "cross":
        return {
          title: "Cross Chains",
          description: `${formatTokenAmount(step.action.fromToken, step.estimate?.fromAmount)} on ${step.action.chainKey} to ${formatTokenAmount(step.action.toToken, step.estimate?.toAmount)} on ${step.action.toChainKey}`,
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
