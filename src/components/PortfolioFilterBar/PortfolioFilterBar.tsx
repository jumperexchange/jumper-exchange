'use client';

import { PortfolioViewBarTab } from '../../app/ui/portfolio/PortfolioContentSection';
import { type FC } from 'react';
import {
  PortfolioFilterBarContainer,
  PortfolioFilterBarHeaderContainer,
} from './PortfolioFilterBar.styles';
import { PortfolioFilterBarHoldings } from './layouts/PortfolioFilterBarHoldings';
import { PortfolioFilterBarEmpty } from './layouts/PortfolioFilterBarEmpty';
import useMediaQuery from '@mui/material/useMediaQuery';
import { AnimatePresence } from 'motion/react';
import { PortfolioFilterViewDesktop } from './layouts/PortfolioFilterViewDesktop';
import { PortfolioFilterViewTablet } from './layouts/PortfolioFilterViewTablet';

export interface PortfolioFilterBarProps {
  value: PortfolioViewBarTab;
  onChange: (value: PortfolioViewBarTab) => void;
  isDisabled: boolean;
}

export const PortfolioFilterBar: FC<PortfolioFilterBarProps> = ({
  value,
  isDisabled,
  onChange,
}) => {
  const isTablet = useMediaQuery((theme) => theme.breakpoints.down('md'));

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
          {isDisabled ? (
            <PortfolioFilterBarEmpty key="empty" />
          ) : value === PortfolioViewBarTab.HOLDINGS ? (
            <PortfolioFilterBarHoldings key="holdings" />
          ) : null}
        </AnimatePresence>
      </PortfolioFilterBarHeaderContainer>
    </PortfolioFilterBarContainer>
  );
};
