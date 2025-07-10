import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { ModalMenuPage } from 'src/components/WalletHacked/layout/WalletHackedLayout';

export const WalletHackedSuccess = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const title = t('walletHacked.steps.success.title');
  const description = t('walletHacked.steps.success.description');
  const buttonLabel = t('walletHacked.actions.done');

  const handleClick = () => {
    router.push('/');
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
