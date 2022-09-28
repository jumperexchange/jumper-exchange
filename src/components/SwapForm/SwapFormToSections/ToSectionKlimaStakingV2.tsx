import { Route, Token } from '@lifi/sdk'
import { Col, Input, Row } from 'antd'

import { formatTokenAmount } from '../../../services/utils'

interface ToSectionKlimaStakingV2Props {
  route?: Route
  fromToken?: Token
  routesLoading: boolean
}
export const ToSectionKlimaStakingV2 = ({
  route,
  fromToken,
  routesLoading,
}: ToSectionKlimaStakingV2Props) => {
  const amount = route?.fromAmount || '0'
  const formattedAmount = fromToken ? formatTokenAmount(fromToken, amount) : '0'

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
        <div className="form-text">You Pay:</div>
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
