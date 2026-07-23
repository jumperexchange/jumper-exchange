/**
 * Dynamic social card for sharing the extra output a user got on a swap
 * versus the median eligible quote (JUMADV-1).
 *
 * Example:
 * ```
 * http://localhost:3000/api/share-pnl?amountWon=980&swapSize=120000&fromToken=USDC&toToken=ETH&referralCode=ABC123
 * ```
 *
 * Query params (see `pnlShareSchema`):
 * - amountWon: extra value gained vs the median quote, in USD, e.g. `980`
 * - swapSize: total swap size in USD, e.g. `120000`
 * - fromToken: symbol of the token spent, e.g. `USDC`
 * - toToken: symbol of the token received, e.g. `ETH`
 * - referralCode: optional referral code appended to the share link
 */

import { ImageResponse } from 'next/og';
import PnlShareImage from '@/components/ImageGeneration/PnlShareImage';
import { getSocialCardImageResponseOptions } from '@/utils/ImageGeneration/getSocialCardImageResponseOptions';
import { parsePnlShareParams } from '@/utils/image-generation/pnlShareSchema';

const IMAGE_SIZE = 1080;

export const maxDuration = 60;

export async function GET(request: Request) {
  try {
    const params = parsePnlShareParams(request.url);
    const origin = new URL(request.url).origin;

    return new ImageResponse(
      <PnlShareImage
        {...params}
        width={IMAGE_SIZE}
        height={IMAGE_SIZE}
        origin={origin}
      />,
      await getSocialCardImageResponseOptions({
        width: IMAGE_SIZE,
        height: IMAGE_SIZE,
      }),
    );
  } catch (error) {
    console.error('Error generating social share image:', error);
    return new Response('Invalid parameters for the social share card', {
      status: 400,
    });
  }
}
