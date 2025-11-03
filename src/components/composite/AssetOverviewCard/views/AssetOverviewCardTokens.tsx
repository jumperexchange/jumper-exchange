import { FC, useMemo } from 'react';
import { AssetOverviewCardTokensProps } from '../AssetOverviewCard.types';
import { AssetOverviewCardAssetsContainer } from '../AssetOverviewCard.styles';
import { AssetProgress } from '../../AssetProgress/AssetProgress';
import { AssetProgressVariant } from '../../AssetProgress/AssetProgress.types';
import { groupAssets, calculateAssetPercentage } from '../utils';
import {
  MAX_DISPLAY_ASSETS_COUNT,
  MAX_DISPLAY_ASSETS_COUNT_MOBILE,
} from '../constants';
import useMediaQuery from '@mui/material/useMediaQuery';

export const AssetOverviewCardTokens: FC<AssetOverviewCardTokensProps> = ({
  tokens,
}) => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const maxDisplayCount = isMobile
    ? MAX_DISPLAY_ASSETS_COUNT_MOBILE
    : MAX_DISPLAY_ASSETS_COUNT;
  const grouped = useMemo(() => groupAssets(tokens, maxDisplayCount), [tokens]);

  return (
    <AssetOverviewCardAssetsContainer>
      {grouped.displayAssets.map((token) => (
        <AssetProgress
          key={`${token.address}-${token.chain.chainId}`}
          variant={AssetProgressVariant.Token}
          token={token}
          progress={calculateAssetPercentage(
            token.totalPriceUSD,
            grouped.totalPrice,
          )}
          amount={token.totalPriceUSD}
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
