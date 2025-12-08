import type { EarnOpportunityExtended } from 'src/stores/depositFlow/DepositFlowStore';
import { DepositButtonDisplayMode } from '../composite/DepositButton/DepositButton.types';
import { DepositFlowButton } from '../composite/DepositFlow/DepositFlow';
import {
  EarnDetailsActionsButtonsContainer,
  EarnDetailsActionsContainer,
} from './EarnDetails.styles';
import { useProjectLikeDataFromEarnOpportunity } from 'src/hooks/earn/useProjectLikeDataFromEarnOpportunity';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetZapInPoolBalance } from 'src/hooks/zaps/useGetZapInPoolBalance';
import type { Hex } from 'viem';
import { useAccount } from '@lifi/wallet-management';
import { WithdrawFlowButton } from '../composite/WithdrawFlow/WithdrawFlow';
import { EarnDetailsActionsPosition } from './EarnDetailsActionsPosition';

interface EarnDetailsActionsProps {
  earnOpportunity: EarnOpportunityExtended;
}

export const EarnDetailsActions = ({
  earnOpportunity,
}: EarnDetailsActionsProps) => {
  const { t } = useTranslation();
  const { account } = useAccount();
  const customInformation =
    useProjectLikeDataFromEarnOpportunity(earnOpportunity);
  const projectData = useMemo(() => {
    return customInformation?.projectData;
  }, [customInformation?.projectData]);

  const { depositTokenData, refetchDepositToken, isLoadingDepositTokenData } =
    useGetZapInPoolBalance(
      account.address as Hex,
      projectData.address as Hex,
      projectData.chainId,
    );

  const hasDeposited = !isLoadingDepositTokenData && !!depositTokenData;

  return (
    <EarnDetailsActionsContainer>
      <EarnDetailsActionsPosition
        token={earnOpportunity.lpToken}
        amount={depositTokenData?.toString()}
      />
      <EarnDetailsActionsButtonsContainer>
        <DepositFlowButton
          earnOpportunity={earnOpportunity}
          displayMode={DepositButtonDisplayMode.LabelOnly}
          size="large"
          label={t(hasDeposited ? 'buttons.deposit' : 'buttons.depositNow')}
          refetchCallback={refetchDepositToken}
          data-testid="quick-deposit-button"
          sx={{ flex: 1 }}
        />
        {hasDeposited && (
          <WithdrawFlowButton
            earnOpportunity={earnOpportunity}
            size="large"
            label={t('buttons.withdrawButtonLabel')}
            refetchCallback={refetchDepositToken}
            data-testid="withdraw-button"
            sx={{ flex: 1 }}
          />
        )}
      </EarnDetailsActionsButtonsContainer>
    </EarnDetailsActionsContainer>
  );
};
