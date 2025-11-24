import { useTranslation } from 'react-i18next';
import { useWalletMenu } from '@lifi/wallet-management';
import { SignMessageErrorType } from 'src/hooks/useSignMessage';

interface StatusSheetContent {
  title: string;
  description: string;
  callToAction: string;
  callToActionType: 'submit' | 'button';
  onClick?: () => void;
}

export const useStatusSheetContent = (
  errorType: SignMessageErrorType,
  handleCloseErrorBottomSheet: () => void,
): StatusSheetContent => {
  const { t } = useTranslation();
  const { openWalletMenu } = useWalletMenu();

  switch (errorType) {
    case SignMessageErrorType.SignatureFailed:
      return {
        title: t('missions.tasks.verifyWallet.status.signatureFailed.title'),
        description: t(
          'missions.tasks.verifyWallet.status.signatureFailed.description',
        ),
        callToAction: t(
          'missions.tasks.verifyWallet.status.signatureFailed.tryAgain',
        ),
        callToActionType: 'submit' as const,
      };
    case SignMessageErrorType.UnsupportedWallet:
      return {
        title: t('missions.tasks.verifyWallet.status.unsupportedWallet.title'),
        description: t(
          'missions.tasks.verifyWallet.status.unsupportedWallet.description',
        ),
        callToAction: t(
          'missions.tasks.verifyWallet.status.unsupportedWallet.switchWallet',
        ),
        callToActionType: 'button' as const,
        onClick: () => {
          handleCloseErrorBottomSheet();
          openWalletMenu();
        },
      };
    default:
      return {
        title: t('missions.tasks.verifyWallet.status.unknown.title'),
        description: t(
          'missions.tasks.verifyWallet.status.unknown.description',
        ),
        callToAction: t('missions.tasks.verifyWallet.status.unknown.tryAgain'),
        callToActionType: 'submit' as const,
      };
  }
};
