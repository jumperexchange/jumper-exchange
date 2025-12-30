import type { PortfolioFilterBarTab } from 'src/app/ui/portfolio/types';
import { Fragment, type FC } from 'react';
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
import { AnimatePresence } from 'motion/react';
import { PortfolioSortTokensDesktop } from './layouts/PortfolioSortTokensDesktop';
import { PortfolioSortEmptyDesktop } from './layouts/PortfolioSortEmptyDesktop';
import { PortfolioSortDeFiDesktop } from './layouts/PortfolioSortDeFiDesktop';
import { PortfolioFilterViewDesktop } from './layouts/PortfolioFilterViewDesktop';
import { PortfolioFilterViewTablet } from './layouts/PortfolioFilterViewTablet';
import { PortfolioFilterBarTokensLastUpdatedBadge } from './layouts/PortfolioFilterBarTokensLastUpdatedBadge';
import { PortfolioFilterBarDeFiLastUpdatedBadge } from './layouts/PortfolioFilterBarDeFiLastUpdatedBadge';

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

  const PortfolioSortDesktop = isDisabled
    ? PortfolioSortEmptyDesktop
    : value === 'tokens'
      ? PortfolioSortTokensDesktop
      : PortfolioSortDeFiDesktop;

  const PortfolioFilterView = isTablet
    ? PortfolioFilterViewTablet
    : PortfolioFilterViewDesktop;

  const PortfolioFilterBarLastUpdatedBadge = isDisabled
    ? Fragment
    : value === 'tokens'
      ? PortfolioFilterBarTokensLastUpdatedBadge
      : PortfolioFilterBarDeFiLastUpdatedBadge;

  return (
    <PortfolioFilterBarContainer>
      <PortfolioFilterBarHeaderContainer>
        <PortfolioFilterView
          isDisabled={isDisabled}
          value={value}
          onChange={onChange}
        />
        {!isTablet && <PortfolioFilterBarLastUpdatedBadge />}
        {isTablet && (
          <AnimatePresence mode="wait">
            <PortfolioFilterBarContentTablet key={value} />
          </AnimatePresence>
        )}
      </PortfolioFilterBarHeaderContainer>
      {!isTablet && (
        <AnimatePresence mode="wait">
          <PortfolioFilterBarContentDesktop key={value}>
            <PortfolioSortDesktop />
          </PortfolioFilterBarContentDesktop>
        </AnimatePresence>
      )}
    </PortfolioFilterBarContainer>
  );
};
