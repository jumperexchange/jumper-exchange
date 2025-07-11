import { useTranslation } from 'react-i18next';
import { useWalletSigning } from 'src/hooks/useWalletSigning';
import { HACKED_WALLET_STEPS } from '../constants';
import { useWalletHacked } from '../context/WalletHackedContext';
import { WalletHackedSignature } from '../layouts/WalletHackedSignature';

export const WalletHackedDestinationSign = () => {
  const { t } = useTranslation();
  const { destinationWallet, setDestinationWallet, sourcePoints } =
    useWalletHacked();
  const { prepareSigningMessage } = useWalletSigning();
  const title = t('walletHacked.steps.destination.title');
  const description = t('walletHacked.steps.destination.signDescription');
  const buttonLabel = t('walletHacked.actions.sign');

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
