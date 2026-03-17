import {
  AppPaths,
  JUMPER_BRIDGE_PATH_DELIMITER,
  JUMPER_BRIDGE_PATH_SOURCE_DESTINATION_DELIMITER,
} from '@/const/urls';
import { slugify } from './urls/slugify';
import type { ExtendedChain, Token } from '@lifi/sdk';

export const buildBridgeSegments = (
  sourceChainName: string,
  sourceTokenSymbol: string,
  destinationChainName: string,
  destinationTokenSymbol: string,
): string =>
  [
    sourceChainName,
    sourceTokenSymbol,
    JUMPER_BRIDGE_PATH_SOURCE_DESTINATION_DELIMITER,
    destinationChainName,
    destinationTokenSymbol,
  ].join(JUMPER_BRIDGE_PATH_DELIMITER);

export const getBridgeUrl = (
  sourceChain: ExtendedChain,
  sourceToken: Token,
  destinationChain: ExtendedChain,
  destinationToken: Token,
) =>
  `${AppPaths.Bridge}/${buildBridgeSegments(
    slugify(sourceChain.name),
    slugify(sourceToken.symbol),
    slugify(destinationChain.name),
    slugify(destinationToken.symbol),
  )}`;
