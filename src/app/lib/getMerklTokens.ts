import { merklApi } from '@/utils/merkl/merklApi';
import * as Sentry from '@sentry/nextjs';
// Infer types from the API
type MerklTokenssApiResponse = Awaited<ReturnType<typeof merklApi.tokens.get>>;
type MerklTokensResponse = NonNullable<MerklTokenssApiResponse['data']>;
export type MerklToken = NonNullable<MerklTokensResponse[0]>;

interface GetMerklTokensProps {
  chainId: number;
}

export async function getMerklTokens({
  chainId,
}: GetMerklTokensProps): Promise<MerklToken[]> {
  if (!chainId) {
    throw new Error('Chain ID is required');
  }

  try {
    const response = await merklApi.tokens.reward.get({
      query: { chainId: chainId.toString() },
    });

    if (!response.data || Array.isArray(response.data)) {
      return [];
    }

    const tokenArrays = Object.values(response.data).flat();

    return tokenArrays || [];
  } catch (error) {
    Sentry.captureException(error);
    console.error(`Error fetching tokens on Chain ${chainId}: ${error}`);
    return [];
  }
}
