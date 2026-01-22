'use client';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { WithdrawButton } from '../WithdrawButton/WithdrawButton';
import type { WithdrawButtonProps } from '../WithdrawButton/WithdrawButton.types';
import { RequestRedeemModal } from '../RequestRedeemModal/RequestRedeemModal';
import { WidgetTrackingProvider } from '@/providers/WidgetTrackingProvider';
import { TrackingAction, TrackingEventDataAction } from '@/const/trackingKeys';
import { useEarnTracking } from '@/hooks/userTracking/useEarnTracking';
import type { EarnOpportunityExtended } from '@/stores/requestRedeemFlow/RequestRedeemFlowStore';
import { useRequestRedeemFlowStore } from '@/stores/requestRedeemFlow/RequestRedeemFlowStore';

export const RequestRedeemFlowModal = () => {
  const { selectedEarnOpportunity, isModalOpen, closeModal, refetchCallback } =
    useRequestRedeemFlowStore((state) => state);

  if (!selectedEarnOpportunity) {
    return null;
  }

  return (
    <WidgetTrackingProvider
      trackingActionKeys={{
        destinationChainAndTokenSelection:
          TrackingAction.OnDestinationChainAndTokenSelectionEarnWithdraw,
        availableRoutes: TrackingAction.OnAvailableRoutesEarnWithdraw,
        routeExecutionStarted:
          TrackingAction.OnRouteExecutionStartedEarnWithdraw,
        routeExecutionCompleted:
          TrackingAction.OnRouteExecutionCompletedEarnWithdraw,
        routeExecutionFailed: TrackingAction.OnRouteExecutionFailedEarnWithdraw,
        changeSettings: TrackingAction.OnChangeSettingsEarnWithdraw,
      }}
      trackingDataActionKeys={{
        routeExecutionStarted:
          TrackingEventDataAction.ExecutionStartEarnWithdraw,
        routeExecutionCompleted:
          TrackingEventDataAction.ExecutionCompletedEarnWithdraw,
        routeExecutionFailed:
          TrackingEventDataAction.ExecutionFailedEarnWithdraw,
      }}
    >
      <RequestRedeemModal
        isOpen={isModalOpen}
        onClose={closeModal}
        earnOpportunity={selectedEarnOpportunity!}
        refetchCallback={refetchCallback}
      />
    </WidgetTrackingProvider>
  );
};

interface RequestRedeemFlowButtonProps extends Omit<
  WithdrawButtonProps,
  'onClick'
> {
  earnOpportunity: EarnOpportunityExtended;
  refetchCallback?: () => void;
}
export const RequestRedeemFlowButton: FC<RequestRedeemFlowButtonProps> = ({
  earnOpportunity,
  refetchCallback,
  ...props
}) => {
  const { t } = useTranslation();
  const { trackEarnRequestRedeemClickEvent } = useEarnTracking();
  const openModal = useRequestRedeemFlowStore((state) => state.openModal);
  const handleClick = () => {
    trackEarnRequestRedeemClickEvent(earnOpportunity.slug);
    openModal(earnOpportunity, refetchCallback);
  };

  return (
    <WithdrawButton
      onClick={handleClick}
      label={t('buttons.withdrawButtonLabel')}
      {...props}
    />
  );
};
