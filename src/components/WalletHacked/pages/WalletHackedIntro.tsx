import { useTranslation } from 'react-i18next';
import { ModalMenuPage } from 'src/components/WalletHacked/layout/WalletHackedLayout';
import { HACKED_WALLET_STEPS } from '../constants';
import { useWalletHacked } from '../context/WalletHackedContext';

export const WalletHackedIntro = () => {
  const { t } = useTranslation();
  const { setCurrentStep } = useWalletHacked();
  const title = t('walletHacked.steps.intro.title');
  const description = t('walletHacked.steps.intro.description');
  const buttonLabel = t('walletHacked.actions.continue');

  const handleClick = () => {
    setCurrentStep(HACKED_WALLET_STEPS.SOURCE_CONNECT);
  };

  return (
    <ModalMenuPage
      title={title}
      text={description}
      buttonLabel={buttonLabel}
      showPrevButton={false}
      onClickAction={handleClick}
      disabled={false}
    />
  );
};
