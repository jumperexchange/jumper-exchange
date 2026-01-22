import { useWalletMenu } from '@lifi/wallet-management';
import { useTranslation } from 'react-i18next';

import { PortfolioEmptyList } from '@/components/core/empty-content/PortfolioEmptyList/PortfolioEmptyList';

import { useEarnFiltering } from '../EarnFilteringContext';

export const EarnEmptyListForYou = () => {
  const { t } = useTranslation();
  const { isConnected } = useEarnFiltering();
  const { openWalletMenu } = useWalletMenu();

  const handleConnectWallet = () => {
    openWalletMenu();
  };

  if (!isConnected) {
    return (
      <PortfolioEmptyList
        title={t('earn.emptyList.forYouNotConnected.title')}
        description={t('earn.emptyList.forYouNotConnected.description')}
        primaryButtonLabel={t(
          'earn.emptyList.forYouNotConnected.connectWallet',
        )}
        onPrimaryButtonClick={handleConnectWallet}
      />
    );
  }

  return null;
};
