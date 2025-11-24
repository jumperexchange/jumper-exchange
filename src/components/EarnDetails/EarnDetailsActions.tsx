import type { EarnOpportunityExtended } from 'src/stores/depositFlow/DepositFlowStore';
import { DepositButtonDisplayMode } from '../composite/DepositButton/DepositButton.types';
import { DepositFlowButton } from '../composite/DepositFlow/DepositFlow';
import { EarnDetailsActionsContainer } from './EarnDetails.styles';
import { Tooltip } from '../core/Tooltip/Tooltip';
import Box from '@mui/material/Box';
import { useProjectLikeDataFromEarnOpportunity } from 'src/hooks/earn/useProjectLikeDataFromEarnOpportunity';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetZapInPoolBalance } from 'src/hooks/zaps/useGetZapInPoolBalance';
import type { Hex } from 'viem';
import { useAccount } from '@lifi/wallet-management';
import { WithdrawFlowButton } from '../composite/WithdrawFlow/WithdrawFlow';

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

  // TODO: remove this once the balanceOf call is working or we have an endpoint to determine if the user has deposited
  const hasDeposited = true; //!isLoadingDepositTokenData && !!depositTokenData;

  const withdrawButton = (
    <WithdrawFlowButton
      earnOpportunity={earnOpportunity}
      size="large"
      label={t('buttons.withdrawButtonLabel')}
      refetchCallback={refetchDepositToken}
      disabled={!hasDeposited}
      data-testid="withdraw-button"
      fullWidth
    />
  );

  const withdrawSection = !hasDeposited ? (
    <Tooltip title={t('tooltips.noPositionsToManage')} placement="bottom">
      <Box sx={{ width: '100%' }}>{withdrawButton}</Box>
    </Tooltip>
  ) : (
    withdrawButton
  );

  return (
    <EarnDetailsActionsContainer>
      <DepositFlowButton
        earnOpportunity={earnOpportunity}
        displayMode={DepositButtonDisplayMode.LabelOnly}
        size="large"
        label={t('buttons.depositButtonLabel')}
        refetchCallback={refetchDepositToken}
        data-testid="quick-deposit-button"
      />
      {withdrawSection}
    </EarnDetailsActionsContainer>
  );
};
