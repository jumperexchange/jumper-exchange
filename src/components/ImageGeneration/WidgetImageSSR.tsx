// WidgetImageSSR.tsx

import type { ExtendedChain, Token } from '@lifi/sdk';
import WidgetFieldSSR from './Field';
import type { HighlightedAreas, ImageTheme } from './ImageGeneration.types';

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

const WidgetImageSSR = ({
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
  return (
    <div
      style={{
        display: 'flex',
        height,
        width,
        transform: `scale(${SCALING_FACTOR})`,
        transformOrigin: 'top left',
        position: 'relative',
      }}
    >
      <div
        style={{
          display: 'flex',
          position: 'absolute',
          marginTop: 64,
          left: 0,
          top: 0,
        }}
      >
        <div
          style={{
            display: 'flex',
            // justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'center',
            margin: '0 24px',
          }}
        >
          <WidgetFieldSSR
            type={'token'}
            chain={fromChain}
            token={fromToken}
            fullWidth={true}
            theme={theme || undefined}
            highlighted={highlighted === 'from'}
          />
          <WidgetFieldSSR
            type={'token'}
            chain={toChain}
            token={toToken}
            fullWidth={true}
            theme={theme || undefined}
            sx={{ marginTop: '16px' }}
            highlighted={highlighted === 'to'}
          />
          <WidgetFieldSSR
            type={'amount-selection'}
            chain={fromChain}
            token={fromToken}
            theme={theme || undefined}
            amount={amount ? parseFloat(amount) : undefined}
            amountUSD={amountUSD ? parseFloat(amountUSD) : undefined}
            fullWidth={true}
            sx={{ marginTop: '16px' }}
            highlighted={highlighted === 'amount'}
          />
        </div>
      </div>
    </div>
  );
};

export default WidgetImageSSR;
