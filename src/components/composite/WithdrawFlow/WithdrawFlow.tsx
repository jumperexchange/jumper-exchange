'use client';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

import type { EarnOpportunityExtended } from 'src/stores/withdrawFlow/WithdrawFlowStore';
import { useWithdrawFlowStore } from 'src/stores/withdrawFlow/WithdrawFlowStore';
import { WithdrawButton } from '../WithdrawButton/WithdrawButton';
import type { WithdrawButtonProps } from '../WithdrawButton/WithdrawButton.types';
import { WithdrawModal } from '../WithdrawModal/WithdrawModal';

export const WithdrawFlowModal = () => {
  const { selectedEarnOpportunity, isModalOpen, closeModal } =
    useWithdrawFlowStore((state) => state);

  if (!selectedEarnOpportunity) {
    return null;
  }

  return (
    <WithdrawModal
      isOpen={isModalOpen}
      onClose={closeModal}
      earnOpportunity={selectedEarnOpportunity!}
    />
  );
};

interface WithdrawFlowButtonProps extends Omit<WithdrawButtonProps, 'onClick'> {
  earnOpportunity: EarnOpportunityExtended;
  refetchCallback?: () => void;
}
export const WithdrawFlowButton: FC<WithdrawFlowButtonProps> = ({
  earnOpportunity,
  refetchCallback,
  ...props
}) => {
  const { t } = useTranslation();
  const openModal = useWithdrawFlowStore((state) => state.openModal);
  return (
    <WithdrawButton
      onClick={() => openModal(earnOpportunity, refetchCallback)}
      label={t('buttons.withdrawButtonLabel')}
      {...props}
    />
  );
};
