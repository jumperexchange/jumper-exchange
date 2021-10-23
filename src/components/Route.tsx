import { Button, Steps } from 'antd'
import { formatTokenAmount } from '../services/utils'
import { ChainKey, CrossAction, CrossEstimate, getChainById, LiFiStep, Step, SwapAction, SwapEstimate } from '../types'

interface RouteProps {
  route: Array<Step>
  selected: boolean
  onSelect: Function
}

const chainNames: { [k in ChainKey]: string } = {
  eth: "Ethereum",
  pol: "Polygon",
  bsc: "BSC",
  dai: "xDai",
  okt: "OKEx",
  ftm: "Fantom",
  ava: "Avalance",
  arb: "Arbitrum",
  hec: "Huobi ECO",
  opt: "Optimistic ETH",
  one: "Harmony",

  // testnets
  rop: "Ropsten TEST",
  rin: "Rinkeby TEST",
  gor: "Goerli TEST",
  kov: "Kovan TEST",
  mum: "Mumbai TEST",
  arbt: "Arbitrum TEST",
  optt: "Optimism TEST",
  bsct: "BSC TEST",
  hect: "Huobi TEST",
  onet: "Harmony TEST",
}

const Route = ({ route, selected, onSelect }: RouteProps) => {

  const parseStepShort = (step: Step) => {
    switch (step.action.type) {
      case "swap":
        const swapAction = step.action as SwapAction
        const swapEstimate = step.estimate as SwapEstimate

        return <>
          Swap to {formatTokenAmount(swapAction.toToken, swapEstimate.toAmount)} via {swapAction.tool}
        </>
      case "cross":
        const crossAction = step.action as CrossAction
        const crossEstimate = step.estimate as CrossEstimate

        return <>
          Transfer to {formatTokenAmount(crossAction.toToken, crossEstimate.toAmount)} via {crossAction.tool}
        </>
    }
  }

  const parseStep = (step: Step) => {
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
          description: `${chainNames[getChainById(crossAction.chainId).key]}: ${formatTokenAmount(crossAction.token, crossEstimate.fromAmount)} to ${chainNames[getChainById(crossAction.toChainId).key]}: ${formatTokenAmount(crossAction.toToken, crossEstimate.toAmount)} via ${crossAction.tool}`,
        }
      case "lifi":
        const lifiStep = step as LiFiStep
        return {
          title: "LiFi Contract",
          description: <>
            One Transaction which:<br />
            <ol>
              {lifiStep.includedSteps.map(parseStepShort).map((line, index) => <li key={index}>{line}</li>)}
            </ol>
            Estimated result: <b>{formatTokenAmount(step.action.toToken, step.estimate?.toAmount)}</b>
          </>,
        }
    }
  }

  return (
    <div
      className={'swap-route ' + (selected ? 'optimal' : '')}
      style={{ padding: 24, paddingTop: 24, paddingBottom: 24, marginLeft: 10, marginRight: 10, marginTop: 20, marginBottom: 20, }}
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
          <Button shape="round" type="text" size={"large"} onClick={() => onSelect()}>Click To Select Route</Button>
        )}
      </div>
    </div>
  )
}

export default Route
