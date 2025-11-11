import { PortfolioFilterBarTab } from 'src/app/ui/portfolio/types';
import {
  HorizontalTabItem,
  HorizontalTabs,
} from '../HorizontalTabs/HorizontalTabs';
import { HorizontalTabSize } from '../HorizontalTabs/HorizontalTabs.style';
import { PortfolioFilterBarDeFi } from './components/PortfolioFilterBarDeFi';
import { PortfolioFilterBarTokens } from './components/PortfolioFilterBarTokens';
import { FC } from 'react';

export interface PortfolioFilterBarProps {
  value: PortfolioFilterBarTab;
  onChange: (value: PortfolioFilterBarTab) => void;
}

export const PortfolioFilterBar: FC<PortfolioFilterBarProps> = ({
  value,
  onChange,
}) => {
  const tabOptions: HorizontalTabItem[] = [
    {
      value: 'tokens',
      label: 'Tokens',
      'data-testid': 'portfolio-filter-tab-tokens',
    },
    {
      value: 'defi-protocols',
      label: 'DeFi Protocols',
      'data-testid': 'portfolio-filter-tab-defi-protocols',
    },
  ];
  return (
    <HorizontalTabs
      tabs={tabOptions}
      size={HorizontalTabSize.MD}
      data-testid="portfolio-filter-tabs"
      onChange={(event, newValue) =>
        onChange(newValue as PortfolioFilterBarTab)
      }
      value={value}
      sx={(theme) => ({
        flex: '0 0 auto',
        backgroundColor: `${(theme.vars || theme).palette.alpha100.main} !important`,
      })}
      renderContent={(value) => {
        return value === 'tokens' ? (
          <PortfolioFilterBarTokens />
        ) : (
          <PortfolioFilterBarDeFi />
        );
      }}
    />
  );
};
