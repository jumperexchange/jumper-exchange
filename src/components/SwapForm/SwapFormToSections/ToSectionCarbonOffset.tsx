import { Col, Input, Row } from 'antd'

import { formatTokenAmount } from '../../../services/utils'
import { Step, Token } from '../../../types'

interface ToSectionCarbonOffsetProps {
  step?: Step
  tokenPolygonBCT?: Token
}

export const ToSectionCarbonOffset = ({ step, tokenPolygonBCT }: ToSectionCarbonOffsetProps) => {
  const amount = step?.estimate?.toAmountMin || '0'
  const formattedAmount = tokenPolygonBCT ? formatTokenAmount(tokenPolygonBCT, amount) : '0'
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
        <div className="form-text">To retire</div>
      </Col>
      <Col span={14}>
        <div className="form-input-wrapper">
          <Input
            type="text"
            value={`${formattedAmount.split(' ')[0]} tons of carbon`}
            bordered={false}
            disabled
            style={{ color: 'rgba(0, 0, 0, 0.85)', fontWeight: '400' }}
          />
        </div>
      </Col>
    </Row>
  )
}
