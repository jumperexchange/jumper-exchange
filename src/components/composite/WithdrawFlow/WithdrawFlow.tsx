'use client';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

import type { EarnOpportunityExtended } from 'src/stores/withdrawFlow/WithdrawFlowStore';
import { useWithdrawFlowStore } from 'src/stores/withdrawFlow/WithdrawFlowStore';
import { WithdrawButton } from '../WithdrawButton/WithdrawButton';
import type { WithdrawButtonProps } from '../WithdrawButton/WithdrawButton.types';
import { WithdrawModal } from '../WithdrawModal/WithdrawModal';
import { useEarnOpportunityBySlug } from '@/hooks/earn/useEarnOpportunityBySlug';
import { WidgetTrackingProvider } from '@/providers/WidgetTrackingProvider';
import { TrackingAction, TrackingEventDataAction } from '@/const/trackingKeys';
import { useEarnTracking } from '@/hooks/userTracking/useEarnTracking';
import { useIsEarnUIFeatureDisabled } from '@/hooks/earn/useDisabledEarnUIFeatures';
import type { EarnInteractionFlags } from '@/types/jumper-backend';
import { EarnInteractionFeature } from '@/types/earn';
import { DisabledEarnFeatureTooltip } from '@/components/EarnDetails/DisabledEarnFeatureTooltip';

export const WithdrawFlowModal = () => {
  const { selectedEarnOpportunity, isModalOpen, closeModal } =
    useWithdrawFlowStore((state) => state);

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
      <WithdrawModal
        isOpen={isModalOpen}
        onClose={closeModal}
        earnOpportunity={selectedEarnOpportunity!}
      />
    </WidgetTrackingProvider>
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
  const { isDisabled: isFeatureDisabled, isLoading: isLoadingFeatureDisabled } =
    useIsEarnUIFeatureDisabled(
      EarnInteractionFeature.Withdraw,
      earnOpportunity.interactionFlags,
    );
  const effectiveIsDisabled =
    props.disabled || isFeatureDisabled || isLoadingFeatureDisabled;
  const effectiveProps = { ...props, disabled: effectiveIsDisabled };
  const { t } = useTranslation();
  const { trackEarnWithdrawClickEvent } = useEarnTracking();
  const openModal = useWithdrawFlowStore((state) => state.openModal);
  const handleClick = () => {
    trackEarnWithdrawClickEvent(earnOpportunity.slug);
    openModal(earnOpportunity, refetchCallback);
  };
  const tooltipContent = isFeatureDisabled ? (
    <DisabledEarnFeatureTooltip
      i18nKey="tooltips.withdrawDisabled"
      protocolName={earnOpportunity.protocol.name}
      protocolUrl={earnOpportunity.protocol.url}
    />
  ) : undefined;
  return (
    <WithdrawButton
      onClick={handleClick}
      label={t('buttons.withdrawButtonLabel')}
      tooltip={tooltipContent}
      {...effectiveProps}
    />
  );
};

export const WithdrawFlowOnDemandButton: FC<
  Omit<WithdrawFlowButtonProps, 'earnOpportunity'> & {
    earnOpportunitySlug: string;
    earnOpportunityInteractionFlags?: EarnInteractionFlags;
    protocolUrl?: string;
    protocolName?: string;
  }
> = ({
  earnOpportunitySlug,
  earnOpportunityInteractionFlags,
  refetchCallback,
  protocolUrl,
  protocolName,
  ...props
}) => {
  const { isDisabled: isFeatureDisabled, isLoading: isLoadingFeatureDisabled } =
    useIsEarnUIFeatureDisabled(
      EarnInteractionFeature.Withdraw,
      earnOpportunityInteractionFlags,
    );
  const effectiveIsDisabled =
    props.disabled || isFeatureDisabled || isLoadingFeatureDisabled;
  const effectiveProps = { ...props, disabled: effectiveIsDisabled };
  const { t } = useTranslation();
  const { trackEarnWithdrawClickEvent } = useEarnTracking();
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
      trackEarnWithdrawClickEvent(earnOpportunity.slug);
      openModal(
        {
          ...earnOpportunity,
          minFromAmountUSD: 0.99,
          positionUrl: earnOpportunity.url ?? 'unset',
        },
        refetchCallback,
      );
    } catch (error) {
      //@Note: we'll add a visual feedback to the user if the opportunity is not found in the future
      console.error('Failed to fetch earn opportunity:', error);
    }
  };
  const tooltipContent = isFeatureDisabled ? (
    <DisabledEarnFeatureTooltip
      i18nKey="tooltips.withdrawDisabled"
      protocolUrl={protocolUrl}
      protocolName={protocolName}
    />
  ) : undefined;
  return (
    <WithdrawButton
      onClick={handleClick}
      label={t('buttons.withdrawButtonLabel')}
      tooltip={tooltipContent}
      {...effectiveProps}
    />
  );
};
