import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { WalletHackedStep } from 'src/components/WalletHacked/layouts/WalletHackedStep';
import { AppPaths } from 'src/const/urls';

export const WalletHackedSuccess = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const title = t('walletHacked.steps.success.title');
  const description = t('walletHacked.steps.success.description');
  const buttonLabel = t('walletHacked.actions.done');

  const handleClick = () => {
    router.push(AppPaths.Main);
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
