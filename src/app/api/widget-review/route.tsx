/* eslint-disable @next/next/no-img-element */

/**
 * Image Generation of Widget for SEO pages
 * Step 5 - Review transaction
 *
 * Example:
 * ```
 * http://localhost:3000/api/widget-review?fromToken=0x0000000000000000000000000000000000000000&fromChainId=137&toToken=0x0000000000000000000000000000000000000000&toChainId=42161&amount=10&theme=dark
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
 *
 */

import type { ChainId } from '@lifi/sdk';
import { ImageResponse } from 'next/og';
import type { CSSProperties } from 'react';
import { imageResponseOptions } from 'src/components/ImageGeneration/imageResponseOptions';
import { imageFrameStyles } from 'src/components/ImageGeneration/style';
import WidgetReviewImage from 'src/components/ImageGeneration/WidgetReviewImage';
import { getSiteUrl } from 'src/const/urls';
import { fetchChainData } from 'src/utils/image-generation/fetchChainData';
import { fetchTokenData } from 'src/utils/image-generation/fetchTokenData';
import { parseSearchParams } from 'src/utils/image-generation/parseSearchParams';
import {
  widgetReviewSchema,
  type WidgetReviewParams,
} from 'src/utils/image-generation/widgetSchemas';

const WIDGET_IMAGE_WIDTH = 416;
const WIDGET_IMAGE_HEIGHT = 440;
const WIDGET_IMAGE_SCALING_FACTOR = 2;

export async function GET(request: Request) {
  try {
    const params = parseSearchParams<WidgetReviewParams>(
      request.url,
      widgetReviewSchema,
    );

    // Fetch data asynchronously before rendering
    const [fromTokenData, toTokenData, fromChain, toChain] = await Promise.all([
      fetchTokenData(params.fromChainId.toString(), params.fromToken),
      fetchTokenData(params.toChainId.toString(), params.toToken),
      fetchChainData(params.fromChainId as unknown as ChainId),
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
            alt="Widget Review Example"
            width={'100%'}
            height={'100%'}
            style={imageStyle}
            src={`${getSiteUrl()}/widget/widget-review-bridge-${params.theme}.png`}
          />
          <WidgetReviewImage
            height={WIDGET_IMAGE_WIDTH}
            width={WIDGET_IMAGE_HEIGHT}
            fromToken={fromTokenData}
            toToken={toTokenData}
            fromChain={fromChain}
            toChain={toChain}
            amount={params.amount}
            isSwap={params.isSwap}
            theme={params.theme}
          />
        </div>
      ),
      options,
    );
  } catch (error) {
    console.error('Error generating widget review image:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
