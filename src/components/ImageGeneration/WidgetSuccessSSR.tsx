import type { ExtendedChain, Token } from '@lifi/sdk';
import WidgetFieldSSR from './Field';
import { FieldSkeleton } from './FieldSkeleton';
import Label from './Label';

const SCALING_FACTOR = 2;

interface WidgetReviewSSRProps {
  toChain?: ExtendedChain | null;
  toToken?: Token | null;
  theme?: 'light' | 'dark';
  isSwap?: boolean;
  amount?: string | null;
  width: number;
  height: number;
}

const WidgetSuccessSSR = ({
  toChain,
  theme,
  isSwap,
  toToken,
  amount,
  width,
  height,
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
            flexDirection: 'column',
            margin: '0 22px',
          }}
        >
          <Label
            title={isSwap ? 'Swap successful' : 'Bridge successful'}
            theme={theme}
            fullWidth={true}
            sx={{
              marginTop: 189,
              marginLeft: 2,
              alignSelf: 'flex-start',
            }}
          />
          <WidgetFieldSSR
            type={'success'}
            chain={toChain}
            theme={theme}
            token={toToken}
            amount={amount ? parseFloat(amount) : null}
            fullWidth={false}
            showSkeletons={true}
            sx={{ padding: '0px', marginTop: -2, marginLeft: 114 }}
          />
          <FieldSkeleton width={344} height={12} sx={{ marginTop: -42 }} />
          <FieldSkeleton width={184} height={12} sx={{ marginTop: 12 }} />
        </div>
      </div>
    </div>
  );
};

export default WidgetSuccessSSR;
