import type { ExtendedChain, Token } from '@lifi/sdk';
import WidgetFieldSSR from './Field';
import type { HighlightedAreas, ImageTheme } from './ImageGeneration.types';
import Label from './Label';

const SCALING_FACTOR = 2;

interface WidgetQuoteSSRProps {
  fromChain?: ExtendedChain | null;
  toChain?: ExtendedChain | null;
  fromToken?: Token | null;
  toToken?: Token | null;
  routeAmount?: number | null;
  amount?: string | null;
  isSwap?: boolean;
  amountUSD?: string | null;
  width: number;
  height: number;
  highlighted?: HighlightedAreas;
  theme?: ImageTheme | null;
}

const WidgetQuoteSSR = ({
  fromChain,
  toChain,
  fromToken,
  toToken,
  theme,
  amount,
  isSwap,
  amountUSD,
  routeAmount,
  width,
  height,
  highlighted,
}: WidgetQuoteSSRProps) => {
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
        <div style={{ display: 'flex', gap: 24 }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              margin: '0 24px',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: 18,
                justifyContent: 'space-between',
              }}
            >
              <WidgetFieldSSR
                theme={theme || undefined}
                type={'token'}
                chain={fromChain}
                token={fromToken}
                fullWidth={false}
                highlighted={highlighted === 'from'}
              />
              <WidgetFieldSSR
                theme={theme || undefined}
                type={'token'}
                chain={toChain}
                token={toToken}
                fullWidth={false}
                highlighted={highlighted === 'to'}
              />
            </div>
            <WidgetFieldSSR
              theme={theme || undefined}
              type={'quote-amount'}
              chain={fromChain}
              token={fromToken}
              amount={amount ? parseFloat(amount) : undefined}
              amountUSD={amountUSD ? parseFloat(amountUSD) : undefined}
              fullWidth={true}
              sx={{ marginTop: 16 }}
              highlighted={highlighted === 'amount'}
            />
            <Label
              buttonLabel={isSwap ? 'Review swap' : 'Review bridge'}
              theme={theme || undefined}
              fullWidth={true}
              sx={{ marginTop: 33, marginLeft: -59 }}
            />
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              margin: '0 24px',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {Array(5)
                .fill(0)
                .map((_, index) => (
                  <WidgetFieldSSR
                    key={`widget-field-quote-${index}`}
                    theme={theme || undefined}
                    type={'quote'}
                    chain={fromChain}
                    token={fromToken}
                    fullWidth={true}
                    showSkeletons={true}
                    highlighted={index.toString() === highlighted}
                    routeAmount={((100 - index) / 100) * (routeAmount || 1)}
                    routeAmountUSD={
                      ((100 - index) / 100) *
                      (parseFloat(amount || '1') *
                        parseFloat(fromToken?.priceUSD || '1'))
                    }
                    extendedHeight={index < 1}
                    amount={amount ? parseFloat(amount) : undefined}
                    amountUSD={amountUSD ? parseFloat(amountUSD) : undefined}
                    sx={{ ...(index !== 0 && { marginTop: 16 }) }}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WidgetQuoteSSR;
