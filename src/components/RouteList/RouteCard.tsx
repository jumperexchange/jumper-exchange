import { Button, Col, Row, Timeline, Typography } from 'antd'
import BigNumber from 'bignumber.js'
import { useMemo } from 'react'

import { formatTokenAmount, parseSecondsAsTime } from '../../services/utils'
import { getChainById, Route as RouteType, Step } from '../../types'
import { getToolAvatarPrioritizeLifi } from '../Avatars/Avatars'

interface RouteProps {
  route: RouteType
  selected: boolean
  onSelect: Function
}

const RouteCard = ({ route, selected, onSelect }: RouteProps) => {
  const tag: string | undefined = useMemo(() => {
    if (!route.tags || !route.tags.length) {
      return 'GENERAL'
    } else if (route.tags.includes('RECOMMENDED')) {
      return 'RECOMMENDED'
    } else if (route.tags[0] === 'SAFEST') {
      return 'SAFE'
    } else if (route.tags[0] === 'CHEAPEST') {
      return 'CHEAP'
    } else if (route.tags[0] === 'FASTEST') {
      return 'FAST'
    } else {
      return route.tags[0]
    }
  }, [route])
  const parseStepShort = (step: Step) => {
    switch (step.type) {
      case 'swap':
        return (
          <>
            Swap to {formatTokenAmount(step.action.toToken, step.estimate.toAmount)} via{' '}
            {step.toolDetails.name}
          </>
        )
      case 'cross':
        return (
          <>
            Transfer to {formatTokenAmount(step.action.toToken, step.estimate.toAmount)} via{' '}
            {step.toolDetails.name}
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
          )} for ${formatTokenAmount(action.toToken, estimate.toAmount)} via ${
            step.toolDetails.name
          }`,
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
          )} via ${step.toolDetails.name}`,
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
        border: selected ? '1px solid #3f49e1' : 'none',
      }}
      onClick={() => onSelect()}>
      <Timeline className="progress-step-list">
        <Button
          shape="default"
          style={{ float: 'right', marginTop: 0, borderRadius: 3 }}
          disabled={selected}
          type="primary"
          size={'small'}
          onClick={() => onSelect()}>
          {selected ? 'Selected' : 'Click To Select'}
        </Button>
        {!!tag && (
          <Typography.Title style={{ marginBottom: 24, fontSize: 14, color: 'grey' }} level={5}>
            {tag}
          </Typography.Title>
        )}

        {route.steps.map((step) => {
          let { title, description } = parseStep(step)
          return (
            <Timeline.Item dot={getToolAvatarPrioritizeLifi(step)} key={title}>
              <Typography.Title style={{ fontSize: 14 }} level={5}>
                {title}
              </Typography.Title>
              <Typography.Text style={{ color: 'grey' }} type="secondary">
                {description}
              </Typography.Text>
            </Timeline.Item>
          )
        })}
      </Timeline>

      <div className="route-info">
        <div style={{ textAlign: 'justify', width: 'fit-content' }}>
          <b style={{ position: 'relative' }}>
            {`Estimated token: `}
            {formatTokenAmount(route.toToken, route.toAmount) + //.replace(route.toToken.symbol, '')
              ' '}
          </b>
          <br />
          <b>
            Estimated result:{' $'}
            {!new BigNumber(route.toAmountUSD).isZero() ? `${route.toAmountUSD} USD` : '~'}
          </b>
          <Row style={{ marginTop: 8 }} justify="space-between">
            <Col style={{ marginRight: 8 }} className="route-info-badge">
              {parsedDuration} min
            </Col>
            <Col className="route-info-badge">{route.gasCostUSD} USD Gas Cost</Col>
          </Row>
        </div>

        {/* <Button
          shape="round"
          disabled={selected}
          type="primary"
          size={'large'}
          onClick={() => onSelect()}>
          {selected ? 'Selected' : 'Click To Select Route'}
        </Button> */}
      </div>
    </div>
  )
}

export default RouteCard
