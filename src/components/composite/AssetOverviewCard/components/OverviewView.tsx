import type { FC } from 'react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { EntityStack } from '../../EntityStack/EntityStack';
import { AvatarSize } from '@/components/core/AvatarStack/AvatarStack.types';
import { OverviewContainer } from '../AssetOverviewCard.styles';
import { OverviewColumn } from './OverviewColumn';
import { MAX_DISPLAY_ASSETS_COUNT } from '../constants';
import type { AssetOverviewCardOverviewProps } from '../types';

export const OverviewView: FC<AssetOverviewCardOverviewProps> = ({
  tokenSummaries,
  protocolSummaries,
  totalBalancesUsd,
  totalPositionsUsd,
}) => {
  const { t } = useTranslation();

  const tokenEntities = useMemo(
    () => tokenSummaries.map((s) => s.token),
    [tokenSummaries],
  );

  const protocolEntities = useMemo(
    () => protocolSummaries.map((p) => p.protocol),
    [protocolSummaries],
  );

  return (
    <OverviewContainer>
      <OverviewColumn
        hint={t('portfolio.assetOverviewCard.overview.tokens')}
        totalUsd={totalBalancesUsd}
        dataTestId="asset-overview-card-tokens"
      >
        <EntityStack
          entities={tokenEntities}
          size={AvatarSize.LG}
          limit={MAX_DISPLAY_ASSETS_COUNT}
          direction="row-reverse"
        />
      </OverviewColumn>
      <OverviewColumn
        hint={t('portfolio.assetOverviewCard.overview.defiPositions')}
        totalUsd={totalPositionsUsd}
        dataTestId="asset-overview-card-defi-positions"
      >
        <EntityStack
          entities={protocolEntities}
          size={AvatarSize.LG}
          limit={MAX_DISPLAY_ASSETS_COUNT}
          direction="row-reverse"
        />
      </OverviewColumn>
    </OverviewContainer>
  );
};
