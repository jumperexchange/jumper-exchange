import { PortfolioFilterBarTab } from 'src/app/ui/portfolio/types';
import {
  HorizontalTabItem,
  HorizontalTabs,
} from '../HorizontalTabs/HorizontalTabs';
import { HorizontalTabSize } from '../HorizontalTabs/HorizontalTabs.style';
import { FC } from 'react';
import {
  PortfolioFilterBarContainer,
  PortfolioFilterBarHeaderContainer,
} from './PortfolioFilterBar.styles';
import { PortfolioFilterBarDeFiDesktop } from './layouts/PortfolioFilterBarDeFiDesktop';
import { PortfolioFilterBarDeFiTablet } from './layouts/PortfolioFilterBarDeFiTablet';
import { PortfolioFilterBarTokensDesktop } from './layouts/PortfolioFilterBarTokensDesktop';
import { PortfolioFilterBarTokensTablet } from './layouts/PortfolioFilterBarTokensTablet';
import useMediaQuery from '@mui/material/useMediaQuery';

export interface PortfolioFilterBarProps {
  value: PortfolioFilterBarTab;
  onChange: (value: PortfolioFilterBarTab) => void;
}

export const PortfolioFilterBar: FC<PortfolioFilterBarProps> = ({
  value,
  onChange,
}) => {
  const isTablet = useMediaQuery((theme) => theme.breakpoints.down('md'));
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

  const PortfolioFilterBarContentDesktop =
    value === 'tokens'
      ? PortfolioFilterBarTokensDesktop
      : PortfolioFilterBarDeFiDesktop;

  const PortfolioFilterBarContentTablet =
    value === 'tokens'
      ? PortfolioFilterBarTokensTablet
      : PortfolioFilterBarDeFiTablet;

  return (
    <PortfolioFilterBarContainer>
      <PortfolioFilterBarHeaderContainer>
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
        />
        {isTablet && <PortfolioFilterBarContentTablet />}
      </PortfolioFilterBarHeaderContainer>
      {!isTablet && <PortfolioFilterBarContentDesktop />}
    </PortfolioFilterBarContainer>
  );
};
