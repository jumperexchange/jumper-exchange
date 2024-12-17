/* eslint-disable @next/next/no-img-element */

/**
 * Image Generation of Widget for SEO pages
 * Step 2 - Quotes
 *
 * Example:
 * ```
 * http://localhost:3000/api/widget-quotes?fromToken=0x0000000000000000000000000000000000000000&fromChainId=137&toToken=0x0000000000000000000000000000000000000000&toChainId=42161&amount=10&highlighted=0&theme=light
 * ```
 *
 * @typedef {Object} SearchParams
 * @property {string} fromToken - The token address to send from.
 * @property {number} fromChainId - The chain ID to send from.
 * @property {string} toToken - The token address to send to.
 * @property {number} toChainId - The chain ID to send to.
 * @property {number} amount - The amount of tokens.
 * @property {number} [amountUSD] - The USD equivalent amount (optional).
 * @property {boolean} [isSwap] - True if transaction is a swap, default and false if transaction is a bridge (optional).
 * @property {'light'|'dark'} [theme] - The theme for the widget (optional).
 * @property {'from'|'to'|'amount'|'0'|'1'|'2'} [highlighted] - The highlighted element, numbers refer to quote index (optional).
 *
 */
import type { ChainId } from '@lifi/sdk';
import { ImageResponse } from 'next/og';
import type { CSSProperties } from 'react';
import type { HighlightedAreas } from 'src/components/ImageGeneration/ImageGeneration.types';
import { imageResponseOptions } from 'src/components/ImageGeneration/imageResponseOptions';
import { imageFrameStyles } from 'src/components/ImageGeneration/style';
import WidgetQuoteImage from 'src/components/ImageGeneration/WidgetQuotesImage';
import { fetchChainData } from 'src/utils/image-generation/fetchChainData';
import { fetchTokenData } from 'src/utils/image-generation/fetchTokenData';
import { parseSearchParams } from 'src/utils/image-generation/parseSearchParams';

const WIDGET_IMAGE_WIDTH = 856;
const WIDGET_IMAGE_HEIGHT = 490; //376;
const WIDGET_IMAGE_SCALING_FACTOR = 2;

export async function GET(request: Request) {
  const {
    fromChainId,
    toChainId,
    fromToken,
    toToken,
    isSwap,
    theme,
    amount,
    highlighted,
    amountUSD,
  } = parseSearchParams(request.url);

  // Fetch data asynchronously before rendering
  const fromTokenData = await fetchTokenData(fromChainId, fromToken);
  const toTokenData = await fetchTokenData(toChainId, toToken);
  const fromChain = await fetchChainData(fromChainId as unknown as ChainId);
  const toChain = await fetchChainData(toChainId as unknown as ChainId);

  const routeAmount =
    (parseFloat(fromTokenData?.priceUSD || '0') * parseFloat(amount || '0')) /
    parseFloat(toTokenData?.priceUSD || '0');

  const options = await imageResponseOptions({
    width: WIDGET_IMAGE_WIDTH,
    height: WIDGET_IMAGE_HEIGHT,
    scalingFactor: WIDGET_IMAGE_SCALING_FACTOR,
  });

  const imageFrameStyle = imageFrameStyles({
    width: WIDGET_IMAGE_WIDTH,
    height: WIDGET_IMAGE_HEIGHT,
    scalingFactor: WIDGET_IMAGE_SCALING_FACTOR,
  }) as CSSProperties;

  const imageStyle = imageFrameStyles({
    width: WIDGET_IMAGE_WIDTH,
    height: WIDGET_IMAGE_HEIGHT,
    scalingFactor: WIDGET_IMAGE_SCALING_FACTOR,
  }) as CSSProperties;

  const ImageResp = new ImageResponse(
    (
      <div style={imageFrameStyle}>
        <img
          alt="Widget Quotes Example"
          width={'100%'}
          height={'100%'}
          style={imageStyle}
          src={`${process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL}` : process.env.NEXT_PUBLIC_SITE_URL}/widget/widget${isSwap ? '-swap' : ''}-quotes-${theme === 'dark' ? 'dark' : 'light'}.png`}
        />
        <WidgetQuoteImage
          theme={theme as 'light' | 'dark'}
          height={WIDGET_IMAGE_WIDTH}
          width={WIDGET_IMAGE_HEIGHT}
          isSwap={isSwap === 'true'}
          fromToken={fromTokenData}
          toToken={toTokenData}
          fromChain={fromChain}
          toChain={toChain}
          amount={amount}
          routeAmount={routeAmount}
          amountUSD={amountUSD}
          highlighted={highlighted as HighlightedAreas}
        />
      </div>
    ),
    options,
  );
  // console.timeEnd('start-time');
  return ImageResp;
}
