'use client';
import { SectionCard } from 'src/components/Cards/SectionCard/SectionCard';
import {
  PortfolioTokensFilteringProvider,
  usePortfolioTokensFiltering,
} from './PortfolioTokensFilteringContext';
import { PortfolioFilterBar } from 'src/components/PortfolioFilterBar/PortfolioFilterBar';
import { useState } from 'react';
import { PortfolioFilterBarTab } from './types';
import { PortfolioDeFiProtocolsList } from './PortfolioDeFiProtocolsList';
import { PortfolioTokensList } from './PortfolioTokensList';
import {
  PortfolioDeFiPositionsFilteringProvider,
  usePortfolioDeFiPositionsFiltering,
} from './PortfolioDeFiPositionsFilteringContext';
import { useAccount } from '@lifi/wallet-management';

const PortfolioAssetsSectionInner = () => {
  const [tab, setTab] = useState<PortfolioFilterBarTab>(
    PortfolioFilterBarTab.TOKENS,
  );
  const { isEmpty: isTokensEmpty } = usePortfolioTokensFiltering();
  const { isAllDataEmpty: isDeFiEmpty } = usePortfolioDeFiPositionsFiltering();
  const { account } = useAccount();
  const isDisconnected = !account.isConnected;
  const isEmpty = isTokensEmpty && isDeFiEmpty;
  const isDisabled = isDisconnected || isEmpty;
  return (
    <SectionCard>
      <PortfolioFilterBar
        isDisabled={isDisabled}
        value={tab}
        onChange={setTab}
      />
      {!isDisabled &&
        (tab === 'tokens' ? (
          <PortfolioTokensList />
        ) : (
          <PortfolioDeFiProtocolsList />
        ))}
    </SectionCard>
  );
};

export const PortfolioAssetsSection = () => {
  return (
    <PortfolioTokensFilteringProvider>
      <PortfolioDeFiPositionsFilteringProvider>
        <PortfolioAssetsSectionInner />
      </PortfolioDeFiPositionsFilteringProvider>
    </PortfolioTokensFilteringProvider>
  );
};
