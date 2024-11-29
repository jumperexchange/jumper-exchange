import type { ExtendedChain, Token } from '@lifi/sdk';
import type { CSSProperties } from 'react';
import SuccessField from './Fields/SuccessField';
import { FieldSkeleton } from './FieldSkeleton';
import type { ImageTheme } from './ImageGeneration.types';
import Title from './Labels/Title';
import { contentContainerStyles, contentPositioningStyles } from './style';

const SCALING_FACTOR = 2;

interface WidgetReviewImageProps {
  toChain?: ExtendedChain | null;
  toToken?: Token | null;
  theme?: ImageTheme;
  isSwap?: boolean;
  amount?: string | null;
  width: number;
  height: number;
}

const WidgetSuccessImage = ({
  toChain,
  theme,
  isSwap,
  toToken,
  amount,
  width,
  height,
}: WidgetReviewImageProps) => {
  const contentContainerStyle = contentContainerStyles({
    height,
    width,
    scalingFactor: SCALING_FACTOR,
  }) as CSSProperties;

  const contentPositioningStyle = contentPositioningStyles() as CSSProperties;

  return (
    <div style={contentPositioningStyle}>
      <div style={contentContainerStyle}>
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
          <Title
            title={isSwap ? 'Swap successful' : 'Bridge successful'}
            theme={theme}
            fullWidth={true}
            sx={{
              marginTop: 189,
              marginLeft: 2,
              alignSelf: 'flex-start',
            }}
          />
          <SuccessField
            chain={toChain}
            theme={theme}
            token={toToken}
            amount={amount ? parseFloat(amount) : null}
          />
          <FieldSkeleton width={344} height={12} sx={{ marginTop: -42 }} />
          <FieldSkeleton width={184} height={12} sx={{ marginTop: 12 }} />
        </div>
      </div>
    </div>
  );
};

export default WidgetSuccessImage;
