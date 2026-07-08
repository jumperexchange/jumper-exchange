'use client';

import type { PortfolioFilterViewBaseProps } from '../types';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { PortfolioViewBarTab } from '@/components/PortfolioFilterBar/types';
import { Select } from '@/components/core/form/Select/Select';
import { SelectVariant } from '@/components/core/form/Select/Select.types';
import { Badge } from '@/components/Badge/Badge';
import { BadgeSize, BadgeVariant } from '@/components/Badge/Badge.styles';

export const PortfolioFilterViewTablet: FC<PortfolioFilterViewBaseProps> = ({
  isDisabled,
  areTransactionsEnabled,
  value,
  onChange,
}) => {
  const { t } = useTranslation();
  const options = [
    {
      value: PortfolioViewBarTab.HOLDINGS,
      label: t('portfolio.views.holdings'),
      disabled: isDisabled,
      'data-testid': 'portfolio-filter-tab-holdings',
    },
    {
      value: PortfolioViewBarTab.TRANSACTIONS,
      label: t('portfolio.views.transactions'),
      disabled: isDisabled || !areTransactionsEnabled,
      'data-testid': 'portfolio-filter-tab-transactions',
      ...(!areTransactionsEnabled && {
        endAdornment: (
          <Badge
            size={BadgeSize.SM}
            variant={BadgeVariant.Secondary}
            label={t('portfolio.views.soon')}
          />
        ),
      }),
    },
    {
      value: PortfolioViewBarTab.PERFORMANCE,
      label: t('portfolio.views.performance'),
      disabled: true,
      'data-testid': 'portfolio-filter-tab-performance',
      endAdornment: (
        <Badge
          size={BadgeSize.SM}
          variant={BadgeVariant.Secondary}
          label={t('portfolio.views.soon')}
        />
      ),
    },
  ];

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
