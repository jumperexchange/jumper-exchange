/* eslint-disable @next/next/no-img-element */

/**
 * Image Generation of Widget for SEO pages
 * Step 4 - Route execution
 *
 * Example:
 * ```
 * http://localhost:3000/api/widget-amounts?chainName=arbitrum&amount=1&theme=light
 * ```
 *
 * @typedef {Object} SearchParams
 * @property {number} chainId - The chain ID to send from.
 * @property {number} amount - The amount of tokens.
 * @property {'light'|'dark'} [theme] - The theme for the widget (optional).
 *
 */

import { ImageResponse } from 'next/og';
import type { CSSProperties } from 'react';
import type { HighlightedAreas } from 'src/components/ImageGeneration/ImageGeneration.types';
import { imageResponseOptions } from 'src/components/ImageGeneration/imageResponseOptions';
import { imageFrameStyles } from 'src/components/ImageGeneration/style';
import WidgetAmountsImage from 'src/components/ImageGeneration/WidgetAmountImage';
import { getSiteUrl } from 'src/const/urls';
import { getChainsQuery } from 'src/hooks/useChains';
import { getTokensQuery } from 'src/hooks/useTokens';
import { parseSearchParams } from 'src/utils/image-generation/parseSearchParams';
import { sanitizeTheme } from 'src/utils/image-generation/sanitizeParams';
import { sortChainsBySpecificName } from 'src/utils/image-generation/sortChains';
import {
  widgetAmountsSchema,
  type WidgetAmountsParams,
} from 'src/utils/image-generation/widgetSchemas';

const WIDGET_IMAGE_WIDTH = 416;
const WIDGET_IMAGE_HEIGHT = 536;
const WIDGET_IMAGE_SCALING_FACTOR = 2;

export async function GET(request: Request) {
  try {
    const params = parseSearchParams<WidgetAmountsParams>(
      request.url,
      widgetAmountsSchema,
    );

    // Get chains and tokens data
    const { chains } = await getChainsQuery();
    const sortedChains = sortChainsBySpecificName(chains, params.chainName);
    const { tokens } = await getTokensQuery();
    const sortedTokensByChainId =
      sortedChains[0]?.id && tokens[sortedChains[0]?.id]?.slice(0, 4);

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
            alt="Widget Amount Example"
            width={'100%'}
            height={'100%'}
            style={imageStyle}
            src={`${getSiteUrl()}/widget/widget-swap-amounts-${sanitizeTheme(params.theme)}.png`}
          />
          <WidgetAmountsImage
            height={WIDGET_IMAGE_WIDTH}
            width={WIDGET_IMAGE_HEIGHT}
            theme={params.theme}
            chains={sortedChains}
            amount={params.amount}
            tokens={sortedTokensByChainId || undefined}
            highlighted={params.highlighted as HighlightedAreas}
          />
        </div>
      ),
      options,
    );
  } catch (error) {
    console.error('Error generating widget amounts image:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
