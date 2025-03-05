import { useChainTokenSelectionStore } from '@/stores/chainTokenSelection/ChainTokenSelectionStore';
import { ChainId } from '@lifi/sdk';
import { useAccount } from '@lifi/wallet-management';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCheckWalletLinking } from 'src/hooks/useCheckWalletLinking';
import { InfoAlert } from '.';
import { InfoAlertClickable } from './InfoAlert/InfoAlertClickable';

export const ChainAlert = () => {
  const { t } = useTranslation();
  const { sourceChainToken, destinationChainToken } =
    useChainTokenSelectionStore();
  const [isClickable, setIsClickable] = useState<boolean>(false);
  const [chainId, setChainId] = useState<number>(0);
  const [title, setTitle] = useState<string>('');
  const [link, setLink] = useState<string>('');
  const [subtitle, setSubtitle] = useState<string>('');
  const [buttonText, setButtontext] = useState<string>('');
  const { account } = useAccount();
  const { isSuccess: isWalletCheckSuccess, isWalletLinked } =
    useCheckWalletLinking({
      userAddress: account?.address,
      checkWalletLinking:
        sourceChainToken?.chainId === ChainId.SEI ||
        destinationChainToken?.chainId === ChainId.SEI,
    });

  useEffect(() => {
    if (account?.connector?.name === 'Abstract') {
      setIsClickable(true);
      setChainId(ChainId.ABS);
      setTitle(t('abstractAlert.title'));
      setSubtitle(t('abstractAlert.subtitle'));
      setButtontext(t('abstractAlert.buttonText'));
      setLink('https://docs.abs.xyz/abstract-global-wallet/architecture');
    } else if (!isWalletLinked && isWalletCheckSuccess) {
      setIsClickable(true);
      setChainId(ChainId.SEI);
      setTitle(t('seiAlert.title'));
      setSubtitle(t('seiAlert.subtitle'));
      setButtontext(t('seiAlert.buttonText'));
      setLink('https://app.sei.io/');
    } else {
      setIsClickable(false);
      setChainId(0);
    }
  }, [
    destinationChainToken,
    sourceChainToken,
    t,
    isWalletLinked,
    isWalletCheckSuccess,
  ]);

  return (
    <>
      {isClickable ? (
        <InfoAlertClickable
          active={chainId > 0}
          title={title}
          subtitle={subtitle}
          buttonText={buttonText}
          link={link}
        />
      ) : (
        <InfoAlert active={chainId > 0} title={title} subtitle={subtitle} />
      )}
    </>
  );
};
