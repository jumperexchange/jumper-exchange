import type { AssetOverviewCardProps } from './AssetOverviewCard.types';
import { AssetOverviewCardView } from './AssetOverviewCard.types';
import type { FC } from 'react';
import { useMemo, useState } from 'react';
import {
  AssetOverviewCardContentContainer,
  AssetOverviewCardContainer,
  AssetOverviewNavigationButton,
  AssetOverviewNavigationContainer,
} from './AssetOverviewCard.styles';
import { useTranslation } from 'react-i18next';
import { AssetOverviewCardOverview } from './views/AssetOverviewCardOverview';
import { AssetOverviewCardTokens } from './views/AssetOverviewCardTokens';
import { AssetOverviewCardDeFiPositions } from './views/AssetOverviewCardDeFiPositions';
import { AssetOverviewNoContent } from './views/AssetOverviewNoContent';
import { AssetOverviewLoading } from './views/AssetOverviewLoading';

export const AssetOverviewCard: FC<AssetOverviewCardProps> = ({
  tokens,
  tokensTotalValueUSD,
  positionsTotalValueUSD,
  positions,
  isLoading,
  showNoContent = true,
}) => {
  const { t } = useTranslation();
  const [view, setView] = useState<AssetOverviewCardView>(
    AssetOverviewCardView.Overview,
  );

  if (isLoading) {
    return (
      <AssetOverviewCardContainer>
        <AssetOverviewLoading />
      </AssetOverviewCardContainer>
    );
  }

  const isNoContent =
    showNoContent && tokens.length === 0 && positions.length === 0;

  if (isNoContent) {
    return (
      <AssetOverviewCardContainer>
        <AssetOverviewCardContentContainer>
          <AssetOverviewNoContent />
        </AssetOverviewCardContentContainer>
      </AssetOverviewCardContainer>
    );
  }

  const renderView = () => {
    switch (view) {
      case AssetOverviewCardView.Overview: {
        return (
          <AssetOverviewCardOverview
            tokens={tokens}
            tokensTotalValueUSD={tokensTotalValueUSD}
            positions={positions}
            positionsTotalValueUSD={positionsTotalValueUSD}
          />
        );
      }
      case AssetOverviewCardView.Tokens: {
        return (
          <AssetOverviewCardTokens
            tokens={tokens}
            totalValueUSD={tokensTotalValueUSD}
          />
        );
      }
      case AssetOverviewCardView.DeFiPositions: {
        return (
          <AssetOverviewCardDeFiPositions
            positions={positions}
            totalValueUSD={positionsTotalValueUSD}
          />
        );
      }
      default: {
        return null;
      }
    }
  };

  const isNavigationButtonDisabled = (_view: AssetOverviewCardView) => {
    switch (_view) {
      case AssetOverviewCardView.Overview: {
        return false;
      }
      case AssetOverviewCardView.Tokens: {
        return tokens.length === 0;
      }
      case AssetOverviewCardView.DeFiPositions: {
        return positions.length === 0;
      }
      default: {
        return false;
      }
    }
  };

  return (
    <AssetOverviewCardContainer>
      <AssetOverviewNavigationContainer>
        {Object.values(AssetOverviewCardView).map((_view) => (
          <AssetOverviewNavigationButton
            key={_view}
            data-testid={`asset-overview-nav-${_view}`}
            onClick={() => setView(_view)}
            isActive={_view === view}
            disabled={isNavigationButtonDisabled(_view)}
          >
            {t(`portfolio.assetOverviewCard.navigation.${_view}`)}
          </AssetOverviewNavigationButton>
        ))}
      </AssetOverviewNavigationContainer>
      <AssetOverviewCardContentContainer>
        {renderView()}
      </AssetOverviewCardContentContainer>
    </AssetOverviewCardContainer>
  );
};
