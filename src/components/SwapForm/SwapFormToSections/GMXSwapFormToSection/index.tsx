import { Route, Token } from '@lifi/sdk'
import { Col, Input, Row } from 'antd'

import { formatTokenAmount } from '../../../../services/utils'

interface ToSectionGMXStakingProps {
  route?: Route
  tokenGMX?: Token
  routesLoading: boolean
}
export const ToSectionGMXStaking = ({
  route,
  tokenGMX,
  routesLoading,
}: ToSectionGMXStakingProps) => {
  const amount = route?.fromAmount || '0'
  const formattedAmount = route?.fromToken ? formatTokenAmount(route?.fromToken, amount) : '0'
  // eslint-disable-next-line no-console
  console.log({ route, tokenGMX })

  return (
    <Row
      style={{
        marginTop: '32px',
      }}
      gutter={[
        { xs: 8, sm: 16 },
        { xs: 8, sm: 16 },
      ]}>
      <Col span={10}>
        <div className="form-text">To:</div>
      </Col>
      <Col span={14}>
        <div className="form-input-wrapper">
          <Input
            type="text"
            value={routesLoading ? '.  .  .' : `${formattedAmount}`}
            bordered={false}
            disabled
            style={{ color: 'rgba(0, 0, 0, 0.85)', fontWeight: '400' }}
          />
        </div>
      </Col>
    </Row>
  )
}
