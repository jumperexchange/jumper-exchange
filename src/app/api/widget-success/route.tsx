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

import { ImageResponse } from 'next/og';
import { imageResponseOptions } from 'src/components/ImageGeneration/imageResponseOptions';
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
          alt="Widget Example"
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
