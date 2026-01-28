import type { FC } from 'react';
import Box from '@mui/material/Box';
import { AssetProgress } from '../../AssetProgress/AssetProgress';
import { AssetProgressVariant } from '../../AssetProgress/types';
import { AssetsContainer } from '../AssetOverviewCard.styles';
import type { AssetOverviewCardPositionsProps } from '../types';
import { useAssetOverflow } from '../hooks';

export const PositionsView: FC<AssetOverviewCardPositionsProps> = ({
  protocolSummaries,
}) => {
  const {
    containerRef,
    getItemRef,
    overflowIndicatorRef,
    isReady,
    totalPrice,
    overflowInfo,
    getItemSx,
  } = useAssetOverflow({ items: protocolSummaries });

  return (
    <AssetsContainer ref={containerRef} sx={{ opacity: isReady ? 1 : 0 }}>
      {protocolSummaries.map((summary, index) => (
        <Box
          key={summary.protocol.name}
          ref={getItemRef(index)}
          sx={getItemSx(index)}
        >
          <AssetProgress
            variant={AssetProgressVariant.Entity}
            entity={summary.protocol}
            progress={
              totalPrice > 0 ? (summary.totalUsd / totalPrice) * 100 : 0
            }
            amount={summary.totalUsd}
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
    </AssetsContainer>
  );
};
