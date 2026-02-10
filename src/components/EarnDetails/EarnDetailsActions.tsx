import { useAccount } from '@lifi/wallet-management';
import Typography from '@mui/material/Typography';
import { useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import type { EarnOpportunityExtended } from 'src/stores/depositFlow/DepositFlowStore';
import type { Hex } from 'viem';
import { useAccountAddress } from '@/hooks/earn/useAccountAddress';
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
} from './EarnDetails.styles';
import { EarnDetailsActionsPosition } from './EarnDetailsActionsPosition';

interface EarnDetailsActionsProps {
  earnOpportunity: EarnOpportunityExtended;
}

export const EarnDetailsActions = ({
  earnOpportunity,
}: EarnDetailsActionsProps) => {
  const { t } = useTranslation();
  const { account } = useAccount();
  const accountAddress = useAccountAddress();

  const isConnected = !!account?.address;

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
    accountAddress,
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

  const handleRefreshBalances = () => {
    refetchPositions();
    refetchDepositAmount();
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
          <Typography variant="bodyMediumParagraph" color="text.secondary">
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
        {hasDeposited && (
          <WithdrawFlowButton
            earnOpportunity={earnOpportunity}
            size="large"
            label={t('buttons.withdrawButtonLabel')}
            refetchCallback={handleRefreshBalances}
            data-testid="withdraw-button"
            sx={{ flex: 1 }}
          />
        )}
      </EarnDetailsActionsButtonsContainer>
    );
  };

  return (
    <EarnDetailsActionsContainer>
      <EarnDetailsActionsPosition
        token={earnOpportunity.lpToken}
        amountUSD={depositAmountUSD}
        amount={depositAmount}
      />
      {renderFooter()}
    </EarnDetailsActionsContainer>
  );
};
