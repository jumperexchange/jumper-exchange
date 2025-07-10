import { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ModalMenuPage } from 'src/components/WalletHacked/layout/WalletHackedLayout';
import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from 'src/const/trackingKeys';
import { useUserTracking } from 'src/hooks/userTracking';
import { HACKED_WALLET_STEPS } from '../constants';
import { useWalletHacked } from '../context/WalletHackedContext';
import { sanitizeAndValidateWallets } from '../utils/validateWallets';
import { useVerifyWallets } from '../utils/verifyWallets';

export const WalletHackedSummary = () => {
  const { t } = useTranslation();
  const { trackEvent } = useUserTracking();

  const {
    setCurrentStep,
    sourcePoints,
    sourceWallet,
    destinationWallet,
    setError,
    destinationPoints,
  } = useWalletHacked();
  const { mutate, isSuccess, isPending, isError } = useVerifyWallets();
  const title = t('walletHacked.steps.summary.title');
  const buttonLabel = t('walletHacked.actions.continue');
  const description = useMemo(() => {
    if (
      typeof sourcePoints === 'number' &&
      typeof destinationPoints === 'number' &&
      destinationPoints > 0
    ) {
      // return the full description including the sum of both wallet´s XP points
      return t('walletHacked.steps.summary.description', {
        points: sourcePoints,
        sourceWallet: sourceWallet?.account?.address,
        destinationWallet: destinationWallet?.account?.address,
        sumPoints: sourcePoints + destinationPoints,
      });
    } else {
      // return the short description without the sum of both wallet´s XP points
      return t('walletHacked.steps.summary.descriptionShort', {
        points: sourcePoints,
        sourceWallet: sourceWallet?.account?.address,
        destinationWallet: destinationWallet?.account?.address,
      });
    }
  }, [sourcePoints, destinationPoints, sourceWallet, destinationWallet, t]);

  useEffect(() => {
    if (isError) {
      setError(t('walletHacked.errors.failedToSubmit'));
    }
    if (isSuccess) {
      setCurrentStep(HACKED_WALLET_STEPS.SUCCESS);

      // if any of the values are not set, don't track the event
      if (
        !sourceWallet?.account?.address ||
        !destinationWallet?.account?.address ||
        (sourcePoints && isNaN(sourcePoints))
      )
        return;
      trackEvent({
        category: TrackingCategory.HackedWallet,
        action: TrackingAction.SubmitHackedWallet,
        label: 'submit-hacked-wallet',
        data: {
          [TrackingEventParameter.SourceWallet]: sourceWallet.account.address!,
          [TrackingEventParameter.DestinationWallet]:
            destinationWallet?.account?.address,
          ...(sourcePoints && {
            [TrackingEventParameter.SourcePoints]: sourcePoints,
          }),
          ...(typeof destinationPoints === 'number' && {
            [TrackingEventParameter.DestinationPoints]: destinationPoints,
          }),
        },
      });
    }
  }, [isSuccess, setCurrentStep]);

  const handleSubmit = useCallback(async () => {
    if (!sourceWallet || !destinationWallet) {
      throw new Error(t('walletHacked.errors.noWalletConnected'));
      return;
    }

    const {
      originWallet: sanitizedOriginWallet,
      destinationWallet: sanitizedDestinationWallet,
    } = await sanitizeAndValidateWallets(sourceWallet, destinationWallet);

    mutate({
      originWallet: sanitizedOriginWallet,
      destinationWallet: sanitizedDestinationWallet,
    });
  }, [sourceWallet, destinationWallet, t]);

  return (
    <ModalMenuPage
      title={title}
      text={description}
      buttonLabel={buttonLabel}
      showPrevButton={false}
      onClickAction={handleSubmit}
      disabled={isPending}
    />
  );
};
