import type { EarnOpportunityExtended } from 'src/stores/depositFlow/DepositFlowStore';
import { useMemo } from 'react';
import { usePortfolioDeFiPositions } from '@/hooks/portfolio/usePortfolioDeFiPositions';
import { useAccountAddress } from '@/hooks/earn/useAccountAddress';
import { useGetZapInPoolBalance } from '@/hooks/zaps/useGetZapInPoolBalance';
import type { Address, Hex } from 'viem';
import { EarnInteractionFeature } from '@/types/earn';
import { useIsEarnUIFeatureDisabled } from '@/hooks/earn/useDisabledEarnUIFeatures';
import { MultiViewCard } from '@/components/composite/cards/MultiViewCard/MultiViewCard';
import { HorizontalTabSize } from '@/components/HorizontalTabs/HorizontalTabs.style';
import { createExtendedToken, createTokenBalance } from '@/types/tokens';
import { useToken } from '@/hooks/useToken';
import { EarnYourPositionsView } from './EarnYourPositionsView';
import { EarnYourYieldView } from './EarnYourYieldView';
import { useRedeemableClaims } from '@/hooks/earn/useRedeemableClaims';
import { Variant as IconButtonVariant } from '@/components/core/buttons/types';
import CheckIcon from '@mui/icons-material/Check';
import ScheduleIcon from '@mui/icons-material/Schedule';
import { RequestRedeemFlowIconButton } from '@/components/composite/RequestRedeemFlow/RequestRedeemFlow';

interface EarnDetailsPositionProps {
  earnOpportunity: EarnOpportunityExtended;
}

export const EarnDetailsPosition = ({
  earnOpportunity,
}: EarnDetailsPositionProps) => {
  const accountAddress = useAccountAddress();

  const { token: extendedToken } = useToken(
    earnOpportunity.lpToken.chain.chainId,
    earnOpportunity.lpToken.address as Address,
    { extended: true },
  );

  const priceUSD = useMemo(() => {
    return extendedToken?.priceUSD;
  }, [extendedToken]);

  const isConnected = !!accountAddress;

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
    addresses: accountAddress ? [accountAddress] : [],
    filter: {
      earn: earnOpportunity.slug,
    },
  });

  const {
    depositTokenData: depositAmount,
    refetchDepositToken: refetchDepositAmount,
    isLoadingDepositTokenData: isLoadingDepositTokenData,
  } = useGetZapInPoolBalance(
    accountAddress as Hex,
    earnOpportunity.lpToken.address as Hex,
    earnOpportunity.lpToken.chain.chainId,
  );

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

  const tabs = useMemo(
    () => [
      { label: 'Your positions', value: 'your-positions' },
      { label: 'Your yield', value: 'your-yield' },
    ],
    [],
  );

  const hasDeposited = !!depositAmount || !!depositAmountUSD;

  const { data: redeemableClaims, refetch: refetchRedeemableClaims } =
    useRedeemableClaims(earnOpportunity, hasDeposited);

  const isLoading =
    isLoadingPositions ||
    isLoadingDepositTokenData ||
    isLoadingDepositFeatureDisabled ||
    isLoadingWithdrawFeatureDisabled;

  const areActionsDisabled =
    isDepositFeatureDisabled && isWithdrawFeatureDisabled;

  const handleRefreshBalances = () => {
    refetchPositions();
    refetchDepositAmount();
    refetchRedeemableClaims();
  };

  const { hasAcceptedClaims, hasPendingClaims } = useMemo(() => {
    return {
      hasAcceptedClaims: redeemableClaims?.claimData?.some(
        (claim) => claim.status === 'accepted',
      ),
      hasPendingClaims: redeemableClaims?.claimData?.some(
        (claim) => claim.status === 'pending',
      ),
    };
  }, [redeemableClaims]);

  return (
    <MultiViewCard
      tabs={tabs}
      size={HorizontalTabSize.SM}
      sx={{
        width: {
          lg: 408,
        },
      }}
      renderContent={(value) => {
        if (value === 'your-positions') {
          return (
            <EarnYourPositionsView
              earnOpportunity={earnOpportunity}
              depositTokenBalance={depositTokenBalance}
              isConnected={isConnected}
              isLoading={isLoading}
              hasDeposited={hasDeposited}
              areActionsDisabled={areActionsDisabled}
              onRefreshBalances={handleRefreshBalances}
            />
          );
        }
        if (value === 'your-yield') {
          return (
            <EarnYourYieldView
              depositTokenBalance={depositTokenBalance}
              yieldBoost={earnOpportunity.latest?.apy?.total ?? 0}
            />
          );
        }
      }}
      renderHeader={() => {
        if (hasAcceptedClaims) {
          return (
            <RequestRedeemFlowIconButton
              variant={IconButtonVariant.Success}
              tooltipContent="Your withdrawal is ready"
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
              tooltipContent="You have a pending withdraw request"
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
