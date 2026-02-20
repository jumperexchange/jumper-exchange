'use client';

import type { FC } from 'react';
import { MultiLayerDrawer } from 'src/components/composite/MultiLayerDrawer/MultiLayerDrawer';
import { PortfolioAnimatedLayoutContainer } from '../components/PortfolioAnimatedLayoutContainer';
import { useTranslation } from 'react-i18next';

export const PortfolioFilterBarEmptyTablet: FC = () => {
  const { t } = useTranslation();

  return (
    <PortfolioAnimatedLayoutContainer useStackWrapper={false}>
      <MultiLayerDrawer
        categories={[]}
        title={t('portfolio.filter.filterAndSort')}
        applyButtonLabel={t('portfolio.filter.filterAndSort')}
        clearButtonLabel={t('portfolio.filter.clearAll')}
        onApply={() => {}}
        onClear={() => {}}
        disableApply={true}
        disableClear={true}
        testId="portfolio-filters-empty-drawer"
        defaultTriggerSx={{
          justifyContent: 'flex-end',
          pointerEvents: 'none',
        }}
      />
    </PortfolioAnimatedLayoutContainer>
  );
};
