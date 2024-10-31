/* eslint-disable @next/next/no-img-element */

/**
 * Image Generation of Widget for SEO pages
 * Step 2 - Quotes
 *
 * Example:
 * ```
 * http://localhost:3000/api/widget-quotes?fromToken=0x0000000000000000000000000000000000000000&fromChainId=137&toToken=0x0000000000000000000000000000000000000000&toChainId=42161&amount=10&highlighted=0&theme=light
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
import { ChainType, getChains, getToken } from '@lifi/sdk';
import { ImageResponse } from 'next/og';
import type { HighlightedAreas } from 'src/components/ImageGeneration/ImageGeneration.types';
import { imageResponseOptions } from 'src/components/ImageGeneration/imageResponseOptions';
import WidgetQuoteSSR from 'src/components/ImageGeneration/WidgetQuotesSSR';

const WIDGET_IMAGE_WIDTH = 856;
const WIDGET_IMAGE_HEIGHT = 490; //376;
const WIDGET_IMAGE_SCALING_FACTOR = 2;

export async function GET(request: Request) {
  // console.time('start-time');
  const { searchParams } = new URL(request.url);
  const amount = searchParams.get('amount');
  const amountUSD = searchParams.get('amountUSD');
  const fromToken = searchParams.get('fromToken');
  const fromChainId = searchParams.get('fromChainId');
  const toToken = searchParams.get('toToken');
  const toChainId = searchParams.get('toChainId');
  const highlighted = searchParams.get('highlighted');
  const theme = searchParams.get('theme');
  const isSwap = searchParams.get('isSwap');

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

  const routeAmount =
    (parseFloat(fromTokenData?.priceUSD || '0') * parseFloat(amount || '0')) /
    parseFloat(toTokenData?.priceUSD || '0');

  const options = await imageResponseOptions({
    width: WIDGET_IMAGE_WIDTH,
    height: WIDGET_IMAGE_HEIGHT,
    scalingFactor: WIDGET_IMAGE_SCALING_FACTOR,
  });

  const ImageResp = new ImageResponse(
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
          alt="Widget Quotes Example"
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
          src={`${process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL || process.env.NEXT_PUBLIC_SITE_URL}/widget/widget-quotes-${theme === 'dark' ? 'dark' : 'light'}.png`}
        />
        <WidgetQuoteSSR
          theme={theme as 'light' | 'dark'}
          height={WIDGET_IMAGE_WIDTH}
          width={WIDGET_IMAGE_HEIGHT}
          isSwap={isSwap === 'true'}
          fromToken={fromTokenData}
          toToken={toTokenData}
          fromChain={fromChain}
          toChain={toChain}
          amount={amount}
          routeAmount={routeAmount}
          amountUSD={amountUSD}
          highlighted={highlighted as HighlightedAreas}
        />
      </div>
    ),
    options,
  );
  // console.timeEnd('start-time');
  return ImageResp;
}