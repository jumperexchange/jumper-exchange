/* eslint-disable @next/next/no-img-element */

/**
 * Image Generation of Widget for SEO pages
 * Step 2 - Quotes
 *
 * Example:
 * ```
 * http://localhost:3000/api/widget-quotes?fromToken=0x0000000000000000000000000000000000000000&fromChainId=137&toToken=0x0000000000000000000000000000000000000000&toChainId=42161&amount=10&theme=dark
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
import WidgetQuotesImage from 'src/components/ImageGeneration/WidgetQuotesImage';
import { getSiteUrl } from 'src/const/urls';
import { fetchChainData } from 'src/utils/image-generation/fetchChainData';
import { fetchTokenData } from 'src/utils/image-generation/fetchTokenData';
import { parseSearchParams } from 'src/utils/image-generation/parseSearchParams';
import {
  widgetQuotesSchema,
  type WidgetQuotesParams,
} from 'src/utils/image-generation/widgetSchemas';

const WIDGET_IMAGE_WIDTH = 856;
const WIDGET_IMAGE_HEIGHT = 490;
const WIDGET_IMAGE_SCALING_FACTOR = 2;

export async function GET(request: Request) {
  try {
    const params = parseSearchParams<WidgetQuotesParams>(
      request.url,
      widgetQuotesSchema,
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
            alt="Widget Quotes Example"
            width={'100%'}
            height={'100%'}
            style={imageStyle}
            src={`${getSiteUrl()}/widget/widget-quotes-${params.theme}.png`}
          />
          <WidgetQuotesImage
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
    console.error('Error generating widget quotes image:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
