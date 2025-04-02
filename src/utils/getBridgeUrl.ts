import { slugify } from '@/utils/validation-schemas';
import type { ExtendedChain, Token } from '@lifi/sdk';

export const getBridgeUrl = (
  sourceChain: ExtendedChain | undefined,
  sourceToken: Token,
  destinationChain: ExtendedChain | undefined,
  destinationToken: Token,
) => {
  if (
    !sourceChain?.name ||
    !destinationChain?.name ||
    !sourceToken.symbol ||
    !destinationToken.symbol
  ) {
    return null;
  }

  const sourceChainName = slugify(sourceChain?.name);
  const destinationChainName = slugify(destinationChain?.name);
  const sourceTokenSymbol = slugify(sourceToken.symbol);
  const destinationTokenSymbol = slugify(destinationToken.symbol);

  return `/bridge/${sourceChainName}-${sourceTokenSymbol}-to-${destinationChainName}-${destinationTokenSymbol}`;
};
