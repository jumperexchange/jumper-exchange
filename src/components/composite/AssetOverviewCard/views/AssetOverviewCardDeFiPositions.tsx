import type { FC } from 'react';
import { useMemo } from 'react';
import type { AssetOverviewCardDeFiPositionsProps } from '../AssetOverviewCard.types';
import { AssetOverviewCardAssetsContainer } from '../AssetOverviewCard.styles';
import { AssetProgress } from '../../AssetProgress/AssetProgress';
import { AssetProgressVariant } from '../../AssetProgress/AssetProgress.types';
import { groupAssets, calculateAssetPercentage } from '../utils';
import {
  MAX_DISPLAY_ASSETS_COUNT,
  MAX_DISPLAY_ASSETS_COUNT_MOBILE,
} from '../constants';
import useMediaQuery from '@mui/material/useMediaQuery';

export const AssetOverviewCardDeFiPositions: FC<
  AssetOverviewCardDeFiPositionsProps
> = ({ protocolGroups }) => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const maxDisplayCount = isMobile
    ? MAX_DISPLAY_ASSETS_COUNT_MOBILE
    : MAX_DISPLAY_ASSETS_COUNT;

  const grouped = useMemo(
    () => groupAssets(protocolGroups, maxDisplayCount),
    [protocolGroups, maxDisplayCount],
  );

  return (
    <AssetOverviewCardAssetsContainer>
      {grouped.displayAssets.map((protocolGroup) => (
        <AssetProgress
          key={protocolGroup.protocol.name}
          variant={AssetProgressVariant.Protocol}
          protocol={protocolGroup.protocol}
          progress={calculateAssetPercentage(
            protocolGroup.totalPriceUSD,
            grouped.totalPrice,
          )}
          amount={protocolGroup.totalPriceUSD}
        />
      ))}
      {grouped.overflow && (
        <AssetProgress
          variant={AssetProgressVariant.Text}
          text={`+${grouped.overflow.count}`}
          progress={grouped.overflow.percentage}
          amount={grouped.overflow.price}
        />
      )}
    </AssetOverviewCardAssetsContainer>
  );
};
