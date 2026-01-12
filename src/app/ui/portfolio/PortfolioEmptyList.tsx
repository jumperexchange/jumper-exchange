import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { PortfolioEmptyList as BasePortfolioEmptyList } from '@/components/core/empty-content/PortfolioEmptyList/PortfolioEmptyList';

interface PortfolioEmptyListProps {
  onClearFilters: () => void;
}

export const PortfolioEmptyList: FC<PortfolioEmptyListProps> = ({
  onClearFilters,
}) => {
  const { t } = useTranslation();
  return (
    <BasePortfolioEmptyList
      title={t('portfolio.emptyList.title')}
      description={t('portfolio.emptyList.description')}
      primaryButtonLabel={t('portfolio.emptyList.clearFilters')}
      onPrimaryButtonClick={onClearFilters}
    />
  );
};
