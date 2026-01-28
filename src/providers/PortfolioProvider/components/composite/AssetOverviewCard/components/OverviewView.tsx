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
      >
        <EntityStack
          entities={tokenEntities}
          size={AvatarSize.LG}
          limit={MAX_DISPLAY_ASSETS_COUNT}
        />
      </OverviewColumn>
      <OverviewColumn
        hint={t('portfolio.assetOverviewCard.overview.defiPositions')}
        totalUsd={totalPositionsUsd}
      >
        <EntityStack
          entities={protocolEntities}
          size={AvatarSize.LG}
          limit={MAX_DISPLAY_ASSETS_COUNT}
        />
      </OverviewColumn>
    </OverviewContainer>
  );
};
