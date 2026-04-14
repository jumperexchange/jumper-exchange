'use client';

import type { PortfolioFilterViewBaseProps } from '../types';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { PortfolioViewBarTab } from '../../../app/ui/portfolio/PortfolioContentSection';
import { Select } from '@/components/core/form/Select/Select';
import { SelectVariant } from '@/components/core/form/Select/Select.types';

export const PortfolioFilterViewTablet: FC<PortfolioFilterViewBaseProps> = ({
  isDisabled,
  value,
  onChange,
}) => {
  const { t } = useTranslation();
  const options = useMemo(() => {
    return [
      {
        value: PortfolioViewBarTab.HOLDINGS,
        label: t('portfolio.views.holdings'),
        disabled: isDisabled,
        'data-testid': 'portfolio-filter-tab-holdings',
      },
      {
        value: PortfolioViewBarTab.PERFORMANCE,
        label: t('portfolio.views.performance'),
        disabled: true,
        'data-testid': 'portfolio-filter-tab-performance',
      },
      {
        value: PortfolioViewBarTab.TRANSACTIONS,
        label: t('portfolio.views.transactions'),
        disabled: true,
        'data-testid': 'portfolio-filter-tab-transactions',
      },
    ];
  }, [t, isDisabled]);

  const handleChange = (value: string) => {
    const _value = value as PortfolioViewBarTab;
    onChange(_value);
  };
  return (
    <Select
      options={options}
      value={value}
      onChange={handleChange}
      label={t('portfolio.views.viewBy')}
      variant={SelectVariant.Single}
      data-testid="portfolio-filter-tab"
      menuPlacementX="right"
    />
  );
};
