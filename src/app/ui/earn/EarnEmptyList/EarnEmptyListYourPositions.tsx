import { PortfolioEmptyList } from '@/components/core/empty-content/PortfolioEmptyList/PortfolioEmptyList';
import { useTranslation } from 'react-i18next';
import { useEarnFiltering } from '../EarnFilteringContext';
import { EarnFilterTab } from '../types';
import { AppPaths } from '@/const/urls';
import { useRouter } from 'next/navigation';
import { useWalletMenu } from '@lifi/wallet-management';

export const EarnEmptyListYourPositions = () => {
  const { t } = useTranslation();
  const { changeTab, isNotConnected } = useEarnFiltering();
  const router = useRouter();
  const { openWalletMenu } = useWalletMenu();

  const handleConnectWallet = () => {
    openWalletMenu();
  };
  const handleViewAllMarkets = () => {
    changeTab(EarnFilterTab.ALL);
  };
  const handleGoToPortfolio = () => {
    router.push(AppPaths.Portfolio);
  };

  if (isNotConnected) {
    return (
      <PortfolioEmptyList
        title={t('earn.emptyList.yourPositionsNotConnected.title')}
        description={t('earn.emptyList.yourPositionsNotConnected.description')}
        primaryButtonLabel={t(
          'earn.emptyList.yourPositionsNotConnected.connectWallet',
        )}
        onPrimaryButtonClick={handleConnectWallet}
      />
    );
  }

  return (
    <PortfolioEmptyList
      title={t('earn.emptyList.yourPositions.title')}
      description={t('earn.emptyList.yourPositions.description')}
      primaryButtonLabel={t('earn.emptyList.yourPositions.viewAllMarkets')}
      onPrimaryButtonClick={handleViewAllMarkets}
      secondaryButtonLabel={t('earn.actions.goToPortfolio')}
      onSecondaryButtonClick={handleGoToPortfolio}
    />
  );
};
