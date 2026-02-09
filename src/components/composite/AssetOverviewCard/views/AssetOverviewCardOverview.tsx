import { AssetOverviewCardOverviewContainer } from '../AssetOverviewCard.styles';
import type { FC } from 'react';
import { useMemo } from 'react';
import type { AssetOverviewCardOverviewProps } from '../AssetOverviewCard.types';
import { TokenStack } from '../../TokenStack/TokenStack';
import { ProtocolStack } from '../../ProtocolStack/ProtocolStack';
import { AvatarSize } from 'src/components/core/AvatarStack/AvatarStack.types';
import { calculateTotalPrice } from '../utils';
import { OverviewCardColumn } from '../components/OverviewCardColumn';
import { MAX_DISPLAY_ASSETS_COUNT } from '../constants';
import { useTranslation } from 'react-i18next';
import { toTokenStackTokens } from '../../TokenStack/utils';

export const AssetOverviewCardOverview: FC<AssetOverviewCardOverviewProps> = ({
  tokens,
  protocolGroups,
}) => {
  const { t } = useTranslation();
  const tokensOverallPriceInUSD = useMemo(
    () => calculateTotalPrice(tokens),
    [tokens],
  );
  const defiPositionsOverallPriceInUSD = useMemo(
    () => calculateTotalPrice(protocolGroups),
    [protocolGroups],
  );

  const defiPositionsProtocols = useMemo(
    () => protocolGroups.map((group) => group.protocol),
    [protocolGroups],
  );

  return (
    <AssetOverviewCardOverviewContainer>
      <OverviewCardColumn
        hint={t('portfolio.assetOverviewCard.overview.tokens')}
        totalPrice={tokensOverallPriceInUSD}
        data-testid="portfolio-overview-tokens-value"
      >
        <TokenStack
          tokens={toTokenStackTokens(tokens)}
          size={AvatarSize.LG}
          limit={MAX_DISPLAY_ASSETS_COUNT}
        />
      </OverviewCardColumn>
      <OverviewCardColumn
        hint={t('portfolio.assetOverviewCard.overview.defiPositions')}
        totalPrice={defiPositionsOverallPriceInUSD}
        data-testid="portfolio-overview-defi-positions-value"
      >
        <ProtocolStack
          protocols={defiPositionsProtocols}
          size={AvatarSize.LG}
          limit={MAX_DISPLAY_ASSETS_COUNT}
        />
      </OverviewCardColumn>
    </AssetOverviewCardOverviewContainer>
  );
};
