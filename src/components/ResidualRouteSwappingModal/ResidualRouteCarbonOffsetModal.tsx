import { Button, Collapse, Input, Row, Tooltip, Typography } from 'antd'
import TextArea from 'antd/lib/input/TextArea'
import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import { Sdk } from 'etherspot'
import { useState } from 'react'

import { useOffsetCarbonExecutor } from '../../hooks/Etherspot/offsetCarbonExecutor'
import {
  useBeneficiaryInfo,
  useSetBeneficiaryInfo,
} from '../../providers/ToSectionCarbonOffsetProvider'
import { ChainId, CoinKey, ExtendedRouteOptional, findDefaultToken } from '../../types'
import LoadingIndicator from '../LoadingIndicator'
import { MinimalEtherspotStep } from '../SwappingEtherspot/StepRenderers/MinimalStepRenderers/MinimalEtherspotStep'

const { Panel } = Collapse

const TOKEN_POLYGON_USDC = findDefaultToken(CoinKey.USDC, ChainId.POL)

interface Props {
  etherSpotSDK: Sdk
  residualRoute: ExtendedRouteOptional
  etherspotWalletBalance: BigNumber
  setResidualRoute: Function
  setEtherspotWalletBalance: Function
}
export const ResidualRouteCarbonOffsetModal = ({
  etherSpotSDK,
  residualRoute,
  etherspotWalletBalance,
  setEtherspotWalletBalance,
  setResidualRoute,
}: Props) => {
  const [isSwapping, setIsSwapping] = useState<boolean>(false)

  const {
    etherspotStepExecution,
    executeEtherspotStep,
    resetEtherspotExecution,
    handlePotentialEtherSpotError,
    finalizeEtherSpotExecution,
  } = useOffsetCarbonExecutor()
  // chains

  const setBeneficiaryInfo = useSetBeneficiaryInfo()
  const beneficiaryInfo = useBeneficiaryInfo()

  const stakeResidualFunds = async () => {
    setIsSwapping(true)
    try {
      finalizeEtherSpotExecution(
        await executeEtherspotStep(
          etherSpotSDK!,
          residualRoute!.gasStep!,
          residualRoute!.stakingStep!,
          ethers.utils
            .parseUnits(etherspotWalletBalance?.toString()!, TOKEN_POLYGON_USDC.decimals)
            .toString(),
        ),
        residualRoute!.stakingStep!.estimate.toAmountMin,
      )
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn(e)
      setIsSwapping(false)
      handlePotentialEtherSpotError(e, residualRoute!)
    }
  }

  return (
    <>
      <Typography.Paragraph>
        You still have {etherspotWalletBalance.toFixed(2)} USDC in your smart contract based wallet,
        do you want to swap and offset carbon using the Toucan Protocol: Base Carbon Tonne (BCT)?
      </Typography.Paragraph>
      <div style={{ marginBottom: 8, height: 80 }}>
        {MinimalEtherspotStep({
          etherspotStepExecution,
          stakingStep: residualRoute?.stakingStep,
          isSwapping: isSwapping,
          index: 0,
          previousStepInfo: {
            amount: etherspotWalletBalance.shiftedBy(TOKEN_POLYGON_USDC.decimals).toString(),
            token: TOKEN_POLYGON_USDC,
          },
        })}
      </div>

      <Collapse ghost>
        <Panel key={1} header="Add a message for this transaction">
          <Row>
            <Input
              disabled={isSwapping ? true : false}
              className="input-beneficiary"
              key="input-beneficiary-name"
              type="text"
              placeholder={`Name or organisation`}
              // value={beneficiaryName}
              onChange={(event) =>
                setBeneficiaryInfo({
                  ...beneficiaryInfo,
                  beneficiaryName: event.currentTarget.value,
                })
              }
              style={{ color: 'rgba(0, 0, 0, 0.85)', fontWeight: '400' }}
            />
          </Row>
          <Row>
            <Tooltip title="Defaults to the connected wallet address">
              <Input
                disabled={isSwapping ? true : false}
                className="input-beneficiary"
                key="input-beneficiary-address"
                type="text"
                placeholder={`Enter 0x address (optional)`}
                // value={beneficiaryAddress}
                onChange={(event) =>
                  setBeneficiaryInfo({
                    ...beneficiaryInfo,
                    beneficiaryAddress: event.currentTarget.value,
                  })
                }
                style={{ color: 'rgba(0, 0, 0, 0.85)', fontWeight: '400' }}
              />
            </Tooltip>
          </Row>
          <Row>
            <TextArea
              disabled={isSwapping ? true : false}
              className="input-beneficiary"
              key="input-beneficiary-message"
              rows={4}
              placeholder={`Enter retirement message`}
              // value={retirementMessage}
              onChange={(event) =>
                setBeneficiaryInfo({
                  ...beneficiaryInfo,
                  retirementMessage: event.currentTarget.value,
                })
              }
              style={{ color: 'rgba(0, 0, 0, 0.85)', fontWeight: '400' }}
            />
          </Row>
        </Panel>
      </Collapse>
      <div style={{ display: 'flex', justifyContent: 'center', alignContent: 'center' }}>
        {!etherspotStepExecution ? (
          <>
            <Button
              style={{ margin: 8 }}
              onClick={() => {
                setEtherspotWalletBalance(undefined)
                setResidualRoute(undefined)
              }}>
              Cancel
            </Button>
            <Button style={{ margin: 8 }} type="primary" onClick={stakeResidualFunds}>
              Swap and Offset
            </Button>
          </>
        ) : etherspotStepExecution.status === 'FAILED' ? (
          <Button
            style={{ margin: 8 }}
            type="primary"
            onClick={() => {
              resetEtherspotExecution()
              stakeResidualFunds()
            }}>
            Retry
          </Button>
        ) : etherspotStepExecution.status === 'DONE' ? (
          <>
            <Typography.Paragraph>Transaction Successful!</Typography.Paragraph>
          </>
        ) : (
          <Typography.Paragraph>
            <LoadingIndicator />
          </Typography.Paragraph>
        )}
      </div>
    </>
  )
}
