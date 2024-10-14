import type { ExtendedChain, Token } from '@lifi/sdk';
import type { HighlightedAreas } from './Client/WidgetImage';
import WidgetFieldSSR from './Field';
import { FieldSkeleton } from './FieldSkeleton';
import Label from './Label';

const SCALING_FACTOR = 2;

interface WidgetReviewSSRProps {
  fromChain?: ExtendedChain | null;
  toChain?: ExtendedChain | null;
  fromToken?: Token | null;
  toToken?: Token | null;
  theme?: 'light' | 'dark';
  isSwap?: boolean;
  amount?: string | null;
  width: number;
  height: number;
  highlighted?: HighlightedAreas;
}

const WidgetExecutionSSR = ({
  fromChain,
  toChain,
  theme,
  fromToken,
  isSwap,
  toToken,
  amount,
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
            margin: '0 24px',
          }}
        >
          <Label
            title={isSwap ? 'Swap' : 'Bridge'}
            theme={theme}
            fullWidth={true}
            sx={{
              marginTop: 21,
              alignSelf: 'flex-start',
              marginLeft: -2,
            }}
          />
          <Label
            cardTitle={isSwap ? 'Swap' : 'Swap and bridge'}
            theme={theme}
          />
          <WidgetFieldSSR
            type={'review'}
            chain={fromChain}
            theme={theme}
            token={fromToken}
            amount={amount ? parseFloat(amount) : null}
            fullWidth={false}
            highlighted={highlighted === 'from'}
            showSkeletons={true}
            sx={{ padding: '0px 16px', marginTop: -4 }}
          />
          <Label
            cardContent={
              isSwap
                ? 'Waiting for swap transaction'
                : 'Waiting for bridge transaction'
            }
            theme={theme}
          />
          <WidgetFieldSSR
            type={'review'}
            chain={toChain}
            token={toToken}
            theme={theme}
            fullWidth={false}
            highlighted={highlighted === 'to'}
            amount={
              amount && fromToken && toToken
                ? (parseFloat(amount) * parseFloat(fromToken?.priceUSD)) /
                  parseFloat(toToken?.priceUSD)
                : null
            }
            showSkeletons={true}
            sx={{ padding: '0px 16px', marginTop: 2 }}
          />
          <FieldSkeleton
            width={164}
            height={12}
            sx={{ marginTop: -7, marginLeft: 14 }}
          />
          <Label
            buttonLabel={isSwap ? 'Start swapping' : 'Start bridging'}
            theme={theme}
            sx={{ marginTop: 53 }}
          />
        </div>
      </div>
    </div>
  );
};

export default WidgetExecutionSSR;
