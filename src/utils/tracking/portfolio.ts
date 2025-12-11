import {
  calculateTotalPrice,
  mapPositionGroupsToProtocolData,
  sortAssetsByPrice,
} from '@/components/composite/AssetOverviewCard/utils';
import type { DefiPosition } from '@/types/jumper-backend';
import type { MinimalToken } from '@/types/tokens';
import type { ChainId } from '@lifi/widget';
import { TrackingEventParameter } from 'src/const/trackingKeys';
import type { CacheToken } from 'src/types/portfolio';

const FLEXIBLE_STABLE_COINS_REGEX =
  /^.*(USD|EUR|XAU|YEN|IDR|CHF|CAD|CNH|MXN).*$/;

const FIXED_STABLE_COINS_REGEX =
  /^(DAI|GHO|MNEE|AMPL|FEI|DJED|VAI|FLX|STDN|ESD|BAC|BUCK|DOLA|BRZ|QGOLD|MIM|FXD|ZARP|EDLC|ONC|MTR|MIMATIC|BLC|JPYC|SBC|KBC|TRYB|PAR|ISR|GYD|UXD)$/;

export const parsePortfolioDataToTrackingData = (
  portfolioTotalBalanceUSD: number,
  tokens: CacheToken[],
  getNativeTokenAddresses: (chainIds: ChainId[]) => string[],
) => {
  const numberOfTokens = tokens.length;

  // Single pass to collect all data
  const chainIds = new Set<ChainId>();
  const portfolioNativeTokensAddresses = new Set<string>();
  let nativeTokensBalanceUSD = 0;
  let stableTokensBalanceUSD = 0;
  let otherTokensBalanceUSD = 0;

  for (const token of tokens) {
    for (const chain of token.chains) {
      chainIds.add(chain.chainId);
    }
  }

  const nativeTokenAddresses = getNativeTokenAddresses(Array.from(chainIds));
  nativeTokenAddresses.forEach((addr) =>
    portfolioNativeTokensAddresses.add(addr),
  );

  for (const token of tokens) {
    const balance = token.cumulatedTotalUSD ?? 0;

    if (portfolioNativeTokensAddresses.has(token.address ?? '')) {
      nativeTokensBalanceUSD += balance;
    } else if (
      FIXED_STABLE_COINS_REGEX.test(token.symbol) ||
      FLEXIBLE_STABLE_COINS_REGEX.test(token.symbol)
    ) {
      stableTokensBalanceUSD += balance;
    } else {
      otherTokensBalanceUSD += balance;
    }
  }

  return {
    [TrackingEventParameter.PortfolioTotalBalanceUSD]:
      portfolioTotalBalanceUSD.toFixed(2),
    [TrackingEventParameter.PortfolioNumberOfTokens]: numberOfTokens,
    [TrackingEventParameter.PortfolioNumberOfChains]: chainIds.size,
    [TrackingEventParameter.PortfolioNativeTokensBalanceUSD]:
      nativeTokensBalanceUSD.toFixed(2),
    [TrackingEventParameter.PortfolioStableTokensBalanceUSD]:
      stableTokensBalanceUSD.toFixed(2),
    [TrackingEventParameter.PortfolioOtherTokensBalanceUSD]:
      otherTokensBalanceUSD.toFixed(2),
  };
};

export const parseEarnPortfolioDataToTrackingData = (
  addresses: string[],
  tokens: MinimalToken[],
  defiPositionGroups: DefiPosition[][],
) => {
  const protocolGroups = mapPositionGroupsToProtocolData(defiPositionGroups);
  const sortedProtocolGroups = sortAssetsByPrice(protocolGroups);
  const sortedTokens = sortAssetsByPrice(tokens);

  const top3ProtocolGroups = sortedProtocolGroups.slice(0, 3);
  const top3Tokens = sortedTokens.slice(0, 3);

  const tokensOverallPriceInUSD = calculateTotalPrice(tokens);
  const positionsOverallPriceInUSD = calculateTotalPrice(protocolGroups);

  const totalBalanceUSD = tokensOverallPriceInUSD + positionsOverallPriceInUSD;

  const chainIds = new Set<ChainId>();

  for (const token of tokens) {
    chainIds.add(token.chain.chainId);
    for (const relatedToken of token.relatedTokens ?? []) {
      chainIds.add(relatedToken.chain.chainId);
    }
  }

  for (const positionGroup of defiPositionGroups) {
    for (const position of positionGroup) {
      chainIds.add(position.chain.chainId);
    }
  }

  return {
    [TrackingEventParameter.PortfolioTotalBalanceUSD]:
      totalBalanceUSD.toFixed(2),
    [TrackingEventParameter.PortfolioTokenAmountUSD]:
      tokensOverallPriceInUSD.toFixed(2),
    [TrackingEventParameter.PortfolioPositionsAmountUSD]:
      positionsOverallPriceInUSD.toFixed(2),
    [TrackingEventParameter.PortfolioNumberOfChains]: chainIds.size,
    [TrackingEventParameter.PortfolioTop3Tokens]: JSON.stringify(
      top3Tokens.map((token) => ({
        [TrackingEventParameter.TokenName]: token.symbol,
        [TrackingEventParameter.TokenTotalPriceUSD]:
          token.totalPriceUSD.toFixed(2),
      })),
    ),
    [TrackingEventParameter.PortfolioTop3Protocols]: JSON.stringify(
      top3ProtocolGroups.map((group) => ({
        [TrackingEventParameter.ProtocolName]: group.protocol.name,
        [TrackingEventParameter.ProtocolTotalPriceUSD]:
          group.totalPriceUSD.toFixed(2),
      })),
    ),
    [TrackingEventParameter.WalletAddresses]: addresses.join(','),
  };
};
