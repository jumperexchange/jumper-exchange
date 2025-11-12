import {
  AssetOverviewCardProps,
  AssetOverviewCardView,
} from './AssetOverviewCard.types';
import { FC, useState } from 'react';
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

export const AssetOverviewCard: FC<AssetOverviewCardProps> = (props) => {
  const { t } = useTranslation();
  const [view, setView] = useState<AssetOverviewCardView>(
    AssetOverviewCardView.Overview,
  );

  if (props.isLoading) {
    return (
      <AssetOverviewCardContainer>
        <AssetOverviewLoading />
      </AssetOverviewCardContainer>
    );
  }

  const isNoContent =
    props.tokens.length === 0 && props.defiPositions.length === 0;

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
            tokens={props.tokens}
            defiPositions={props.defiPositions}
          />
        );
      }
      case AssetOverviewCardView.Tokens: {
        return <AssetOverviewCardTokens tokens={props.tokens} />;
      }
      case AssetOverviewCardView.DeFiPositions: {
        return (
          <AssetOverviewCardDeFiPositions defiPositions={props.defiPositions} />
        );
      }
      default: {
        return null;
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
