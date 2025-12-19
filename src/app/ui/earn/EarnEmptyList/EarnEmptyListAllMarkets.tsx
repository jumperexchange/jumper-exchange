import { PortfolioEmptyList } from '@/components/core/empty-content/PortfolioEmptyList/PortfolioEmptyList';
import { useTranslation } from 'react-i18next';
import { useEarnFiltering } from '../EarnFilteringContext';

export const EarnEmptyListAllMarkets = () => {
  const { t } = useTranslation();
  const { clearFilters } = useEarnFiltering();

  return (
    <PortfolioEmptyList
      title={t('earn.emptyList.noResults.title')}
      description={t('earn.emptyList.noResults.description')}
      primaryButtonLabel={t('earn.emptyList.noResults.clearFilters')}
      onPrimaryButtonClick={clearFilters}
    />
  );
};
