import { AssetOverviewCardOverviewContainer } from '../AssetOverviewCard.styles';
import type { FC } from 'react';
import { useMemo } from 'react';
import type { AssetOverviewCardOverviewProps } from '../AssetOverviewCard.types';
import { TokenStack } from '@/components/composite/TokenStack/TokenStack';
import { ProtocolStack } from '@/components/composite/ProtocolStack/ProtocolStack';
import { AvatarSize } from '@/components/core/AvatarStack/AvatarStack.types';
import { OverviewCardColumn } from '../components/OverviewCardColumn';
import { MAX_DISPLAY_ASSETS_COUNT } from '../constants';
import { useTranslation } from 'react-i18next';
import { toTokenStackTokens } from '@/components/composite/TokenStack/utils';
import { map } from 'lodash';

export const AssetOverviewCardOverview: FC<AssetOverviewCardOverviewProps> = ({
  tokens,
  tokensTotalValueUSD,
  positions,
  positionsTotalValueUSD,
}) => {
  const { t } = useTranslation();
  return (
    <AssetOverviewCardOverviewContainer>
      <OverviewCardColumn
        hint={t('portfolio.assetOverviewCard.overview.tokens')}
        totalPrice={tokensTotalValueUSD}
      >
        <TokenStack
          tokens={toTokenStackTokens(tokens)}
          size={AvatarSize.LG}
          limit={MAX_DISPLAY_ASSETS_COUNT}
        />
      </OverviewCardColumn>
      <OverviewCardColumn
        hint={t('portfolio.assetOverviewCard.overview.defiPositions')}
        totalPrice={positionsTotalValueUSD}
      >
        <ProtocolStack
          protocols={map(positions, 'protocol')}
          size={AvatarSize.LG}
          limit={MAX_DISPLAY_ASSETS_COUNT}
        />
      </OverviewCardColumn>
    </AssetOverviewCardOverviewContainer>
  );
};
