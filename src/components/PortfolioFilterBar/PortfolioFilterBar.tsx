'use client';

import { PortfolioFilterBarTab } from '../../app/ui/portfolio/PortfolioAssetsSection';
import { Fragment, type FC } from 'react';
import {
  PortfolioFilterBarContainer,
  PortfolioFilterBarHeaderContainer,
} from './PortfolioFilterBar.styles';
import { PortfolioFilterBarPositions } from './layouts/PortfolioFilterBarPositions';
import { PortfolioFilterBarBalances } from './layouts/PortfolioFilterBarBalances';
import { PortfolioFilterBarEmpty } from './layouts/PortfolioFilterBarEmpty';
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

  const PortfolioFilterBarContent = isDisabled
    ? PortfolioFilterBarEmpty
    : value === PortfolioFilterBarTab.TOKENS
      ? PortfolioFilterBarBalances
      : PortfolioFilterBarPositions;

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
          <PortfolioFilterBarContent key={value} />
        </AnimatePresence>
      </PortfolioFilterBarHeaderContainer>
    </PortfolioFilterBarContainer>
  );
};
