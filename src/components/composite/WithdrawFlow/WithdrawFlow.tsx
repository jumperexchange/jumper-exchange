'use client';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

import type { EarnOpportunityExtended } from 'src/stores/withdrawFlow/WithdrawFlowStore';
import { useWithdrawFlowStore } from 'src/stores/withdrawFlow/WithdrawFlowStore';
import { WithdrawButton } from '../WithdrawButton/WithdrawButton';
import type { WithdrawButtonProps } from '../WithdrawButton/WithdrawButton.types';
import { WithdrawModal } from '../WithdrawModal/WithdrawModal';
import { useEarnOpportunityBySlug } from '@/hooks/earn/useEarnOpportunityBySlug';

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

export const WithdrawFlowOnDemandButton: FC<
  Omit<WithdrawFlowButtonProps, 'earnOpportunity'> & {
    earnOpportunitySlug: string;
  }
> = ({ earnOpportunitySlug, refetchCallback, ...props }) => {
  const { t } = useTranslation();
  const openModal = useWithdrawFlowStore((state) => state.openModal);
  const { refetch: fetchEarnOpportunity } =
    useEarnOpportunityBySlug(earnOpportunitySlug);
  const handleClick = async () => {
    try {
      const { data: earnOpportunity } = await fetchEarnOpportunity();
      if (!earnOpportunity) {
        return;
      }
      if (!earnOpportunity.lpToken?.address) {
        console.error('Invalid earn opportunity: missing lpToken.address');
        return;
      }
      openModal(
        {
          ...earnOpportunity,
          minFromAmountUSD: 0.99,
          positionUrl: earnOpportunity.url ?? 'unset',
          address: earnOpportunity.lpToken.address,
        },
        refetchCallback,
      );
    } catch (error) {
      //@Note: we'll add a visual feedback to the user if the opportunity is not found in the future
      console.error('Failed to fetch earn opportunity:', error);
    }
  };
  return (
    <WithdrawButton
      onClick={handleClick}
      label={t('buttons.withdrawButtonLabel')}
      {...props}
    />
  );
};
