/* eslint-disable @next/next/no-img-element */

/**
 * Image Generation of Widget for SEO pages
 * Step 4 - Route execution
 *
 * Example:
 * ```
 * http://localhost:3000/api/widget-execution?fromToken=0x0000000000000000000000000000000000000000&fromChainId=137&toToken=0x0000000000000000000000000000000000000000&toChainId=42161&amount=10&&theme=light&isSwap=true
 * ```
 *
 * @typedef {Object} SearchParams
 * @property {string} fromToken - The token address to send from.
 * @property {number} fromChainId - The chain ID to send from.
 * @property {string} toToken - The token address to send to.
 * @property {number} toChainId - The chain ID to send to.
 * @property {number} amount - The amount of tokens.
 * @property {boolean} [isSwap] - True if transaction is a swap, default and false if transaction is a bridge (optional).
 * @property {'light'|'dark'} [theme] - The theme for the widget (optional).
 * @property {'from'|'to'|'amount'} [highlighted] - The highlighted element (optional).
 *
 */

import type { ChainId } from '@lifi/sdk';
import { ImageResponse } from 'next/og';
import type { CSSProperties } from 'react';
import type { HighlightedAreas } from 'src/components/ImageGeneration/ImageGeneration.types';
import { imageResponseOptions } from 'src/components/ImageGeneration/imageResponseOptions';
import { imageFrameStyles } from 'src/components/ImageGeneration/style';
import WidgetExecutionImage from 'src/components/ImageGeneration/WidgetExecutionImage';
import { getSiteUrl } from 'src/const/urls';
import { fetchChainData } from 'src/utils/image-generation/fetchChainData';
import { fetchTokenData } from 'src/utils/image-generation/fetchTokenData';
import { parseSearchParams } from 'src/utils/image-generation/parseSearchParams';
import { sanitizeTheme } from 'src/utils/image-generation/sanitizeParams';
import {
  widgetExecutionSchema,
  type WidgetExecutionParams,
} from 'src/utils/image-generation/widgetSchemas';

const WIDGET_IMAGE_WIDTH = 416;
const WIDGET_IMAGE_HEIGHT = 432;
const WIDGET_IMAGE_SCALING_FACTOR = 2;

export async function GET(request: Request) {
  try {
    const params = parseSearchParams<WidgetExecutionParams>(
      request.url,
      widgetExecutionSchema,
    );

    // Fetch data asynchronously before rendering
    const fromTokenData = await fetchTokenData(
      String(params.fromChainId),
      params.fromToken,
    );
    const toTokenData = await fetchTokenData(
      String(params.toChainId),
      params.toToken,
    );
    const fromChain = await fetchChainData(
      params.fromChainId as unknown as ChainId,
    );
    const toChain = await fetchChainData(
      params.toChainId as unknown as ChainId,
    );

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
            alt="Widget Example"
            width={'100%'}
            height={'100%'}
            style={imageStyle}
            src={`${getSiteUrl()}/widget/widget-execution-${sanitizeTheme(params.theme)}.png`}
          />
          <WidgetExecutionImage
            height={WIDGET_IMAGE_WIDTH}
            isSwap={params.isSwap}
            width={WIDGET_IMAGE_HEIGHT}
            fromToken={fromTokenData}
            toToken={toTokenData}
            fromChain={fromChain}
            theme={params.theme}
            toChain={toChain}
            amount={params.amount}
            highlighted={params.highlighted as HighlightedAreas}
          />
        </div>
      ),
      options,
    );
  } catch (error) {
    console.error('Error generating widget execution image:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
