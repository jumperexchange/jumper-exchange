import type { FC } from 'react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  CardContainer,
  ContentContainer,
  NavigationButton,
  NavigationContainer,
} from './AssetOverviewCard.styles';
import { OverviewView } from './components/OverviewView';
import { TokensView } from './components/TokensView';
import { PositionsView } from './components/PositionsView';
import { LoadingView } from './components/LoadingView';
import { NoContentView } from './components/NoContentView';
import type { AssetOverviewCardProps } from './types';
import { AssetOverviewCardView } from './types';
import { getSortedTokenSummaries, getSortedProtocolSummaries } from './utils';

export const AssetOverviewCard: FC<AssetOverviewCardProps> = ({
  summaryData,
  isLoading,
  showNoContent = true,
}) => {
  const { t } = useTranslation();
  const [view, setView] = useState<AssetOverviewCardView>(
    AssetOverviewCardView.Overview,
  );

  const tokenSummaries = useMemo(
    () => getSortedTokenSummaries(summaryData),
    [summaryData],
  );

  const protocolSummaries = useMemo(
    () => getSortedProtocolSummaries(summaryData),
    [summaryData],
  );

  if (isLoading) {
    return (
      <CardContainer>
        <LoadingView />
      </CardContainer>
    );
  }

  const isEmpty =
    showNoContent &&
    tokenSummaries.length === 0 &&
    protocolSummaries.length === 0;

  if (isEmpty) {
    return (
      <CardContainer>
        <ContentContainer>
          <NoContentView />
        </ContentContainer>
      </CardContainer>
    );
  }

  const isNavigationButtonDisabled = (_view: AssetOverviewCardView) => {
    switch (_view) {
      case AssetOverviewCardView.Overview:
        return false;
      case AssetOverviewCardView.Tokens:
        return tokenSummaries.length === 0;
      case AssetOverviewCardView.DeFiPositions:
        return protocolSummaries.length === 0;
      default:
        return false;
    }
  };

  const renderView = () => {
    switch (view) {
      case AssetOverviewCardView.Overview:
        return (
          <OverviewView
            tokenSummaries={tokenSummaries}
            protocolSummaries={protocolSummaries}
            totalBalancesUsd={summaryData.totalBalancesUsd}
            totalPositionsUsd={summaryData.totalPositionsUsd}
          />
        );
      case AssetOverviewCardView.Tokens:
        return <TokensView tokenSummaries={tokenSummaries} />;
      case AssetOverviewCardView.DeFiPositions:
        return <PositionsView protocolSummaries={protocolSummaries} />;
      default:
        return null;
    }
  };

  return (
    <CardContainer>
      <NavigationContainer>
        {Object.values(AssetOverviewCardView).map((_view) => (
          <NavigationButton
            key={_view}
            data-testid={`asset-overview-nav-${_view}`}
            onClick={() => setView(_view)}
            isActive={_view === view}
            disabled={isNavigationButtonDisabled(_view)}
          >
            {t(`portfolio.assetOverviewCard.navigation.${_view}`)}
          </NavigationButton>
        ))}
      </NavigationContainer>
      <ContentContainer>{renderView()}</ContentContainer>
    </CardContainer>
  );
};
