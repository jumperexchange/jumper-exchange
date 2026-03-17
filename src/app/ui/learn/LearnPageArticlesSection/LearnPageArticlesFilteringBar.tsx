import { HorizontalTabSize } from '@/components/HorizontalTabs/HorizontalTabs.style';
import { LearnPageArticlesFilteringBarContainer } from '../LearnArticlePage.style';
import { useLearnFiltering } from '../../../../providers/LearnProvider/filtering/LearnFilteringContext';
import { useMemo } from 'react';
import { SelectVariant } from '@/components/core/form/Select/Select.types';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTranslation } from 'react-i18next';
import dynamic from 'next/dynamic';
import { useBlogArticlesFilteringCategories } from './hooks';
import Stack from '@mui/material/Stack';
import { TAG_ALL } from '@/providers/LearnProvider/filtering/types';
import { capitalizeString } from '@/utils/capitalizeString';

const HorizontalTabs = dynamic(
  () =>
    import('@/components/HorizontalTabs/HorizontalTabs').then(
      (mod) => mod.HorizontalTabs,
    ),
  {
    ssr: false,
  },
);
const Select = dynamic(
  () =>
    import('@/components/core/form/Select/Select').then((mod) => mod.Select),
  {
    ssr: false,
  },
);

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

export const LearnPageArticlesFilteringBar = () => {
  const { t } = useTranslation();
  const { tab, tabs, changeTab } = useLearnFiltering();
  const isTablet = useMediaQuery((theme) => theme.breakpoints.down('md'));

  const {
    categories,
    filtersCount,
    applyFilters,
    clearAll,
    resetPending,
    hasPendingFiltersApplied,
  } = useBlogArticlesFilteringCategories();

  const tabOptions = useMemo(
    () => [
      {
        value: TAG_ALL,
        label: capitalizeString(TAG_ALL),
        'data-testid': `blog-articles-tab-${TAG_ALL}`,
      },
      ...[...(tabs ?? [])]?.sort().map((tabLabel) => ({
        value: tabLabel,
        label: tabLabel,
        'data-testid': `blog-articles-tab-${tabLabel}`,
      })),
    ],
    [tabs],
  );

  return (
    <LearnPageArticlesFilteringBarContainer>
      {isTablet ? (
        <Select
          options={tabOptions}
          value={tab ?? ''}
          onChange={changeTab}
          label={t('blog.views.viewBy')}
          variant={SelectVariant.Single}
          data-testid="blog-articles-filter-tab"
          menuPlacementX="right"
        />
      ) : (
        <HorizontalTabs
          tabs={tabOptions}
          value={tab ?? ''}
          onChange={(_, newValue) => changeTab(newValue)}
          size={HorizontalTabSize.MD}
          data-testid="blog-articles-tabs"
          sx={(theme) => ({
            width: 'fit-content',
            backgroundColor: `${(theme.vars || theme).palette.alpha100.main} !important`,
          })}
        />
      )}
      <Stack>
        {isTablet ? (
          <MultiLayerDrawer
            categories={categories}
            title={t('blog.filter.filterAndSort')}
            applyButtonLabel={t('blog.filter.filterAndSort')}
            clearButtonLabel={t('blog.filter.clearAll')}
            onApply={applyFilters}
            onClear={clearAll}
            onClose={resetPending}
            appliedFiltersCount={filtersCount}
            disableApply={!hasPendingFiltersApplied}
            disableClear={!hasPendingFiltersApplied}
            testId="blog-articles-mobile-drawer"
            defaultTriggerSx={{ justifyContent: 'flex-end' }}
          />
        ) : (
          <FilterSortModal
            categories={categories}
            applyButtonLabel={t('blog.filter.filterAndSort')}
            clearButtonLabel={t('blog.filter.clearAll')}
            triggerButtonLabel={t('blog.filter.filterSort')}
            onApply={applyFilters}
            onClear={clearAll}
            onClose={resetPending}
            appliedFiltersCount={filtersCount}
            disableApply={!hasPendingFiltersApplied}
            disableClear={!hasPendingFiltersApplied}
            testId="blog-articles-desktop-modal"
            defaultTriggerSx={{ justifyContent: 'flex-end' }}
          />
        )}
      </Stack>
    </LearnPageArticlesFilteringBarContainer>
  );
};
