import type { FC } from 'react';
import Box from '@mui/material/Box';
import type { AssetOverviewCardDeFiPositionsProps } from '../AssetOverviewCard.types';
import { AssetOverviewCardAssetsContainer } from '../AssetOverviewCard.styles';
import { AssetProgress } from '../../AssetProgress/AssetProgress';
import { AssetProgressVariant } from '../../AssetProgress/AssetProgress.types';
import { calculateAssetPercentage } from '../utils';
import { useAssetOverflow } from '../hooks';

export const AssetOverviewCardDeFiPositions: FC<
  AssetOverviewCardDeFiPositionsProps
> = ({ positions, totalValueUSD }) => {
  const {
    containerRef,
    getItemRef,
    overflowIndicatorRef,
    isReady,
    overflowInfo,
    getItemSx,
  } = useAssetOverflow({
    items: positions,
    overallTotalValueUSD: totalValueUSD,
  });

  return (
    <AssetOverviewCardAssetsContainer
      ref={containerRef}
      sx={{ opacity: isReady ? 1 : 0 }}
    >
      {positions.map((protocolGroup, index) => (
        <Box
          key={protocolGroup.protocol.name}
          ref={getItemRef(index)}
          sx={getItemSx(index)}
        >
          <AssetProgress
            variant={AssetProgressVariant.Protocol}
            protocol={protocolGroup.protocol}
            progress={protocolGroup.percentageOfTotalValueUSD}
            amount={protocolGroup.totalValueUSD}
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
