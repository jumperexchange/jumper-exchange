import type { FC } from 'react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { EarnOpportunityExtended } from 'src/stores/depositFlow/DepositFlowStore';
import type { Address, Hex } from 'viem';
import { useIsEarnUIFeatureDisabled } from '@/hooks/earn/useDisabledEarnUIFeatures';
import { usePortfolioDeFiPositions } from '@/hooks/portfolio/usePortfolioDeFiPositions';
import { useGetZapInPoolBalance } from '@/hooks/zaps/useGetZapInPoolBalance';
import { EarnInteractionFeature } from '@/types/earn';
import { RequestRedeemFlowIconButton } from '@/components/composite/RequestRedeemFlow/RequestRedeemFlow';
import { useRedeemableClaims } from '@/hooks/earn/useRedeemableClaims';
import { Variant as IconButtonVariant } from '@/components/core/buttons/types';
import CheckIcon from '@mui/icons-material/Check';
import ScheduleIcon from '@mui/icons-material/Schedule';
import { useToken } from '@/hooks/useToken';
import { createExtendedToken, createTokenBalance } from '@/types/tokens';
import { HorizontalTabSize } from '@/components/HorizontalTabs/HorizontalTabs.style';
import { MultiViewCard } from '@/components/composite/cards/MultiViewCard/MultiViewCard';
import { EarnYourPositionsView } from './EarnDetailsYourPositionView';
import { EarnDetailsEstimatedYieldView } from './EarnDetailsEstimatedYieldView';
import { useChainTypeData } from '@/hooks/chains/useChainTypeData';
import { AB_TEST_NAME } from '@/const/abtests';
import { useABTest } from '@/hooks/useABTest';
import { useTokenAmountInput } from '@/hooks/tokens/useTokenAmountInput';

interface EarnDetailsPositionProps {
  earnOpportunity: EarnOpportunityExtended;
}

enum EarnDetailsPositionView {
  POSITION = 'positions',
  YIELD = 'yield',
}

const DEFAULT_ESTIMATED_YIELD_USD = '1000';

