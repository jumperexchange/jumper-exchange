'use client';

import type { PortfolioFilterViewBaseProps } from '../types';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { PortfolioFilterBarTab } from '../../../app/ui/portfolio/PortfolioAssetsSection';
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
        value: PortfolioFilterBarTab.TOKENS,
        label: t('portfolio.views.tokens'),
        disabled: isDisabled,
        'data-testid': 'portfolio-filter-tab-tokens',
      },
      {
        value: PortfolioFilterBarTab.DEFI_PROTOCOLS,
        label: t('portfolio.views.defiProtocols'),
        disabled: isDisabled,
        'data-testid': 'portfolio-filter-tab-defi-protocols',
      },
    ];
  }, [t, isDisabled]);

  const handleChange = (value: string) => {
    const _value = value as PortfolioFilterBarTab;
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
