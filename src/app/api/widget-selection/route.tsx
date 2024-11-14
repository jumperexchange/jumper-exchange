/* eslint-disable @next/next/no-img-element */

/**
 * Image Generation of Widget for SEO pages
 * Step 1 - Selecting Tokens
 *
 * Example:
 * ```
 * http://localhost:3000/api/widget-selection?fromToken=0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063&fromChainId=137&toToken=0xdAC17F958D2ee523a2206206994597C13D831ec7&toChainId=1&amount=3&theme=dark
 * ```
 *
 * @typedef {Object} SearchParams
 * @property {string} fromToken - The token address to send from.
 * @property {number} fromChainId - The chain ID to send from.
 * @property {string} toToken - The token address to send to.
 * @property {number} toChainId - The chain ID to send to.
 * @property {number} amount - The amount of tokens.
 * @property {number} [amountUSD] - The USD equivalent amount (optional).
 * @property {'light'|'dark'} [theme] - The theme for the widget (optional).
 * @property {'from'|'to'|'amount'} [highlighted] - The highlighted element (optional).
 *
 */

import { ImageResponse } from 'next/og';
import type { HighlightedAreas } from 'src/components/ImageGeneration/ImageGeneration.types';
import { imageResponseOptions } from 'src/components/ImageGeneration/imageResponseOptions';
import WidgetImageSSR from 'src/components/ImageGeneration/WidgetImageSSR';
import { fetchChainData } from 'src/utils/image-generation/fetchChainData';
import { fetchTokenData } from 'src/utils/image-generation/fetchTokenData';
import { parseSearchParams } from 'src/utils/image-generation/parseSearchParams';

const WIDGET_IMAGE_WIDTH = 416;
const WIDGET_IMAGE_HEIGHT = 496;
const WIDGET_IMAGE_SCALING_FACTOR = 2;

export async function GET(request: Request) {
  const {
    fromChainId,
    toChainId,
    fromToken,
    toToken,
    theme,
    amount,
    highlighted,
    amountUSD,
  } = parseSearchParams(request.url);

  // Fetch data asynchronously before rendering
  const fromTokenData = await fetchTokenData(fromChainId, fromToken);
  const toTokenData = await fetchTokenData(toChainId, toToken);
  const fromChain = await fetchChainData(fromChainId);
  const toChain = await fetchChainData(toChainId);

  const options = await imageResponseOptions({
    width: WIDGET_IMAGE_WIDTH,
    height: WIDGET_IMAGE_HEIGHT,
    scalingFactor: WIDGET_IMAGE_SCALING_FACTOR,
  });

  return new ImageResponse(
    (
      <div
        style={{
          position: 'relative',
          display: 'flex',
          width: WIDGET_IMAGE_WIDTH * WIDGET_IMAGE_SCALING_FACTOR,
          height: WIDGET_IMAGE_HEIGHT * WIDGET_IMAGE_SCALING_FACTOR,
        }}
      >
        <img
          alt="Widget Selection Example"
          width={'100%'}
          height={'100%'}
          style={{
            margin: 'auto',
            position: 'absolute',
            top: 0,
            left: 0,
            objectFit: 'cover',
            width: WIDGET_IMAGE_WIDTH * WIDGET_IMAGE_SCALING_FACTOR,
            height: WIDGET_IMAGE_HEIGHT * WIDGET_IMAGE_SCALING_FACTOR,
          }}
          src={`${process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL}` : process.env.NEXT_PUBLIC_SITE_URL}/widget/widget-selection-${theme === 'dark' ? 'dark' : 'light'}.png`}
        />
        <WidgetImageSSR
          height={WIDGET_IMAGE_WIDTH}
          width={WIDGET_IMAGE_HEIGHT}
          fromToken={fromTokenData}
          toToken={toTokenData}
          fromChain={fromChain}
          toChain={toChain}
          amount={amount}
          amountUSD={amountUSD}
          theme={theme as 'light' | 'dark'}
          highlighted={highlighted as HighlightedAreas}
        />{' '}
      </div>
    ),
    options,
  );
}
