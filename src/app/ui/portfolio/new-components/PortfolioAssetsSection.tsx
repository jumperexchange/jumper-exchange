'use client';
import { SectionCard } from '@/components/Cards/SectionCard/SectionCard';
import {
  TokensFilteringProvider,
  useTokensFiltering,
} from '@/providers/PortfolioProvider/filtering/TokensFilteringContext';
import { PortfolioFilterBar } from './PortfolioFilterBar/PortfolioFilterBar';
import { useState } from 'react';
import { PortfolioFilterBarTab } from '../types';
import { PortfolioDeFiProtocolsList } from './PortfolioDeFiProtocolsList';
import { PortfolioTokensList } from './PortfolioTokensList';
import {
  DeFiPositionsFilteringProvider,
  useDeFiPositionsFiltering,
} from '@/providers/PortfolioProvider/filtering/DeFiPositionsFilteringContext';
import { useAccount } from '@lifi/wallet-management';

const PortfolioAssetsSectionInner = () => {
  const [tab, setTab] = useState<PortfolioFilterBarTab>(
    PortfolioFilterBarTab.TOKENS,
  );
  const { isEmpty: isTokensEmpty, isLoading: isTokensLoading } =
    useTokensFiltering();
  const { isAllDataEmpty: isDeFiEmpty, isLoading: isDeFiLoading } =
    useDeFiPositionsFiltering();
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
    <TokensFilteringProvider>
      <DeFiPositionsFilteringProvider>
        <PortfolioAssetsSectionInner />
      </DeFiPositionsFilteringProvider>
    </TokensFilteringProvider>
  );
};
