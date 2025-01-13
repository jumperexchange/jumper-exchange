import type { ExtendedChain, Token } from '@lifi/sdk';
import type { CSSProperties } from 'react';
import QuoteAmountField from './Fields/QuoteAmountField';
import QuoteField from './Fields/QuoteField';
import TokenField from './Fields/TokenField';
import type { HighlightedAreas, ImageTheme } from './ImageGeneration.types';
import Label from './Labels/Label';
import {
  contentContainerStyles,
  contentPositioningStyles,
  pageStyles,
} from './style';

const SCALING_FACTOR = 2;

interface WidgetQuoteImageProps {
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

const WidgetQuoteImage = ({
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
}: WidgetQuoteImageProps) => {
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
          marginTop: 128,
        }}
      >
        {
          // pages container -->
        }
        <div style={{ display: 'flex', gap: 24 }}>
          <div
            style={{
              ...pageStyle,
              alignItems: 'center',
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
              <TokenField
                theme={theme || undefined}
                chain={fromChain}
                token={fromToken}
                fullWidth={false}
                highlighted={highlighted === 'from'}
              />
              <TokenField
                theme={theme || undefined}
                chain={toChain}
                token={toToken}
                fullWidth={false}
                highlighted={highlighted === 'to'}
              />
            </div>
            <QuoteAmountField
              theme={theme || undefined}
              chain={fromChain}
              token={fromToken}
              showSkeletons={true}
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
              ...pageStyle,
              alignItems: 'center',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {Array(3)
                .fill(0)
                .map((_, index) => (
                  <QuoteField
                    key={`widget-field-quote-${index}`}
                    theme={theme || undefined}
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
                    extendedHeight={index === 0}
                    amount={amount ? parseFloat(amount) : null}
                    amountUSD={amountUSD ? parseFloat(amountUSD) : undefined}
                    sx={{ ...(index !== 0 && { marginTop: 16, height: 110 }) }}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WidgetQuoteImage;
