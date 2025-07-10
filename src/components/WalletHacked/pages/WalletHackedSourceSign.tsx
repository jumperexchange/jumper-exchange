import { useAccount } from '@lifi/wallet-management';
import { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ModalMenuPage } from 'src/components/WalletHacked/layout/WalletHackedLayout';
import { useWalletSigning } from 'src/hooks/useWalletSigning';
import { HACKED_WALLET_STEPS } from '../constants';
import { useWalletHacked } from '../context/WalletHackedContext';

export const WalletHackedSourceSign = () => {
  const { t } = useTranslation();
  const { account } = useAccount();
  const { sourceWallet, setSourceWallet, setCurrentStep, sourcePoints } =
    useWalletHacked();
  const { signWallet, prepareSigningMessage } = useWalletSigning();
  const title = t('walletHacked.steps.source.title');
  const description = t('walletHacked.steps.source.signDescription');

  useEffect(() => {
    if (!account?.address) {
      setCurrentStep(HACKED_WALLET_STEPS.SOURCE_CONNECT);
    }
    if (sourceWallet?.signed) {
      setCurrentStep(HACKED_WALLET_STEPS.DESTINATION_CONNECT);
    }
  }, [account, sourceWallet, setCurrentStep]);

  const buttonLabel = t('walletHacked.actions.sign');

  const message = useMemo(() => {
    const signingMessage = prepareSigningMessage(
      sourceWallet?.account?.address!,
      HACKED_WALLET_STEPS.SOURCE_SIGN,
      sourcePoints!,
    );
    return signingMessage;
  }, [sourceWallet, sourcePoints, prepareSigningMessage]);

  const handleSignSourceWallet = useCallback(
    async (event?: React.MouseEvent) => {
      event?.stopPropagation();
      const signature = await signWallet(message);
      setSourceWallet({
        ...sourceWallet,
        signed: true,
        signature: signature as `0x${string}`,
        message,
      });
    },
    [sourceWallet, prepareSigningMessage, signWallet, setSourceWallet],
  );

  return (
    <ModalMenuPage
      title={title}
      text={description}
      buttonLabel={buttonLabel}
      showPrevButton={false}
      onClickAction={handleSignSourceWallet}
      disabled={false}
    />
  );
};
