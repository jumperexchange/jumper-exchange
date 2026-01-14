import type { FC } from 'react';
import Box from '@mui/material/Box';
import type { AssetOverviewCardTokensProps } from '../AssetOverviewCard.types';
import { AssetOverviewCardAssetsContainer } from '../AssetOverviewCard.styles';
import { AssetProgress } from '../../AssetProgress/AssetProgress';
import { AssetProgressVariant } from '../../AssetProgress/AssetProgress.types';
import { calculateAssetPercentage } from '../utils';
import { useAssetOverflow } from '../hooks';

export const AssetOverviewCardTokens: FC<AssetOverviewCardTokensProps> = ({
  tokens,
  totalValueUSD,
}) => {
  const {
    containerRef,
    getItemRef,
    overflowIndicatorRef,
    isReady,
    overflowInfo,
    getItemSx,
  } = useAssetOverflow({
    items: tokens,
    overallTotalValueUSD: totalValueUSD,
  });

  return (
    <AssetOverviewCardAssetsContainer
      ref={containerRef}
      sx={{ opacity: isReady ? 1 : 0 }}
    >
      {tokens.map((token, index) => (
        <Box
          key={`${token.address}-${token.chain.chainId}`}
          ref={getItemRef(index)}
          sx={getItemSx(index)}
        >
          <AssetProgress
            variant={AssetProgressVariant.Token}
            token={token}
            progress={token.percentageOfTotalValueUSD}
            amount={token.totalValueUSD}
          />
        </Box>
      ))}
      <Box
        ref={overflowIndicatorRef}
        sx={{
          visibility: overflowInfo ? 'visible' : 'hidden',
          position: overflowInfo ? 'relative' : 'absolute',
          pointerEvents: overflowInfo ? 'auto' : 'none',
        }}
      >
        <AssetProgress
          variant={AssetProgressVariant.Text}
          text={`+${overflowInfo?.count ?? 0}`}
          progress={overflowInfo?.percentage ?? 0}
          amount={overflowInfo?.price ?? 0}
        />
      </Box>
    </AssetOverviewCardAssetsContainer>
  );
};
