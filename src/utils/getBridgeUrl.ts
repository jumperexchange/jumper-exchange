import { slugify } from '@/utils/validation-schemas';
import type { ExtendedChain, Token } from '@lifi/sdk';

export const getBridgeUrl = (
  sourceChain: ExtendedChain,
  sourceToken: Token,
  destinationChain: ExtendedChain,
  destinationToken: Token,
) => {
  const sourceChainName = slugify(sourceChain.name);
  const destinationChainName = slugify(destinationChain.name);
  const sourceTokenSymbol = slugify(sourceToken.symbol);
  const destinationTokenSymbol = slugify(destinationToken.symbol);

  return `/bridge/${sourceChainName}-${sourceTokenSymbol}-to-${destinationChainName}-${destinationTokenSymbol}`;
};
