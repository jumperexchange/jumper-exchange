import { useAccount } from '@lifi/wallet-management';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useWalletSigning } from 'src/hooks/useWalletSigning';
import { HACKED_WALLET_STEPS } from '../constants';
import { useWalletHacked } from '../context/WalletHackedContext';
import { WalletHackedSignature } from '../layouts/WalletHackedSignature';

export const WalletHackedDestinationSign = () => {
  const { t } = useTranslation();
  const { account } = useAccount();
  const {
    sourceWallet,
    destinationWallet,
    setDestinationWallet,
    setCurrentStep,
    sourcePoints,
  } = useWalletHacked();
  const { prepareSigningMessage } = useWalletSigning();
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

  const message = prepareSigningMessage(
    destinationWallet?.account?.address!,
    HACKED_WALLET_STEPS.DESTINATION_SIGN,
    sourcePoints!,
  );

  return (
    <WalletHackedSignature
      title={title}
      description={description}
      buttonLabel={buttonLabel}
      message={message}
      wallet={destinationWallet!}
      setWallet={setDestinationWallet}
    />
  );
};
