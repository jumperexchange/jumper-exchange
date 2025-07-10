import { useAccount, useAccountDisconnect } from '@lifi/wallet-management';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useWalletSigning } from 'src/hooks/useWalletSigning';
import { HACKED_WALLET_STEPS } from '../constants';
import { useWalletHacked } from '../context/WalletHackedContext';
import { WalletHackedSignature } from '../layouts/WalletHackedSignature';

export const WalletHackedSourceSign = () => {
  const { t } = useTranslation();
  const { account } = useAccount();
  const { sourceWallet, setCurrentStep, setSourceWallet, sourcePoints } =
    useWalletHacked();
  const disconnectWallet = useAccountDisconnect();
  const { prepareSigningMessage } = useWalletSigning();
  const title = t('walletHacked.steps.source.title');
  const description = t('walletHacked.steps.source.signDescription');
  const buttonLabel = t('walletHacked.actions.sign');

  useEffect(() => {
    if (!account?.address) {
      setCurrentStep(HACKED_WALLET_STEPS.SOURCE_CONNECT);
    }
    if (sourceWallet?.signed) {
      setCurrentStep(HACKED_WALLET_STEPS.DESTINATION_CONNECT);
      disconnectWallet(account);
    }
  }, [account, sourceWallet, setCurrentStep]);

  const message = useMemo(() => {
    const signingMessage = prepareSigningMessage(
      sourceWallet?.account?.address!,
      HACKED_WALLET_STEPS.SOURCE_SIGN,
      sourcePoints!,
    );
    return signingMessage;
  }, [sourceWallet, sourcePoints, prepareSigningMessage]);

  return (
    <WalletHackedSignature
      title={title}
      description={description}
      buttonLabel={buttonLabel}
      message={message}
      wallet={sourceWallet!}
      setWallet={setSourceWallet}
    />
  );
};
