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

export const AssetOverviewCardOverview: FC<AssetOverviewCardOverviewProps> = ({
  tokens,
  protocolGroups,
}) => {
  const { t } = useTranslation();
  const tokensOverallPriceInUSD = calculateTotalPrice(tokens);
  const defiPositionsOverallPriceInUSD = calculateTotalPrice(protocolGroups);

  const defiPositionsProtocols = useMemo(
    () => protocolGroups.map((group) => group.protocol),
    [protocolGroups],
  );

  return (
    <AssetOverviewCardOverviewContainer>
      <OverviewCardColumn
        hint={t('portfolio.assetOverviewCard.overview.tokens')}
        totalPrice={tokensOverallPriceInUSD}
      >
        <TokenStack
          tokens={tokens}
          size={AvatarSize.LG}
          limit={MAX_DISPLAY_ASSETS_COUNT}
        />
      </OverviewCardColumn>
      <OverviewCardColumn
        hint={t('portfolio.assetOverviewCard.overview.defiPositions')}
        totalPrice={defiPositionsOverallPriceInUSD}
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
