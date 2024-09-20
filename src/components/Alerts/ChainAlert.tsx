import { useChainTokenSelectionStore } from '@/stores/chainTokenSelection/ChainTokenSelectionStore';
import { ChainId } from '@lifi/sdk';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { InfoAlert } from '.';
import { InfoAlertClickable } from './InfoAlert/InfoAlertClickable';
import { useCheckWalletLinking } from 'src/hooks/useCheckWalletLinking';
import { useAccounts } from 'src/hooks/useAccounts';

export const ChainAlert = () => {
  const { t } = useTranslation();
  const { sourceChainToken, destinationChainToken } =
    useChainTokenSelectionStore();
  const [isClickable, setIsClickable] = useState<boolean>(false);
  const [chainId, setChainId] = useState<number>(0);
  const [title, setTitle] = useState<string>('');
  const [subtitle, setSubtitle] = useState<string>('');
  const [buttonText, setButtontext] = useState<string>('');
  const { account } = useAccounts();
  const { isSuccess: isWalletCheckSuccess, isWalletLinked } =
    useCheckWalletLinking({
      userAddress: account?.address,
      checkWalletLinking:
        sourceChainToken?.chainId === ChainId.SEI ||
        destinationChainToken?.chainId === ChainId.SEI,
    });

  useEffect(() => {
    if (!isWalletLinked && isWalletCheckSuccess) {
      setIsClickable(true);
      setChainId(ChainId.SEI);
      setTitle(t('seiAlert.title'));
      setSubtitle(t('seiAlert.subtitle'));
      setButtontext(t('seiAlert.buttonText'));
    } else {
      setIsClickable(false);
      setChainId(0);
    }
  }, [destinationChainToken, sourceChainToken, t, isWalletLinked]);

  return (
    <>
      {isClickable ? (
        <InfoAlertClickable
          active={chainId > 0}
          title={title}
          subtitle={subtitle}
          buttonText={buttonText}
        />
      ) : (
        <InfoAlert active={chainId > 0} title={title} subtitle={subtitle} />
      )}
    </>
  );
};
