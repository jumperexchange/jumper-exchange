'use client';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { TrackingAction, TrackingEventDataAction } from '@/const/trackingKeys';
import { useEarnOpportunityBySlug } from '@/hooks/earn/useEarnOpportunityBySlug';
import { useEarnTracking } from '@/hooks/userTracking/useEarnTracking';
import { BlockedAccountCallout } from '@/jumperFlags/bouncer/BlockedAccountCallout';
import { Bouncer } from '@/jumperFlags/bouncer/Bouncer';
import { WidgetTrackingProvider } from '@/providers/WidgetTrackingProvider';
import Box from '@mui/material/Box';
import type { EarnOpportunityExtended } from 'src/stores/depositFlow/DepositFlowStore';
import { useDepositFlowStore } from 'src/stores/depositFlow/DepositFlowStore';
import { DepositButton } from '../DepositButton/DepositButton';
import type { DepositButtonProps } from '../DepositButton/DepositButton.types';
import { DepositModal } from '../DepositModal/DepositModal';
import { ModalContainer } from '@/components/core/modals/ModalContainer/ModalContainer';

export const DepositFlowModal = () => {
  const { selectedEarnOpportunity, isModalOpen, closeModal } =
    useDepositFlowStore((state) => state);

  if (!selectedEarnOpportunity) {
    return null;
  }

  return (
    <>
      <Bouncer loading allowed>
        <WidgetTrackingProvider
          trackingActionKeys={{
            sourceChainAndTokenSelection:
              TrackingAction.OnSourceChainAndTokenSelectionEarnDeposit,
            availableRoutes: TrackingAction.OnAvailableRoutesEarnDeposit,
            routeExecutionStarted:
              TrackingAction.OnRouteExecutionStartedEarnDeposit,
            routeExecutionCompleted:
              TrackingAction.OnRouteExecutionCompletedEarnDeposit,
            routeExecutionFailed:
              TrackingAction.OnRouteExecutionFailedEarnDeposit,
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
      </Bouncer>
      <Bouncer blocked>
        <ModalContainer isOpen={isModalOpen} onClose={closeModal}>
          <Box sx={{ p: 3, maxWidth: 400 }}>
            <BlockedAccountCallout />
          </Box>
        </ModalContainer>
      </Bouncer>
    </>
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

  const handleClick = () => {
    trackEarnDepositClickEvent(earnOpportunity.slug);
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
  return (
    <DepositButton
      onClick={handleClick}
      label={t('buttons.depositButtonLabel')}
      {...props}
    />
  );
};
