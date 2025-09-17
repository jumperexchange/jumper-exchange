import { ChainId } from '@lifi/widget';
import { TrackingEventParameter } from 'src/const/trackingKeys';
import { CacheToken } from 'src/types/portfolio';

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
