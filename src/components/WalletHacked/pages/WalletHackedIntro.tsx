import { useTranslation } from 'react-i18next';
import { WalletHackedStep } from 'src/components/WalletHacked/layouts/WalletHackedStep';
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
    <WalletHackedStep
      title={title}
      text={description}
      buttonLabel={buttonLabel}
      onClickAction={handleClick}
      disabled={false}
    />
  );
};