export const EarnDetailsPosition: FC<EarnDetailsPositionProps> = ({
  earnOpportunity,
}) => {
  const { t } = useTranslation();
  const { toAmountFromPrice, toRawAmount } = useTokenAmountInput();
  const { account, isAccountConnected: isConnected } = useChainTypeData(
    earnOpportunity.lpToken.chain.chainId,
  );

  const { token: extendedToken } = useToken(
    earnOpportunity.lpToken.chain.chainId,
    earnOpportunity.lpToken.address as Address,
    { extended: true },
  );

  const priceUSD = useMemo(() => {
    return extendedToken?.priceUSD;
  }, [extendedToken]);

  const {
    isDisabled: isDepositFeatureDisabled,
    isLoading: isLoadingDepositFeatureDisabled,
  } = useIsEarnUIFeatureDisabled(
    EarnInteractionFeature.Deposit,
    earnOpportunity.interactionFlags,
  );
  const {
    isDisabled: isWithdrawFeatureDisabled,
    isLoading: isLoadingWithdrawFeatureDisabled,
  } = useIsEarnUIFeatureDisabled(
    EarnInteractionFeature.Withdraw,
    earnOpportunity.interactionFlags,
  );

  const {
    data: positionsData,
    isLoading: isLoadingPositions,
    refetch: refetchPositions,
  } = usePortfolioDeFiPositions({
    accounts: account ? [account] : [],
    filter: {
      earn: earnOpportunity.slug,
    },
  });

  const {
    depositTokenData: depositAmount,
    refetchDepositToken: refetchDepositAmount,
    isLoadingDepositTokenData: isLoadingDepositTokenData,
  } = useGetZapInPoolBalance(
    account?.address,
    earnOpportunity.lpToken.address as Hex,
    earnOpportunity.lpToken.chain.chainId,
  );

  const requestRedeemFlowFeatureFlag = useABTest({
    feature: AB_TEST_NAME.REQUEST_REDEEM_FLOW,
    address: account?.address ?? '',
  });

  const isRequestRedeemFlowEnabled =
    !requestRedeemFlowFeatureFlag.isLoading &&
    requestRedeemFlowFeatureFlag.isEnabled &&
    !!requestRedeemFlowFeatureFlag.value;

  const depositAmountUSD = useMemo(() => {
    if (isLoadingPositions || !positionsData || !positionsData.data) {
      return undefined;
    }

    // If the deposit amount is defined, we don't need to use the positions data which might be outdated
    // The depositAmountUSD will be derived from the deposit amount
    if (isLoadingDepositTokenData || depositAmount !== undefined) {
      return undefined;
    }

    return positionsData.data[0]?.netUsd;
  }, [
    depositAmount,
    isLoadingDepositTokenData,
    positionsData,
    isLoadingPositions,
  ]);

  const depositTokenBalance = useMemo(() => {
    return createTokenBalance(
      createExtendedToken(earnOpportunity.lpToken, priceUSD ?? '0'),
      BigInt(depositAmount ?? 0),
    );
  }, [depositAmount, earnOpportunity.lpToken, priceUSD]);

  const yieldEstimateTokenBalance = useMemo(() => {
    const token = createExtendedToken(earnOpportunity.lpToken, priceUSD ?? '0');
    const depositAmountBigInt =
      depositAmount !== undefined ? BigInt(depositAmount) : 0n;

    if (depositAmountBigInt > 0n) {
      return createTokenBalance(token, depositAmountBigInt);
    }

    if (priceUSD && Number(priceUSD) > 0) {
      const tokenAmount = toAmountFromPrice(
        DEFAULT_ESTIMATED_YIELD_USD,
        priceUSD,
      );
      return createTokenBalance(
        token,
        toRawAmount(tokenAmount, token.decimals),
      );
    }

    return createTokenBalance(token, 0n);
  }, [
    depositAmount,
    earnOpportunity.lpToken,
    priceUSD,
    toAmountFromPrice,
    toRawAmount,
  ]);

  const tabs = useMemo(
    () => [
      {
        label: t('earn.position.views.position'),
        value: EarnDetailsPositionView.POSITION,
      },
      {
        label: t('earn.position.views.yield'),
        value: EarnDetailsPositionView.YIELD,
      },
    ],
    [t],
  );

  const hasDeposited = !!depositAmount || !!depositAmountUSD;
  const isLoading =
    isLoadingPositions ||
    isLoadingDepositTokenData ||
    isLoadingDepositFeatureDisabled ||
    isLoadingWithdrawFeatureDisabled;

  const areActionsDisabled =
    isDepositFeatureDisabled && isWithdrawFeatureDisabled;

  const { data: redeemableClaims, refetch: refetchRedeemableClaims } =
    useRedeemableClaims(earnOpportunity, hasDeposited);

  const { hasAcceptedClaims, hasPendingClaims } = useMemo(() => {
    return {
      hasAcceptedClaims: redeemableClaims?.claimData?.some(
        (claim) => claim.status === 'ready',
      ),
      hasPendingClaims: redeemableClaims?.claimData?.some(
        (claim) => claim.status === 'pending',
      ),
    };
  }, [redeemableClaims]);

  const handleRefreshBalances = () => {
    refetchPositions();
    refetchDepositAmount();
    refetchRedeemableClaims();
  };

  return (
    <MultiViewCard
      tabs={tabs}
      size={HorizontalTabSize.SM}
      sx={{
        maxWidth: '-webkit-fill-available',
        width: {
          md: 408,
        },
      }}
      renderContent={(value) => {
        if (value === EarnDetailsPositionView.POSITION) {
          return (
            <EarnYourPositionsView
              earnOpportunity={earnOpportunity}
              depositTokenBalance={depositTokenBalance}
              isConnected={isConnected}
              isLoading={isLoading}
              isRequestRedeemFlowEnabled={isRequestRedeemFlowEnabled}
              hasDeposited={hasDeposited}
              areActionsDisabled={areActionsDisabled}
              onRefreshBalances={handleRefreshBalances}
            />
          );
        }
        if (value === EarnDetailsPositionView.YIELD) {
          return (
            <EarnDetailsEstimatedYieldView
              yieldEstimateTokenBalance={yieldEstimateTokenBalance}
              /** TODO: This needs to be properly implemented with JUM-543 */
              yieldBoost={earnOpportunity.latest?.apy?.total ?? 0}
            />
          );
        }

        return null;
      }}
      renderHeader={() => {
        if (!isRequestRedeemFlowEnabled) {
          return null;
        }

        if (hasAcceptedClaims) {
          return (
            <RequestRedeemFlowIconButton
              variant={IconButtonVariant.Success}
              tooltipContent={t('tooltips.claimRedeemPending')}
              earnOpportunity={earnOpportunity}
              refetchCallback={handleRefreshBalances}
            >
              <CheckIcon />
            </RequestRedeemFlowIconButton>
          );
        }

        if (hasPendingClaims) {
          return (
            <RequestRedeemFlowIconButton
              variant={IconButtonVariant.AlphaDark}
              tooltipContent={t('tooltips.claimRedeemAvailable')}
              earnOpportunity={earnOpportunity}
              refetchCallback={handleRefreshBalances}
            >
              <ScheduleIcon />
            </RequestRedeemFlowIconButton>
          );
        }

        return null;
      }}
    />
  );
};
