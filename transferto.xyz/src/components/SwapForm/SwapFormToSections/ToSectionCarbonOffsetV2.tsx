import { Col, Input, Row, Tooltip } from 'antd'

import {
  useBeneficiaryInfo,
  useSetBeneficiaryInfo,
} from '../../../providers/ToSectionCarbonOffsetProvider'
import { formatTokenAmount } from '../../../services/utils'
import { Route, Token } from '../../../types'

const { TextArea } = Input

interface ToSectionCarbonOffsetProps {
  route?: Route
  fromToken?: Token
  className?: string
  tokenPolygonBCT?: Token
  routesLoading: boolean
}

export const ToSectionCarbonOffsetV2 = ({
  className,
  route,
  fromToken,
  routesLoading,
}: ToSectionCarbonOffsetProps) => {
  const beneficiaryInfo = useBeneficiaryInfo()
  const setBeneficiaryInfo = useSetBeneficiaryInfo()

  const amount = route?.fromAmount || '0'

  const formattedAmount = fromToken ? formatTokenAmount(fromToken, amount) : '0'

  const handleBeneficiaryNameChange = (name: string) => {
    setBeneficiaryInfo({ ...beneficiaryInfo, beneficiaryName: name })
  }
  const handleBeneficiaryAddressChange = (address: string) => {
    setBeneficiaryInfo({ ...beneficiaryInfo, beneficiaryAddress: address })
  }

  const handleRetirementMessageChange = (message: string) => {
    setBeneficiaryInfo({ ...beneficiaryInfo, retirementMessage: message })
  }

  return (
    <div className={className} key="to-section-carbon-offset">
      <Row
        style={{
          marginTop: '32px',
        }}
        gutter={[
          { xs: 8, sm: 16 },
          { xs: 8, sm: 16 },
        ]}>
        <Col span={10}>
          <div className="form-text">You pay</div>
        </Col>
        <Col span={14}>
          <div className="form-input-wrapper">
            <Input
              key="output-input"
              type="text"
              value={routesLoading ? '.  .  .' : formattedAmount}
              bordered={false}
              style={{ color: 'rgba(0, 0, 0, 0.85)', fontWeight: '400' }}
            />
          </div>
        </Col>
      </Row>
      <Row
        style={{
          marginTop: '32px',
        }}>
        <Input
          className="input-beneficiary"
          key="input-beneficiary-name"
          type="text"
          placeholder={`Name or organisation`}
          // value={beneficiaryName}
          onChange={(event) => handleBeneficiaryNameChange(event.currentTarget.value)}
          style={{ color: 'rgba(0, 0, 0, 0.85)', fontWeight: '400' }}
        />
      </Row>
      <Row>
        <Tooltip title="Defaults to the connected wallet address">
          <Input
            className="input-beneficiary"
            key="input-beneficiary-address"
            type="text"
            placeholder={`Enter 0x address (optional)`}
            // value={beneficiaryAddress}
            onChange={(event) => handleBeneficiaryAddressChange(event.currentTarget.value)}
            style={{ color: 'rgba(0, 0, 0, 0.85)', fontWeight: '400' }}
          />
        </Tooltip>
      </Row>
      <Row>
        <TextArea
          className="input-beneficiary"
          key="input-beneficiary-message"
          rows={4}
          placeholder={`Enter retirement message`}
          // value={retirementMessage}
          onChange={(event) => handleRetirementMessageChange(event.currentTarget.value)}
          style={{ color: 'rgba(0, 0, 0, 0.85)', fontWeight: '400' }}
        />
      </Row>
    </div>
  )
}
