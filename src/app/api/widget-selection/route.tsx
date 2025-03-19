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
import WidgetSelectionImage from 'src/components/ImageGeneration/WidgetSelectionImage';
import { getSiteUrl } from 'src/const/urls';
import { fetchChainData } from 'src/utils/image-generation/fetchChainData';
import { fetchTokenData } from 'src/utils/image-generation/fetchTokenData';
import { parseSearchParams } from 'src/utils/image-generation/parseSearchParams';
import { widgetSelectionSchema } from 'src/utils/image-generation/widgetSchemas';

const WIDGET_IMAGE_WIDTH = 416;
const WIDGET_IMAGE_HEIGHT = 496;
const WIDGET_IMAGE_SCALING_FACTOR = 2;

export async function GET(request: Request) {
  try {
    const rawParams = parseSearchParams(request.url);

    // Validate and sanitize parameters using Zod
    const result = widgetSelectionSchema.safeParse(rawParams);

    if (!result.success) {
      return new Response(
        JSON.stringify({
          error: 'Invalid parameters',
          details: result.error.errors,
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    }

    const params = result.data;

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
            alt="Widget Selection Example"
            width={'100%'}
            height={'100%'}
            style={imageStyle}
            src={`${getSiteUrl()}/widget/widget-selection-${params.theme === 'dark' ? 'dark' : 'light'}.png`}
          />
          <WidgetSelectionImage
            height={WIDGET_IMAGE_WIDTH}
            width={WIDGET_IMAGE_HEIGHT}
            fromToken={fromTokenData}
            toToken={toTokenData}
            fromChain={fromChain}
            toChain={toChain}
            amount={params.amount}
            theme={params.theme}
            highlighted={params.highlighted as HighlightedAreas}
          />
        </div>
      ),
      options,
    );
  } catch (error) {
    console.error('Error generating widget selection image:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
