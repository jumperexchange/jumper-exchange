import { getChainsQuery } from '@/hooks/useChains';
import { getTokensQuery } from '@/hooks/useTokens';
import {
  getChainByName,
  getTokenBySymbolOnSpecificChain,
} from '@/utils/tokenAndChain';
import { bridgeSegmentsSchema, slugToLabel } from '@/utils/validation-schemas';
import type { ExtendedChain, Token, TokensResponse } from '@lifi/sdk';

export type ResolvedBridgeRoute = {
  segments: string;
  sourceChainNameParam: string;
  sourceTokenSymbolParam: string;
  destinationChainNameParam: string;
  destinationTokenSymbolParam: string;
  sourceChain: ExtendedChain;
  sourceToken: Token;
  destinationChain: ExtendedChain;
  destinationToken: Token;
  chains: ExtendedChain[];
  tokens: TokensResponse['tokens'];
};

export const resolveBridgeRoute = async (
  segments: string,
): Promise<ResolvedBridgeRoute | null> => {
  const result = bridgeSegmentsSchema.safeParse(segments);

  if (!result.success) {
    return null;
  }

  const {
    sourceChain: sourceChainNameParam,
    sourceToken: sourceTokenSymbolParam,
    destinationChain: destinationChainNameParam,
    destinationToken: destinationTokenSymbolParam,
  } = result.data;

  try {
    const [{ chains }, tokens] = await Promise.all([
      getChainsQuery(),
      getTokensQuery(),
    ]);

    const sourceChain = getChainByName(
      chains,
      slugToLabel(sourceChainNameParam),
    );
    const sourceToken = getTokenBySymbolOnSpecificChain(
      tokens,
      sourceChain?.id ?? 0,
      sourceTokenSymbolParam,
    );
    const destinationChain = getChainByName(
      chains,
      slugToLabel(destinationChainNameParam),
    );
    const destinationToken = getTokenBySymbolOnSpecificChain(
      tokens,
      destinationChain?.id ?? 0,
      destinationTokenSymbolParam,
    );

    if (
      !sourceChain ||
      !sourceToken ||
      !destinationChain ||
      !destinationToken
    ) {
      return null;
    }

    return {
      segments,
      sourceChainNameParam,
      sourceTokenSymbolParam,
      destinationChainNameParam,
      destinationTokenSymbolParam,
      sourceChain,
      sourceToken,
      destinationChain,
      destinationToken,
      chains,
      tokens,
    };
  } catch {
    return null;
  }
};
