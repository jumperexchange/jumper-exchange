import { useTranslation } from 'react-i18next';
import { useWalletMenu } from '@lifi/wallet-management';

import { ErrorType } from './useClaimPerkForm';

interface StatusSheetContent {
  title: string;
  description: string;
  callToAction: string;
  callToActionType: 'submit' | 'button';
  onClick?: () => void;
}

export const useStatusSheetContent = (
  errorType: ErrorType,
  handleCloseErrorBottomSheet: () => void,
): StatusSheetContent => {
  const { t } = useTranslation();
  const { openWalletMenu } = useWalletMenu();

  switch (errorType) {
    case ErrorType.SignatureFailed:
      return {
        title: t('modal.perks.signatureFailed.title'),
        description: t('modal.perks.signatureFailed.description'),
        callToAction: t('modal.perks.signatureFailed.tryAgain'),
        callToActionType: 'submit' as const,
      };
    case ErrorType.ValidationFailed:
      return {
        title: t('modal.perks.validationFailed.title'),
        description: t('modal.perks.validationFailed.description'),
        callToAction: t('modal.perks.validationFailed.close'),
        callToActionType: 'button' as const,
        onClick: () => {
          handleCloseErrorBottomSheet();
        },
      };
    case ErrorType.UnsupportedWallet:
      return {
        title: t('modal.perks.unsupportedWallet.title'),
        description: t('modal.perks.unsupportedWallet.description'),
        callToAction: t('modal.perks.unsupportedWallet.switchWallet'),
        callToActionType: 'button' as const,
        onClick: () => {
          handleCloseErrorBottomSheet();
          openWalletMenu();
        },
      };
    default:
      return {
        title: t('modal.perks.unknown.title'),
        description: t('modal.perks.unknown.description'),
        callToAction: t('modal.perks.unknown.tryAgain'),
        callToActionType: 'submit' as const,
      };
  }
};
