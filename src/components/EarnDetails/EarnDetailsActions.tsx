import { EarnOpportunityExtended } from 'src/stores/depositFlow/DepositFlowStore';
import { DepositButtonDisplayMode } from '../composite/DepositButton/DepositButton.types';
import { DepositFlowButton } from '../composite/DepositFlow/DepositFlow';
import {
  EarnDetailsActionsContainer,
  ManagePositionsButton,
} from './EarnDetails.styles';
import { Tooltip } from '../core/Tooltip/Tooltip';
import Box from '@mui/material/Box';
import { useProjectLikeDataFromEarnOpportunity } from 'src/hooks/earn/useProjectLikeDataFromEarnOpportunity';
import { useMemo } from 'react';
import { useEnhancedZapData } from 'src/hooks/zaps/useEnhancedZapData';
import { useTranslation } from 'react-i18next';

interface EarnDetailsActionsProps {
  earnOpportunity: EarnOpportunityExtended;
}

export const EarnDetailsActions = ({
  earnOpportunity,
}: EarnDetailsActionsProps) => {
  const { t } = useTranslation();
  const customInformation =
    useProjectLikeDataFromEarnOpportunity(earnOpportunity);
  const projectData = useMemo(() => {
    return customInformation?.projectData;
  }, [customInformation?.projectData]);

  const { depositTokenData, isLoadingDepositTokenData } =
    useEnhancedZapData(projectData);

  const hasDeposited = !isLoadingDepositTokenData && !!depositTokenData;
  const managePositionButton = (
    <ManagePositionsButton fullWidth disabled={!hasDeposited}>
      {t('buttons.managePositionsButtonLabel')}
    </ManagePositionsButton>
  );

  const managePositionSection = !hasDeposited ? (
    <Tooltip title={t('tooltips.noPositionsToManage')} placement="bottom">
      <Box sx={{ width: '100%' }}>{managePositionButton}</Box>
    </Tooltip>
  ) : (
    managePositionButton
  );

  return (
    <EarnDetailsActionsContainer>
      <DepositFlowButton
        earnOpportunity={earnOpportunity}
        displayMode={DepositButtonDisplayMode.LabelOnly}
        size="large"
        label={t('buttons.depositButtonLabel')}
      />
      {managePositionSection}
    </EarnDetailsActionsContainer>
  );
};
