import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import {
  EarnOpportunityExtended,
  useDepositFlowStore,
} from 'src/stores/depositFlow/DepositFlowStore';
import { DepositButton } from '../DepositButton/DepositButton';
import { DepositButtonProps } from '../DepositButton/DepositButton.types';
import { DepositModal } from '../DepositModal/DepositModal';

export const DepositFlowModal = () => {
  const { selectedEarnOpportunity, isModalOpen, closeModal } =
    useDepositFlowStore((state) => state);

  if (!selectedEarnOpportunity) {
    return null;
  }

  return (
    <DepositModal
      isOpen={isModalOpen}
      onClose={closeModal}
      earnOpportunity={selectedEarnOpportunity!}
    />
  );
};

interface DepositFlowButtonProps extends Omit<DepositButtonProps, 'onClick'> {
  earnOpportunity: EarnOpportunityExtended;
}
export const DepositFlowButton: FC<DepositFlowButtonProps> = ({
  earnOpportunity,
}) => {
  const { t } = useTranslation();
  const openModal = useDepositFlowStore((state) => state.openModal);
  return (
    <DepositButton
      onClick={() => openModal(earnOpportunity)}
      label={t('buttons.depositButtonLabel')}
    />
  );
};
