/* eslint-disable @next/next/no-img-element */

// Test: http://localhost:3000/api/widget-selection?width=416&height=496&fromToken=0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063&fromChainId=137&toToken=0xdAC17F958D2ee523a2206206994597C13D831ec7&toChainId=1&amount=3&

// route.tsx
import type { ChainId } from '@lifi/sdk';
import { ChainType, getChains, getToken } from '@lifi/sdk';
import { ImageResponse } from 'next/og';
import type { Font } from 'node_modules/next/dist/compiled/@vercel/og/satori';
import type { HighlightedAreas } from 'src/components/ImageGeneration/Client/WidgetImage';
import WidgetReviewSSR from 'src/components/ImageGeneration/WidgetReviewSSR';

export const WIDGET_IMAGE_WIDTH = 416;
export const WIDGET_IMAGE_HEIGHT = 440;
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
          src={'http://localhost:3000/widget-review-light-compare.png'}
        />
        <WidgetReviewSSR
          height={WIDGET_IMAGE_WIDTH}
          width={WIDGET_IMAGE_HEIGHT}
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
    {
      width: WIDGET_IMAGE_WIDTH * WIDGET_IMAGE_SCALING_FACTOR,
      height: WIDGET_IMAGE_HEIGHT * WIDGET_IMAGE_SCALING_FACTOR,
      fonts: await getFonts(),
    },
  );
}

export default async function getFonts(): Promise<Font[]> {
  // This is unfortunate but I can't figure out how to load local font files
  // when deployed to vercel.
  const [interRegular, interSemiBold, interBold] = await Promise.all([
    fetch(`https://fonts.cdnfonts.com/s/19795/Inter-Regular.woff`).then((res) =>
      res.arrayBuffer(),
    ),
    fetch(`https://fonts.cdnfonts.com/s/19795/Inter-SemiBold.woff`).then(
      (res) => res.arrayBuffer(),
    ),
    fetch(`https://fonts.cdnfonts.com/s/19795/Inter-Bold.woff`).then((res) =>
      res.arrayBuffer(),
    ),
  ]);

  return [
    {
      name: 'Inter',
      data: interRegular,
      style: 'normal',
      weight: 400,
    },
    {
      name: 'Inter',
      data: interSemiBold,
      style: 'normal',
      weight: 600,
    },
    {
      name: 'Inter',
      data: interBold,
      style: 'normal',
      weight: 700,
    },
  ];
}
