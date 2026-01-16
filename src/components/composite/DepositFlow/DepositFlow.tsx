'use client';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

import type { EarnOpportunityExtended } from 'src/stores/depositFlow/DepositFlowStore';
import { useDepositFlowStore } from 'src/stores/depositFlow/DepositFlowStore';
import { DepositButton } from '../DepositButton/DepositButton';
import type { DepositButtonProps } from '../DepositButton/DepositButton.types';
import { DepositModal } from '../DepositModal/DepositModal';
import { useEarnOpportunityBySlug } from '@/hooks/earn/useEarnOpportunityBySlug';
import { TrackingAction, TrackingEventDataAction } from '@/const/trackingKeys';
import { WidgetTrackingProvider } from '@/providers/WidgetTrackingProvider';
import { useEarnTracking } from '@/hooks/userTracking/useEarnTracking';
import {
  useDisabledEarnUIFeatures,
  useIsEarnUIFeatureDisabled,
} from '@/hooks/earn/useDisabledEarnUIFeatures';
import { FeaturesAccessControlFeature } from '@/types/featuresAccessControl';
import { DisabledEarnFeatureTooltip } from '@/components/EarnDetails/DisabledEarnFeatureTooltip';

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
  const { trackEarnDepositClickEvent } = useEarnTracking();
  const openModal = useDepositFlowStore((state) => state.openModal);

  const { isDisabled: isFeatureDisabled, isLoading: isLoadingFeatureDisabled } =
    useIsEarnUIFeatureDisabled(
      FeaturesAccessControlFeature.Deposit,
      earnOpportunity.slug,
    );
  const effectiveIsDisabled =
    props.disabled || isFeatureDisabled || isLoadingFeatureDisabled;
  const effectiveProps = { ...props, disabled: effectiveIsDisabled };
  const handleClick = () => {
    trackEarnDepositClickEvent(earnOpportunity.slug);
    openModal(earnOpportunity, refetchCallback);
  };
  const tooltipContent = isFeatureDisabled ? (
    <DisabledEarnFeatureTooltip
      i18nKey="tooltips.depositDisabled"
      protocolName={earnOpportunity.protocol.name}
      protocolUrl={earnOpportunity.protocol.url}
    />
  ) : undefined;

  return (
    <DepositButton
      onClick={handleClick}
      label={t('buttons.depositButtonLabel')}
      tooltip={tooltipContent}
      {...effectiveProps}
    />
  );
};

export const DepositFlowOnDemandButton: FC<
  Omit<DepositFlowButtonProps, 'earnOpportunity'> & {
    earnOpportunitySlug: string;
    protocolUrl?: string;
    protocolName?: string;
  }
> = ({
  earnOpportunitySlug,
  refetchCallback,
  protocolUrl,
  protocolName,
  ...props
}) => {
  const { isDisabled: isFeatureDisabled, isLoading: isLoadingFeatureDisabled } =
    useIsEarnUIFeatureDisabled(
      FeaturesAccessControlFeature.Deposit,
      earnOpportunitySlug,
    );
  const effectiveIsDisabled =
    props.disabled || isFeatureDisabled || isLoadingFeatureDisabled;
  const effectiveProps = { ...props, disabled: effectiveIsDisabled };
  const { t } = useTranslation();
  const { trackEarnDepositClickEvent } = useEarnTracking();
  const openModal = useDepositFlowStore((state) => state.openModal);
  const { refetch: fetchEarnOpportunity } =
    useEarnOpportunityBySlug(earnOpportunitySlug);
  const handleClick = async () => {
    const { data: earnOpportunity } = await fetchEarnOpportunity();
    if (!earnOpportunity) {
      return;
    }
    trackEarnDepositClickEvent(earnOpportunity.slug);
    openModal(
      {
        ...earnOpportunity,
        minFromAmountUSD: 0.99,
        positionUrl: earnOpportunity.url ?? 'unset',
      },
      refetchCallback,
    );
  };
  const tooltipContent = isFeatureDisabled ? (
    <DisabledEarnFeatureTooltip
      i18nKey="tooltips.depositDisabled"
      protocolUrl={protocolUrl}
      protocolName={protocolName}
    />
  ) : undefined;
  return (
    <DepositButton
      onClick={handleClick}
      label={t('buttons.depositButtonLabel')}
      tooltip={tooltipContent}
      {...effectiveProps}
    />
  );
};
