import { useTranslation } from 'react-i18next';
import { WalletHackedConnection } from '../layouts/WalletHackedConnection';

export const WalletHackedSourceConnect = () => {
  const { t } = useTranslation();
  const title = t('walletHacked.steps.source.title');
  const description = t('walletHacked.steps.source.description');
  const buttonLabel = t('walletHacked.actions.connectWallet');

  return (
    <WalletHackedConnection
      buttonLabel={buttonLabel}
      title={title}
      description={description}
    />
  );
};
