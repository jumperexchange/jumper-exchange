import { Button, Typography } from 'antd'
import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import { Sdk } from 'etherspot'
import { useState } from 'react'

import { useKlimaStakingExecutor } from '../../hooks/Etherspot/klimaStakingExecutor'
import { ChainId, CoinKey, ExtendedRouteOptional, findDefaultToken, Token } from '../../types'
import LoadingIndicator from '../LoadingIndicator'
import { MinimalEtherspotStep } from '../SwappingEtherspot/StepRenderers/MinimalStepRenderers/MinimalEtherspotStep'

const TOKEN_POLYGON_USDC = findDefaultToken(CoinKey.USDC, ChainId.POL)

interface Props {
  etherSpotSDK: Sdk
  residualRoute: ExtendedRouteOptional
  etherspotWalletBalance: BigNumber
  setResidualRoute: Function
  setEtherspotWalletBalance: Function
  tokenPolygonSKLIMA: Token
}
export const ResidualRouteKlimaStakeModal = ({
  etherSpotSDK,
  residualRoute,
  etherspotWalletBalance,
  setEtherspotWalletBalance,
  setResidualRoute,
  tokenPolygonSKLIMA,
}: Props) => {
  const [isSwapping, setIsSwapping] = useState<boolean>(false)

  const {
    etherspotStepExecution,
    executeEtherspotStep,
    resetEtherspotExecution,
    handlePotentialEtherSpotError,
    finalizeEtherSpotExecution,
  } = useKlimaStakingExecutor()

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
        do you want to swap and stake it to sKLIMA?
      </Typography.Paragraph>
      <div style={{ marginBottom: 16, height: 80 }}>
        {MinimalEtherspotStep({
          etherspotStepExecution,
          stakingStep: residualRoute?.stakingStep,
          isSwapping: isSwapping,
          index: 0,
          alternativeToToken: tokenPolygonSKLIMA,
          previousStepInfo: {
            amount: ethers.BigNumber.from(
              etherspotWalletBalance?.shiftedBy(TOKEN_POLYGON_USDC.decimals).toString(),
            ).toString(),
            token: TOKEN_POLYGON_USDC,
          },
        })}
      </div>
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
              Swap and Stake
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
