import * as Sentry from '@sentry/nextjs';

import type { ChainId } from '@lifi/types';

interface ITokenInfo {
  chainId?: ChainId;
  tokenAddress?: string;
}

async function getDeductAmount(
  srcChainId: number,
  srcTokenAddress: string,
  dstChainId: number,
  dstTokenAddress: string,
): Promise<number | undefined> {
  try {
    const params = new URLSearchParams({
      srcChainId: srcChainId.toString(),
      srcTokenAddress,
      dstChainId: dstChainId.toString(),
      dstTokenAddress,
    });

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/solana/deduct-amount?${params.toString()}`,
    );

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const { data } = await response.json();

    return data?.deductedAmount;
  } catch (e) {
    Sentry.captureException(e);
    console.error(e);

    return undefined;
  }
}

export default getDeductAmount;
