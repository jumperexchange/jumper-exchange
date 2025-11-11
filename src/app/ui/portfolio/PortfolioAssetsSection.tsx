'use client';
import { SectionCard } from 'src/components/Cards/SectionCard/SectionCard';
import { PortfolioTokensFilteringProvider } from './PortfolioTokensFilteringContext';
import { PortfolioFilterBar } from 'src/components/PortfolioFilterBar/PortfolioFilterBar';
import { useState } from 'react';
import { PortfolioFilterBarTab } from './types';
import { PortfolioDeFiProtocolsList } from './PortfolioDeFiProtocolsList';
import { PortfolioTokensList } from './PortfolioTokensList';

const PortfolioAssetsSectionInner = () => {
  const [tab, setTab] = useState<PortfolioFilterBarTab>('tokens');
  return (
    <SectionCard>
      <PortfolioFilterBar value={tab} onChange={setTab} />
      {tab === 'tokens' ? (
        <PortfolioTokensList />
      ) : (
        <PortfolioDeFiProtocolsList />
      )}
    </SectionCard>
  );
};

export const PortfolioAssetsSection = () => {
  return (
    <PortfolioTokensFilteringProvider>
      <PortfolioAssetsSectionInner />
    </PortfolioTokensFilteringProvider>
  );
};
