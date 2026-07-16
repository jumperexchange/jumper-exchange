import { getChainsQuery } from '@/hooks/useChains';
import { getChainByName } from '@/utils/tokenAndChain';
import { fetchTokenBySymbol } from '@/utils/image-generation/fetchTokenData';
import { bridgeSegmentsSchema, slugToLabel } from '@/utils/validation-schemas';
import type { ExtendedChain, Token } from '@lifi/sdk';
import { cache } from 'react';

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
};

export const resolveBridgeRoute = cache(
  async (segments: string): Promise<ResolvedBridgeRoute | null> => {
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
      const { chains } = await getChainsQuery();

      const sourceChain = getChainByName(
        chains,
        slugToLabel(sourceChainNameParam),
      );
      const destinationChain = getChainByName(
        chains,
        slugToLabel(destinationChainNameParam),
      );

      if (!sourceChain || !destinationChain) {
        return null;
      }

      const [sourceToken, destinationToken] = await Promise.all([
        fetchTokenBySymbol(sourceChain.id, sourceTokenSymbolParam),
        fetchTokenBySymbol(destinationChain.id, destinationTokenSymbolParam),
      ]);

      if (!sourceToken || !destinationToken) {
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
      };
    } catch {
      return null;
    }
  },
);
