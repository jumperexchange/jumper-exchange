import type { ExtendedChain, Token } from '@lifi/sdk';
import type { HighlightedAreas } from './Client/WidgetImage';
import WidgetFieldSSR from './WidgetImageFieldSSR';

const SCALING_FACTOR = 2;

interface WidgetReviewSSRProps {
  fromChain?: ExtendedChain | null;
  toChain?: ExtendedChain | null;
  fromToken?: Token | null;
  toToken?: Token | null;
  routeAmount?: number | null;
  amount?: string | null;
  amountUSD?: string | null;
  width: number;
  height: number;
  highlighted?: HighlightedAreas;
}

const WidgetReviewSSR = ({
  fromChain,
  toChain,
  fromToken,
  toToken,
  amount,
  amountUSD,
  routeAmount,
  width,
  height,
  highlighted,
}: WidgetReviewSSRProps) => {
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
        {
          // pages container -->
        }
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
            type={'review'}
            chain={fromChain}
            token={fromToken}
            amount={amount ? parseFloat(amount) : null}
            fullWidth={false}
            highlighted={highlighted === 'from'}
          />
          <WidgetFieldSSR
            type={'review'}
            chain={toChain}
            token={toToken}
            fullWidth={false}
            highlighted={highlighted === 'to'}
            amount={
              amount && fromToken && toToken
                ? (parseFloat(amount) * parseFloat(fromToken?.priceUSD)) /
                  parseFloat(toToken?.priceUSD)
                : null
            }
            sx={{ marginTop: 8 }}
          />
        </div>
      </div>
    </div>
  );
};

export default WidgetReviewSSR;
