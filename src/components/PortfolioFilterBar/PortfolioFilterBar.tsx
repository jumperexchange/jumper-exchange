'use client';

import { PortfolioFilterBarTab } from '../../app/ui/portfolio/PortfolioAssetsSection';
import { Fragment, type FC } from 'react';
import {
  PortfolioFilterBarContainer,
  PortfolioFilterBarHeaderContainer,
} from './PortfolioFilterBar.styles';
import { PortfolioFilterBarPositionsDesktop } from './layouts/PortfolioFilterBarPositionsDesktop';
import { PortfolioFilterBarPositionsTablet } from './layouts/PortfolioFilterBarPositionsTablet';
import { PortfolioFilterBarBalancesDesktop } from './layouts/PortfolioFilterBarBalancesDesktop';
import { PortfolioFilterBarBalancesTablet } from './layouts/PortfolioFilterBarBalancesTablet';
import { PortfolioFilterBarEmptyDesktop } from './layouts/PortfolioFilterBarEmptyDesktop';
import { PortfolioFilterBarEmptyTablet } from './layouts/PortfolioFilterBarEmptyTablet';
import useMediaQuery from '@mui/material/useMediaQuery';
import { AnimatePresence } from 'motion/react';
import { PortfolioFilterViewDesktop } from './layouts/PortfolioFilterViewDesktop';
import { PortfolioFilterViewTablet } from './layouts/PortfolioFilterViewTablet';
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
    : value === PortfolioFilterBarTab.TOKENS
      ? PortfolioFilterBarBalancesDesktop
      : PortfolioFilterBarPositionsDesktop;

  const PortfolioFilterBarContentTablet = isDisabled
    ? PortfolioFilterBarEmptyTablet
    : value === PortfolioFilterBarTab.TOKENS
      ? PortfolioFilterBarBalancesTablet
      : PortfolioFilterBarPositionsTablet;

  const PortfolioFilterView = isTablet
    ? PortfolioFilterViewTablet
    : PortfolioFilterViewDesktop;

  return (
    <PortfolioFilterBarContainer>
      <PortfolioFilterBarHeaderContainer>
        <PortfolioFilterView
          isDisabled={isDisabled}
          value={value}
          onChange={onChange}
        />

        <AnimatePresence mode="wait">
          {isTablet ? (
            <PortfolioFilterBarContentTablet key={value} />
          ) : (
            <PortfolioFilterBarContentDesktop key={value} />
          )}
        </AnimatePresence>
      </PortfolioFilterBarHeaderContainer>
    </PortfolioFilterBarContainer>
  );
};
