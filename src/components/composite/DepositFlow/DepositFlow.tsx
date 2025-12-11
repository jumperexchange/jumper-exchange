'use client';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

import type { EarnOpportunityExtended } from 'src/stores/depositFlow/DepositFlowStore';
import { useDepositFlowStore } from 'src/stores/depositFlow/DepositFlowStore';
import { DepositButton } from '../DepositButton/DepositButton';
import type { DepositButtonProps } from '../DepositButton/DepositButton.types';
import { DepositModal } from '../DepositModal/DepositModal';
import { useEarnOpportunityBySlug } from '@/hooks/earn/useEarnOpportunityBySlug';
import { useUserTracking } from '@/hooks/userTracking/useUserTracking';
import {
  TrackingAction,
  TrackingCategory,
  TrackingEventDataAction,
  TrackingEventParameter,
} from '@/const/trackingKeys';
import { WidgetTrackingProvider } from '@/providers/WidgetTrackingProvider';

export const DepositFlowModal = () => {
  const { selectedEarnOpportunity, isModalOpen, closeModal } =
    useDepositFlowStore((state) => state);

  if (!selectedEarnOpportunity) {
    return null;
  }

  return (
    <WidgetTrackingProvider
      trackingActionKeys={{
        sourceChainAndTokenSelection:
          TrackingAction.OnSourceChainAndTokenSelectionEarnDeposit,
        availableRoutes: TrackingAction.OnAvailableRoutesEarnDeposit,
        routeExecutionStarted:
          TrackingAction.OnRouteExecutionStartedEarnDeposit,
        routeExecutionCompleted:
          TrackingAction.OnRouteExecutionCompletedEarnDeposit,
        routeExecutionFailed: TrackingAction.OnRouteExecutionFailedEarnDeposit,
        changeSettings: TrackingAction.OnChangeSettingsEarnDeposit,
      }}
      trackingDataActionKeys={{
        routeExecutionStarted:
          TrackingEventDataAction.ExecutionStartEarnDeposit,
        routeExecutionCompleted:
          TrackingEventDataAction.ExecutionCompletedEarnDeposit,
        routeExecutionFailed:
          TrackingEventDataAction.ExecutionFailedEarnDeposit,
      }}
    >
      <DepositModal
        isOpen={isModalOpen}
        onClose={closeModal}
        earnOpportunity={selectedEarnOpportunity!}
      />
    </WidgetTrackingProvider>
  );
};

interface DepositFlowButtonProps extends Omit<DepositButtonProps, 'onClick'> {
  earnOpportunity: EarnOpportunityExtended;
  refetchCallback?: () => void;
}
export const DepositFlowButton: FC<DepositFlowButtonProps> = ({
  earnOpportunity,
  refetchCallback,
  ...props
}) => {
  const { t } = useTranslation();
  const { trackEvent } = useUserTracking();
  const openModal = useDepositFlowStore((state) => state.openModal);

  const handleClick = () => {
    trackEvent({
      category: TrackingCategory.Earn,
      action: TrackingAction.ClickEarnDepositButton,
      label: 'click-earn-deposit-button',
      data: {
        [TrackingEventParameter.EarnOpportunitySlug]:
          earnOpportunity.slug || '',
      },
    });
    openModal(earnOpportunity, refetchCallback);
  };
  return (
    <DepositButton
      onClick={handleClick}
      label={t('buttons.depositButtonLabel')}
      {...props}
    />
  );
};

export const DepositFlowOnDemandButton: FC<
  Omit<DepositFlowButtonProps, 'earnOpportunity'> & {
    earnOpportunitySlug: string;
  }
> = ({ earnOpportunitySlug, refetchCallback, ...props }) => {
  const { t } = useTranslation();
  const { trackEvent } = useUserTracking();
  const openModal = useDepositFlowStore((state) => state.openModal);
  const { refetch: fetchEarnOpportunity } =
    useEarnOpportunityBySlug(earnOpportunitySlug);
  const handleClick = async () => {
    const { data: earnOpportunity } = await fetchEarnOpportunity();
    if (!earnOpportunity) {
      return;
    }
    trackEvent({
      category: TrackingCategory.Earn,
      action: TrackingAction.ClickEarnDepositButton,
      label: 'click-earn-deposit-button',
      data: {
        [TrackingEventParameter.EarnOpportunitySlug]:
          earnOpportunity.slug || '',
      },
    });
    openModal(
      {
        ...earnOpportunity,
        minFromAmountUSD: 0.99,
        positionUrl: earnOpportunity.url ?? 'unset',
      },
      refetchCallback,
    );
  };
  return (
    <DepositButton
      onClick={handleClick}
      label={t('buttons.depositButtonLabel')}
      {...props}
    />
  );
};
