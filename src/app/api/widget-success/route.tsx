/* eslint-disable @next/next/no-img-element */

/**
 * Image Generation of Widget for SEO pages
 * Step 5 - Route success
 *
 * Example:
 * ```
 * http://localhost:3000/api/widget-success?toToken=0x0000000000000000000000000000000000000000&toChainId=42161&amount=10&&theme=light&isSwap=true
 * ```
 *
 * @typedef {Object} SearchParams
 * @property {string} toToken - The token address to send to.
 * @property {number} toChainId - The chain ID to send to.
 * @property {number} amount - The amount of tokens.
 * @property {boolean} [isSwap] - True if transaction is a swap, default and false if transaction is a bridge (optional).
 * @property {'light'|'dark'} [theme] - The theme for the widget (optional).
 *
 */

import type { ChainId } from '@lifi/sdk';
import { ImageResponse } from 'next/og';
import type { CSSProperties } from 'react';
import { imageResponseOptions } from 'src/components/ImageGeneration/imageResponseOptions';
import { imageFrameStyles } from 'src/components/ImageGeneration/style';
import WidgetSuccessSSR from 'src/components/ImageGeneration/WidgetSuccessSSR';
import { fetchChainData } from 'src/utils/image-generation/fetchChainData';
import { fetchTokenData } from 'src/utils/image-generation/fetchTokenData';
import { parseSearchParams } from 'src/utils/image-generation/parseSearchParams';

const WIDGET_IMAGE_WIDTH = 416;
const WIDGET_IMAGE_HEIGHT = 432;
const WIDGET_IMAGE_SCALING_FACTOR = 2;

export async function GET(request: Request) {
  const { toChainId, toToken, theme, amount, isSwap } = parseSearchParams(
    request.url,
  );

  // Fetch data asynchronously before rendering
  const toTokenData = await fetchTokenData(toChainId, toToken);
  const toChain = await fetchChainData(toChainId as unknown as ChainId);

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

  return new ImageResponse(
    (
      <div style={imageFrameStyle}>
        <img
          alt="Widget Example"
          width={'100%'}
          height={'100%'}
          style={imageStyle}
          src={`${process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL}` : process.env.NEXT_PUBLIC_SITE_URL}/widget/widget-success-${theme === 'dark' ? 'dark' : 'light'}.png`}
        />
        <WidgetSuccessSSR
          height={WIDGET_IMAGE_WIDTH}
          isSwap={isSwap === 'true'}
          width={WIDGET_IMAGE_HEIGHT}
          toToken={toTokenData}
          theme={theme as 'light' | 'dark'}
          toChain={toChain}
          amount={amount}
        />
      </div>
    ),
    options,
  );
}
