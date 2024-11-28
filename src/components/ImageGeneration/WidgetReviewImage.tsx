import type { ExtendedChain, Token } from '@lifi/sdk';
import type { CSSProperties } from 'react';
import ReviewField from './Fields/ReviewField';
import { FieldSkeleton } from './FieldSkeleton';
import type { HighlightedAreas, ImageTheme } from './ImageGeneration.types';
import ButtonLabel from './Labels/ButtonLabel';
import CardTitle from './Labels/CardTitle';
import Title from './Labels/Title';
import {
  contentContainerStyles,
  contentPositioningStyles,
  pageStyles,
} from './style';

const SCALING_FACTOR = 2;

interface WidgetReviewImageProps {
  fromChain?: ExtendedChain | null;
  toChain?: ExtendedChain | null;
  fromToken?: Token | null;
  toToken?: Token | null;
  theme?: ImageTheme;
  isSwap?: boolean;
  amount?: string | null;
  width: number;
  height: number;
  highlighted?: HighlightedAreas;
  sx?: CSSProperties;
}

const WidgetReviewImage = ({
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
  sx,
}: WidgetReviewImageProps) => {
  const contentContainerStyle = contentContainerStyles({
    height,
    width,
    scalingFactor: SCALING_FACTOR,
  }) as CSSProperties;

  const contentPositioningStyle = contentPositioningStyles() as CSSProperties;
  const pageStyle = pageStyles() as CSSProperties;

  return (
    <div style={contentPositioningStyle}>
      <div style={contentContainerStyle}>
        {
          // pages container -->
        }
        <div style={pageStyle}>
          <Title
            title={isSwap ? 'Review swap' : 'Review bridge'}
            theme={theme}
            fullWidth={true}
            sx={{
              marginTop: 22,
              alignSelf: 'flex-start',
              marginLeft: -2,
            }}
          />
          <CardTitle
            cardTitle={isSwap ? 'Swap' : 'Swap and bridge'}
            theme={theme}
          />
          <ReviewField
            chain={fromChain}
            theme={theme}
            token={fromToken}
            amount={amount ? parseFloat(amount) : null}
            fullWidth={false}
            highlighted={highlighted === 'from'}
            showSkeletons={true}
            sx={{ marginTop: 0 }}
          />
          <ReviewField
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
            sx={{ marginTop: 8 }}
          />
          <FieldSkeleton
            width={164}
            height={12}
            sx={{ marginTop: -12, marginLeft: 14 }}
          />
          <ButtonLabel
            buttonLabel={isSwap ? 'Start swapping' : 'Start bridging'}
            theme={theme}
            sx={{ marginTop: 40 }}
          />
        </div>
      </div>
    </div>
  );
};

export default WidgetReviewImage;
