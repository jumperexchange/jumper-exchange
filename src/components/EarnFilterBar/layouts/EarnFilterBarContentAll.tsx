import useMediaQuery from '@mui/material/useMediaQuery';
import dynamic from 'next/dynamic';
import { useTranslation } from 'react-i18next';

import { EarnAnimatedLayoutContainer } from '../components/EarnAnimatedLayoutContainer';
import { useEarnFilterCategories } from '../hooks';

const MultiLayerDrawer = dynamic(() =>
  import('@/components/composite/MultiLayerDrawer/MultiLayerDrawer').then(
    (mod) => mod.MultiLayerDrawer,
  ),
);

const FilterSortModal = dynamic(() =>
  import('@/components/composite/FilterSortModal/FilterSortModal').then(
    (mod) => mod.FilterSortModal,
  ),
);

export const EarnFilterBarContentAll = () => {
  const { t } = useTranslation();
  const isTablet = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const {
    categories,
    filtersCount,
    applyFilters,
    clearAll,
    resetPending,
    hasPendingFiltersApplied,
  } = useEarnFilterCategories();

  return (
    <EarnAnimatedLayoutContainer useStackWrapper={false}>
      {isTablet ? (
        <MultiLayerDrawer
          categories={categories}
          title={t('earn.filter.filterAndSort')}
          applyButtonLabel={t('earn.filter.filterAndSort')}
          clearButtonLabel={t('earn.filter.clearAll')}
          onApply={applyFilters}
          onClear={clearAll}
          onClose={resetPending}
          appliedFiltersCount={filtersCount}
          disableApply={!hasPendingFiltersApplied}
          disableClear={!hasPendingFiltersApplied}
          testId="earn-filters-mobile-drawer"
          defaultTriggerSx={{ justifyContent: 'flex-end', flexShrink: 0 }}
        />
      ) : (
        <FilterSortModal
          categories={categories}
          applyButtonLabel={t('earn.filter.filterAndSort')}
          clearButtonLabel={t('earn.filter.clearAll')}
          triggerButtonLabel={t('earn.filter.filterSort')}
          onApply={applyFilters}
          onClear={clearAll}
          onClose={resetPending}
          appliedFiltersCount={filtersCount}
          disableApply={!hasPendingFiltersApplied}
          disableClear={!hasPendingFiltersApplied}
          testId="earn-filters-desktop-modal"
          defaultTriggerSx={{ justifyContent: 'flex-end', flexShrink: 0 }}
        />
      )}
    </EarnAnimatedLayoutContainer>
  );
};
