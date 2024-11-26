// WidgetImageSSR.tsx

import type { ExtendedChain, Token } from '@lifi/sdk';
import type { CSSProperties } from 'react';
import AmountField from './Fields/AmountField';
import TokenField from './Fields/TokenField';
import type { HighlightedAreas, ImageTheme } from './ImageGeneration.types';
import {
  contentContainerStyles,
  contentPositioningStyles,
  pageStyles,
} from './style';

const SCALING_FACTOR = 2;

interface WidgetImageSSRProps {
  fromChain?: ExtendedChain | null;
  toChain?: ExtendedChain | null;
  fromToken?: Token | null;
  toToken?: Token | null;
  amount?: string | null;
  amountUSD?: string | null;
  width: number;
  height: number;
  theme?: ImageTheme | null;
  highlighted?: HighlightedAreas;
}

const WidgetSelectionSSR = ({
  fromChain,
  toChain,
  fromToken,
  toToken,
  amount,
  amountUSD,
  width,
  height,
  theme,
  highlighted,
}: WidgetImageSSRProps) => {
  const contentContainerStyle = contentContainerStyles({
    height,
    width,
    scalingFactor: SCALING_FACTOR,
  }) as CSSProperties;

  const contentPositioningStyle = contentPositioningStyles() as CSSProperties;
  const pageStyle = pageStyles() as CSSProperties;

  return (
    <div style={contentPositioningStyle}>
      <div
        style={{
          ...contentContainerStyle,
          // marginTop: 64,
        }}
      >
        <div
          style={{
            ...pageStyle,
            alignItems: 'center',
          }}
        >
          <TokenField
            chain={fromChain}
            token={fromToken}
            fullWidth={true}
            theme={theme || undefined}
            highlighted={highlighted === 'from'}
            sx={{ marginTop: 64 }}
          />
          <TokenField
            chain={toChain}
            token={toToken}
            fullWidth={true}
            theme={theme || undefined}
            sx={{ marginTop: '16px' }}
            highlighted={highlighted === 'to'}
          />
          <AmountField
            chain={fromChain}
            token={fromToken}
            theme={theme || undefined}
            amount={amount ? parseFloat(amount) : undefined}
            // amountUSD={amountUSD ? parseFloat(amountUSD) : undefined}
            fullWidth={true}
            highlighted={highlighted === 'amount'}
          />
        </div>
      </div>
    </div>
  );
};

export default WidgetSelectionSSR;
