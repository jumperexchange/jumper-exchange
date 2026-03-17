'use client';

import { PortfolioFilterBarTab } from '../../../app/ui/portfolio/PortfolioAssetsSection';
import type { HorizontalTabItem } from '@/components/HorizontalTabs/HorizontalTabs';
import { HorizontalTabs } from '@/components/HorizontalTabs/HorizontalTabs';
import { HorizontalTabSize } from '@/components/HorizontalTabs/HorizontalTabs.style';
import { useTranslation } from 'react-i18next';
import type { PortfolioFilterViewBaseProps } from '../types';
import type { FC } from 'react';

export const PortfolioFilterViewDesktop: FC<PortfolioFilterViewBaseProps> = ({
  isDisabled,
  value,
  onChange,
}) => {
  const { t } = useTranslation();
  const tabOptions: HorizontalTabItem[] = [
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
  const handleChange = (_: React.SyntheticEvent, value: string) => {
    const _value = value as PortfolioFilterBarTab;
    onChange(_value);
  };
  return (
    <HorizontalTabs
      tabs={tabOptions}
      size={HorizontalTabSize.MD}
      data-testid="portfolio-filter-tabs"
      onChange={handleChange}
      value={value}
      sx={(theme) => ({
        flexShrink: 0,
        backgroundColor: `${(theme.vars || theme).palette.alpha100.main} !important`,
        '& .MuiTab-root': {
          minWidth: 'fit-content',
          whiteSpace: 'pre-wrap',
        },
        ...(isDisabled && {
          '& .MuiTabs-indicator': {
            display: 'none',
          },
        }),
      })}
    />
  );
};
