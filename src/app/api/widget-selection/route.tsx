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

import type { ChainId } from '@lifi/sdk';
import { ChainType, getChains, getToken } from '@lifi/sdk';
import { ImageResponse } from 'next/og';
import type { HighlightedAreas } from 'src/components/ImageGeneration/Client/WidgetImage';
import { imageResponseOptions } from 'src/components/ImageGeneration/imageResponseOptions';
import WidgetImageSSR from 'src/components/ImageGeneration/WidgetImageSSR';

const WIDGET_IMAGE_WIDTH = 416;
const WIDGET_IMAGE_HEIGHT = 496;
const WIDGET_IMAGE_SCALING_FACTOR = 2;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const amount = searchParams.get('amount');
  const amountUSD = searchParams.get('amountUSD');
  const fromToken = searchParams.get('fromToken');
  const fromChainId = searchParams.get('fromChainId');
  const toToken = searchParams.get('toToken');
  const toChainId = searchParams.get('toChainId');
  const highlighted = searchParams.get('highlighted');
  const theme = searchParams.get('theme');

  // Fetch chain data asynchronously before rendering
  const getChainData = async (chainId: ChainId) => {
    const chainsData = await getChains({
      chainTypes: [ChainType.EVM, ChainType.SVM],
    });
    return chainsData.find((chainEl) => chainEl.id === chainId);
  };

  // Fetch from and to chain details (await this before rendering)
  const fromChain = fromChainId
    ? await getChainData(parseInt(fromChainId) as ChainId)
    : null;
  const toChain = toChainId
    ? await getChainData(parseInt(toChainId) as ChainId)
    : null;

  // Fetch token asynchronously
  const fetchToken = async (chainId: ChainId | null, token: string | null) => {
    if (!chainId || !token) {
      return null;
    }
    try {
      const fetchedToken = await getToken(chainId, token);
      return fetchedToken;
    } catch (error) {
      console.error('Error fetching token:', error);
      return null;
    }
  };

  const fromTokenData =
    fromChainId && fromToken
      ? await fetchToken(parseInt(fromChainId) as ChainId, fromToken)
      : null;
  const toTokenData =
    toChainId && toToken
      ? await fetchToken(parseInt(toChainId) as ChainId, toToken)
      : null;

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
          src={`http://localhost:3000/widget/widget-selection-${theme === 'dark' ? 'dark' : 'light'}.png`}
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
