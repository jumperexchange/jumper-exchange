import Typography from '@mui/material/Typography';
import { useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import type { EarnOpportunityExtended } from 'src/stores/depositFlow/DepositFlowStore';
import type { Hex } from 'viem';
import { useIsEarnUIFeatureDisabled } from '@/hooks/earn/useDisabledEarnUIFeatures';
import { usePortfolioDeFiPositions } from '@/hooks/portfolio/usePortfolioDeFiPositions';
import { useGetZapInPoolBalance } from '@/hooks/zaps/useGetZapInPoolBalance';
import { EarnInteractionFeature } from '@/types/earn';
import { ConnectButton } from '../ConnectButton';
import { DepositButtonDisplayMode } from '../composite/DepositButton/DepositButton.types';
import { DepositFlowButton } from '../composite/DepositFlow/DepositFlow';
import { WithdrawFlowButton } from '../composite/WithdrawFlow/WithdrawFlow';
import { EmptyComponent } from '../core/EmptyComponent/EmptyComponent';
import { BaseSurfaceSkeleton } from '../core/skeletons/BaseSurfaceSkeleton/BaseSurfaceSkeleton.style';
import { ExternalLink } from '../Link/ExternalLink';
import {
  EarnDetailsActionsButtonsContainer,
  EarnDetailsActionsButtonsFallbackContainer,
  EarnDetailsActionsContainer,
  EarnDetailsActionsHeaderContainer,
} from './EarnDetails.styles';
import { EarnDetailsActionsPosition } from './EarnDetailsActionsPosition';
import {
  RequestRedeemFlowButton,
  RequestRedeemFlowIconButton,
} from '../composite/RequestRedeemFlow/RequestRedeemFlow';
import { useRedeemableClaims } from '@/hooks/earn/useRedeemableClaims';
import { Variant as IconButtonVariant } from '@/components/core/buttons/types';
import CheckIcon from '@mui/icons-material/Check';
import ScheduleIcon from '@mui/icons-material/Schedule';
import { useChainTypeData } from '@/hooks/chains/useChainTypeData';
import { isProduction } from '@/utils/isProduction';

interface EarnDetailsActionsProps {
  earnOpportunity: EarnOpportunityExtended;
}

export const EarnDetailsActions = ({
  earnOpportunity,
}: EarnDetailsActionsProps) => {
  const { t } = useTranslation();
  const { account, isAccountConnected: isConnected } = useChainTypeData(
    earnOpportunity.lpToken.chain.chainId,
  );

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

  const renderFooter = () => {
    if (!isConnected) {
      return (
        <EarnDetailsActionsButtonsFallbackContainer>
          <ConnectButton />
        </EarnDetailsActionsButtonsFallbackContainer>
      );
    }

    if (isLoading) {
      return (
        <EarnDetailsActionsButtonsContainer>
          <BaseSurfaceSkeleton
            variant="rounded"
            sx={(theme) => ({
              height: 48,
              width: '100%',
              borderRadius: theme.shape.buttonBorderRadius,
            })}
          />
        </EarnDetailsActionsButtonsContainer>
      );
    }

    if (areActionsDisabled) {
      return (
        <EarnDetailsActionsButtonsFallbackContainer>
          <Typography
            variant="bodyMediumParagraph"
            sx={{
              color: 'text.secondary',
            }}
          >
            <Trans
              i18nKey="earn.position.disabled"
              values={{ protocolName: earnOpportunity.protocol.name }}
              components={[
                earnOpportunity.protocol.url ? (
                  <ExternalLink href={earnOpportunity.protocol.url} />
                ) : (
                  <EmptyComponent />
                ),
              ]}
            />
          </Typography>
        </EarnDetailsActionsButtonsFallbackContainer>
      );
    }

    return (
      <EarnDetailsActionsButtonsContainer>
        <DepositFlowButton
          earnOpportunity={earnOpportunity}
          displayMode={DepositButtonDisplayMode.LabelOnly}
          size="large"
          label={t(hasDeposited ? 'buttons.deposit' : 'buttons.depositNow')}
          refetchCallback={handleRefreshBalances}
          data-testid="quick-deposit-button"
          sx={{ flex: 1 }}
        />
        {hasDeposited && earnOpportunity.isRedeemable && (
          <WithdrawFlowButton
            earnOpportunity={earnOpportunity}
            size="large"
            label={t('buttons.withdrawButtonLabel')}
            refetchCallback={handleRefreshBalances}
            data-testid="withdraw-button"
            sx={{ flex: 1 }}
          />
        )}
        {hasDeposited && !earnOpportunity.isRedeemable && !isProduction && (
          <RequestRedeemFlowButton
            earnOpportunity={earnOpportunity}
            size="large"
            label={t('buttons.withdrawButtonLabel')}
            refetchCallback={handleRefreshBalances}
            data-testid="request-redeem-button"
            sx={{ flex: 1 }}
          />
        )}
      </EarnDetailsActionsButtonsContainer>
    );
  };

  let claimRedeemButton = null;

  if (hasAcceptedClaims) {
    claimRedeemButton = (
      <RequestRedeemFlowIconButton
        variant={IconButtonVariant.Success}
        tooltipContent="Your withdrawal is ready"
        earnOpportunity={earnOpportunity}
        refetchCallback={handleRefreshBalances}
      >
        <CheckIcon />
      </RequestRedeemFlowIconButton>
    );
  } else if (hasPendingClaims) {
    claimRedeemButton = (
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

  return (
    <EarnDetailsActionsContainer>
      <EarnDetailsActionsHeaderContainer>
        {/** This is an interim solution until we can replace the section with the MultiViewCard */}
        <Typography variant="bodyXSmall" color="textSecondary">
          {t('earn.position.label')}
        </Typography>
        {!isProduction && claimRedeemButton}
      </EarnDetailsActionsHeaderContainer>
      <EarnDetailsActionsPosition
        token={earnOpportunity.lpToken}
        amountUSD={depositAmountUSD}
        amount={depositAmount}
      />
      {renderFooter()}
    </EarnDetailsActionsContainer>
  );
};
