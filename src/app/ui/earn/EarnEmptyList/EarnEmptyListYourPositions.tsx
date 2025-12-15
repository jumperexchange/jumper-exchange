import { PortfolioEmptyList } from '@/components/core/empty-content/PortfolioEmptyList/PortfolioEmptyList';
import { useTranslation } from 'react-i18next';
import { useEarnFiltering } from '../EarnFilteringContext';
import { EarnFilterTab } from '../types';

export const EarnEmptyListYourPositions = () => {
  const { t } = useTranslation();
  const { changeTab } = useEarnFiltering();
  const handleViewAllMarkets = () => {
    changeTab(EarnFilterTab.ALL);
  };
  return (
    <PortfolioEmptyList
      title={t('earn.emptyList.yourPositions.title')}
      description={t('earn.emptyList.yourPositions.description')}
      buttonLabel={t('earn.emptyList.yourPositions.viewAllMarkets')}
      onClick={handleViewAllMarkets}
    />
  );
};
