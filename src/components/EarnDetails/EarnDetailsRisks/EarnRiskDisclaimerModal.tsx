import { Typography } from '@mui/material';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import type { RiskDisclaimerType, RiskTag } from './EarnDetailsRisks';
import { EarnRiskDescriptionModalContentContainer } from './EarnDetailsRisks.styles';
import { ModalContainer } from '@/components/core/modals/ModalContainer/ModalContainer';

interface EarnRiskDisclaimerModalProps {
  type: RiskDisclaimerType;
  selectedTag: RiskTag;
  onClose: () => void;
}

export const EarnRiskDisclaimerModal: FC<EarnRiskDisclaimerModalProps> = ({
  type,
  selectedTag,
  onClose,
}) => {
  const { t } = useTranslation();
  if (!type) {
    return null;
  }

  const typeLabel =
    type === 'protocol'
      ? t('labels.protocol')
      : `${selectedTag} ${t('labels.category')}`;

  return (
    <ModalContainer isOpen onClose={onClose}>
      <EarnRiskDescriptionModalContentContainer>
        <Typography variant="titleMedium" sx={{ textTransform: 'capitalize' }}>
          {t('earn.riskDescriptions.riskDisclaimer.title', { type: typeLabel })}
        </Typography>
        <Typography
          variant="bodyMediumParagraph"
          color="textSecondary"
          sx={{ whiteSpace: 'pre-line' }}
        >
          {t(`earn.riskDescriptions.riskDisclaimer.description.${type}`)}
        </Typography>
      </EarnRiskDescriptionModalContentContainer>
    </ModalContainer>
  );
};
