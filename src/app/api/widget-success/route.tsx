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
import WidgetSuccessImage from 'src/components/ImageGeneration/WidgetSuccessImage';
import { getSiteUrl } from 'src/const/urls';
import { fetchChainData } from 'src/utils/image-generation/fetchChainData';
import { fetchTokenData } from 'src/utils/image-generation/fetchTokenData';
import { parseSearchParams } from 'src/utils/image-generation/parseSearchParams';
import { sanitizeTheme } from 'src/utils/image-generation/sanitizeParams';
import {
  widgetSuccessSchema,
  type WidgetSuccessParams,
} from 'src/utils/image-generation/widgetSchemas';

const WIDGET_IMAGE_WIDTH = 416;
const WIDGET_IMAGE_HEIGHT = 440;
const WIDGET_IMAGE_SCALING_FACTOR = 2;

export async function GET(request: Request) {
  try {
    const params = parseSearchParams<WidgetSuccessParams>(
      request.url,
      widgetSuccessSchema,
    );

    // Fetch data asynchronously before rendering
    const [toTokenData, toChain] = await Promise.all([
      fetchTokenData(params.toChainId.toString(), params.toToken),
      fetchChainData(params.toChainId as unknown as ChainId),
    ]);

    const options = await imageResponseOptions({
      width: WIDGET_IMAGE_WIDTH,
      height: WIDGET_IMAGE_HEIGHT,
      scalingFactor: WIDGET_IMAGE_SCALING_FACTOR,
    });

    const imageStyle = imageFrameStyles({
      width: WIDGET_IMAGE_WIDTH,
      height: WIDGET_IMAGE_HEIGHT,
      scalingFactor: WIDGET_IMAGE_SCALING_FACTOR,
    }) as CSSProperties;

    return new ImageResponse(
      (
        <div style={imageStyle}>
          <img
            alt="Widget Success Example"
            width={'100%'}
            height={'100%'}
            style={imageStyle}
            src={`${getSiteUrl()}/widget/widget-success-${sanitizeTheme(params.theme)}.png`}
          />
          <WidgetSuccessImage
            height={WIDGET_IMAGE_WIDTH}
            width={WIDGET_IMAGE_HEIGHT}
            toToken={toTokenData}
            toChain={toChain}
            amount={params.amount}
            theme={params.theme}
          />
        </div>
      ),
      options,
    );
  } catch (error) {
    console.error('Error generating widget success image:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
