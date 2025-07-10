import { useAccount } from '@lifi/wallet-management';
import { useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ModalMenuPage } from 'src/components/WalletHacked/layout/WalletHackedLayout';
import { useWalletSigning } from 'src/hooks/useWalletSigning';
import { HACKED_WALLET_STEPS } from '../constants';
import { useWalletHacked } from '../context/WalletHackedContext';

export const WalletHackedDestinationSign = () => {
  const { t } = useTranslation();
  const { account } = useAccount();
  const {
    destinationWallet,
    sourceWallet,
    setDestinationWallet,
    setCurrentStep,
    sourcePoints,
  } = useWalletHacked();
  const { signWallet, prepareSigningMessage } = useWalletSigning();
  const isSigningWallet = useRef(false);
  const hasHandledWalletSignature = useRef(false);
  const title = t('walletHacked.steps.destination.title');
  const description = t('walletHacked.steps.destination.signDescription');
  const buttonLabel = t('walletHacked.actions.sign');

  useEffect(() => {
    if (!account?.address) {
      if (!destinationWallet?.account?.address) {
        setCurrentStep(HACKED_WALLET_STEPS.DESTINATION_CONNECT);
      } else if (!sourceWallet?.account?.address) {
        setCurrentStep(HACKED_WALLET_STEPS.SOURCE_CONNECT);
      }
    } else if (destinationWallet?.signed) {
      setCurrentStep(HACKED_WALLET_STEPS.SUMMARY);
    }
  }, [account, destinationWallet, setCurrentStep]);

  const handleSignDestinationWallet = useCallback(
    async (event?: React.MouseEvent) => {
      event?.stopPropagation();
      if (
        !destinationWallet ||
        destinationWallet.account?.address === undefined ||
        !destinationWallet?.signed
      ) {
        isSigningWallet.current = true;
        hasHandledWalletSignature.current = false;
      }
      const message = prepareSigningMessage(
        destinationWallet?.account?.address!,
        HACKED_WALLET_STEPS.DESTINATION_SIGN,
        sourcePoints!,
      ); //todo: replace with actual xp
      const signature = await signWallet(message);
      setDestinationWallet({
        account: destinationWallet?.account,
        verified: !!destinationWallet?.verified,
        signed: true,
        signature,
        message: message,
      });
      hasHandledWalletSignature.current = true;
    },
    [
      destinationWallet,
      prepareSigningMessage,
      signWallet,
      setDestinationWallet,
    ],
  );

  return (
    <ModalMenuPage
      title={title}
      text={description}
      buttonLabel={buttonLabel}
      showPrevButton={false}
      onClickAction={handleSignDestinationWallet}
      disabled={false}
    />
  );
};
