import { PortfolioEmptyList } from '@/components/core/empty-content/PortfolioEmptyList/PortfolioEmptyList';
import { useTranslation } from 'react-i18next';
import { useEarnFiltering } from '../EarnFilteringContext';
import { useWalletMenu } from '@lifi/wallet-management';

export const EarnEmptyListForYou = () => {
  const { t } = useTranslation();
  const { isNotConnected } = useEarnFiltering();
  const { openWalletMenu } = useWalletMenu();

  const handleConnectWallet = () => {
    openWalletMenu();
  };

  if (isNotConnected) {
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
