'use client';

import { PortfolioViewBarTab } from '@/components/PortfolioFilterBar/types';
import type { HorizontalTabItem } from '@/components/HorizontalTabs/HorizontalTabs';
import { HorizontalTabs } from '@/components/HorizontalTabs/HorizontalTabs';
import { HorizontalTabSize } from '@/components/HorizontalTabs/HorizontalTabs.style';
import { useTranslation } from 'react-i18next';
import type { PortfolioFilterViewBaseProps } from '../types';
import type { FC } from 'react';
import { Badge } from '@/components/Badge/Badge';
import { BadgeSize, BadgeVariant } from '@/components/Badge/Badge.styles';

export const PortfolioFilterViewDesktop: FC<PortfolioFilterViewBaseProps> = ({
  isDisabled,
  areTransactionsEnabled,
  value,
  onChange,
}) => {
  const { t } = useTranslation();
  const tabOptions: HorizontalTabItem[] = [
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
  const handleChange = (_: React.SyntheticEvent, value: string) => {
    const _value = value as PortfolioViewBarTab;
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
