import { useTranslation } from 'react-i18next';
import { WalletHackedConnection } from '../layouts/WalletHackedConnection';

export const WalletHackedDestinationConnect = () => {
  const { t } = useTranslation();
  const title = t('walletHacked.steps.destination.title');
  const description = t('walletHacked.steps.destination.description');
  const buttonLabel = t('walletHacked.actions.connectWallet');

  return (
    <WalletHackedConnection
      title={title}
      description={description}
      buttonLabel={buttonLabel}
    />
  );
};
