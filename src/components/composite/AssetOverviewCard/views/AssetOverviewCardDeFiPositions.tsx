import { FC, useMemo } from 'react';
import { AssetOverviewCardDeFiPositionsProps } from '../AssetOverviewCard.types';
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
> = ({ defiPositions }) => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const maxDisplayCount = isMobile
    ? MAX_DISPLAY_ASSETS_COUNT_MOBILE
    : MAX_DISPLAY_ASSETS_COUNT;
  const grouped = useMemo(
    () => groupAssets(defiPositions, maxDisplayCount),
    [defiPositions],
  );

  return (
    <AssetOverviewCardAssetsContainer>
      {grouped.displayAssets.map((protocol) => (
        <AssetProgress
          key={`${protocol.name}-${protocol.product}`}
          variant={AssetProgressVariant.Protocol}
          protocol={protocol}
          progress={calculateAssetPercentage(
            protocol.totalPriceUSD,
            grouped.totalPrice,
          )}
          amount={protocol.totalPriceUSD}
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
