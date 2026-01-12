import type { EarnOpportunityExtended } from 'src/stores/depositFlow/DepositFlowStore';
import { DepositButtonDisplayMode } from '../composite/DepositButton/DepositButton.types';
import { DepositFlowButton } from '../composite/DepositFlow/DepositFlow';
import {
  EarnDetailsActionsButtonsContainer,
  EarnDetailsActionsContainer,
} from './EarnDetails.styles';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { WithdrawFlowButton } from '../composite/WithdrawFlow/WithdrawFlow';
import { EarnDetailsActionsPosition } from './EarnDetailsActionsPosition';
import { usePortfolioDeFiPositions } from '@/hooks/portfolio/usePortfolioDeFiPositions';
import { useAccountAddress } from '@/hooks/earn/useAccountAddress';
import { useGetZapInPoolBalance } from '@/hooks/zaps/useGetZapInPoolBalance';
import type { Hex } from 'viem';

interface EarnDetailsActionsProps {
  earnOpportunity: EarnOpportunityExtended;
}

export const EarnDetailsActions = ({
  earnOpportunity,
}: EarnDetailsActionsProps) => {
  const { t } = useTranslation();
  const accountAddress = useAccountAddress();

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

  const hasDeposited = !!depositAmount || !!depositAmountUSD;

  const handleRefreshBalances = () => {
    refetchPositions();
    refetchDepositAmount();
  };

  return (
    <EarnDetailsActionsContainer>
      <EarnDetailsActionsPosition
        token={earnOpportunity.lpToken}
        amountUSD={depositAmountUSD}
        amount={depositAmount}
      />
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
    </EarnDetailsActionsContainer>
  );
};
