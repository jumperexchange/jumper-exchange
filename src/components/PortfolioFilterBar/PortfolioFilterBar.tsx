import type { PortfolioFilterBarTab } from 'src/app/ui/portfolio/types';
import type { HorizontalTabItem } from '../HorizontalTabs/HorizontalTabs';
import { HorizontalTabs } from '../HorizontalTabs/HorizontalTabs';
import { HorizontalTabSize } from '../HorizontalTabs/HorizontalTabs.style';
import type { FC } from 'react';
import {
  PortfolioFilterBarContainer,
  PortfolioFilterBarHeaderContainer,
} from './PortfolioFilterBar.styles';
import { PortfolioFilterBarDeFiDesktop } from './layouts/PortfolioFilterBarDeFiDesktop';
import { PortfolioFilterBarDeFiTablet } from './layouts/PortfolioFilterBarDeFiTablet';
import { PortfolioFilterBarTokensDesktop } from './layouts/PortfolioFilterBarTokensDesktop';
import { PortfolioFilterBarTokensTablet } from './layouts/PortfolioFilterBarTokensTablet';
import { PortfolioFilterBarEmptyDesktop } from './layouts/PortfolioFilterBarEmptyDesktop';
import { PortfolioFilterBarEmptyTablet } from './layouts/PortfolioFilterBarEmptyTablet';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTranslation } from 'react-i18next';
import { AnimatePresence } from 'motion/react';

export interface PortfolioFilterBarProps {
  value: PortfolioFilterBarTab;
  onChange: (value: PortfolioFilterBarTab) => void;
  isDisabled: boolean;
}

export const PortfolioFilterBar: FC<PortfolioFilterBarProps> = ({
  value,
  isDisabled,
  onChange,
}) => {
  const isTablet = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const { t } = useTranslation();
  const tabOptions: HorizontalTabItem[] = [
    {
      value: 'tokens',
      label: t('portfolio.filter.tokens'),
      disabled: isDisabled,
      'data-testid': 'portfolio-filter-tab-tokens',
    },
    {
      value: 'defi-protocols',
      label: t('portfolio.filter.defiProtocols'),
      disabled: isDisabled,
      'data-testid': 'portfolio-filter-tab-defi-protocols',
    },
  ];

  const PortfolioFilterBarContentDesktop = isDisabled
    ? PortfolioFilterBarEmptyDesktop
    : value === 'tokens'
      ? PortfolioFilterBarTokensDesktop
      : PortfolioFilterBarDeFiDesktop;

  const PortfolioFilterBarContentTablet = isDisabled
    ? PortfolioFilterBarEmptyTablet
    : value === 'tokens'
      ? PortfolioFilterBarTokensTablet
      : PortfolioFilterBarDeFiTablet;

  return (
    <PortfolioFilterBarContainer>
      <PortfolioFilterBarHeaderContainer>
        <HorizontalTabs
          tabs={tabOptions}
          size={HorizontalTabSize.MD}
          data-testid="portfolio-filter-tabs"
          onChange={(_event, newValue) =>
            onChange(newValue as PortfolioFilterBarTab)
          }
          value={value}
          sx={(theme) => ({
            flex: '0 0 auto',
            backgroundColor: `${(theme.vars || theme).palette.alpha100.main} !important`,
            ...(isDisabled && {
              '& .MuiTabs-indicator': {
                display: 'none',
              },
            }),
          })}
        />
        {isTablet && (
          <AnimatePresence mode="wait">
            <PortfolioFilterBarContentTablet key={value} />
          </AnimatePresence>
        )}
      </PortfolioFilterBarHeaderContainer>
      {!isTablet && (
        <AnimatePresence mode="wait">
          <PortfolioFilterBarContentDesktop key={value} />
        </AnimatePresence>
      )}
    </PortfolioFilterBarContainer>
  );
};
