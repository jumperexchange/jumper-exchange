import type { PortfolioBalance, WalletToken } from '@/types/tokens';
import type { ChainId } from '@lifi/widget';
import { TrackingEventParameter } from 'src/const/trackingKeys';
import type { SummaryData } from '@/providers/PortfolioProvider/types';
import type { usePortfolioFormatters } from '@/hooks/tokens/usePortfolioFormatters';
import { flatMap } from 'lodash';
import { isChainPortfolioPosition } from '@/providers/PortfolioProvider/utils';

const FLEXIBLE_STABLE_COINS_REGEX =
  /^.*(USD|EUR|XAU|YEN|IDR|CHF|CAD|CNH|MXN).*$/;

const FIXED_STABLE_COINS_REGEX =
  /^(DAI|GHO|MNEE|AMPL|FEI|DJED|VAI|FLX|STDN|ESD|BAC|BUCK|DOLA|BRZ|QGOLD|MIM|FXD|ZARP|EDLC|ONC|MTR|MIMATIC|BLC|JPYC|SBC|KBC|TRYB|PAR|ISR|GYD|UXD)$/;

export const parsePortfolioDataToTrackingData = (
  portfolioTotalBalanceUSD: number,
  balances: Record<string, PortfolioBalance<WalletToken>[]>,
  getNativeTokenAddresses: (chainIds: ChainId[]) => string[],
  toAggregatedAmountUSD: ReturnType<
    typeof usePortfolioFormatters
  >['toAggregatedAmountUSD'],
) => {
  const numberOfTokens = Object.entries(balances).length;

  const chainIds = new Set<ChainId>();
  const portfolioNativeTokensAddresses = new Set<string>();

  const balancesFlat = flatMap(balances);

  for (const balance of balancesFlat) {
    chainIds.add(balance.token.chainId);
  }

  const nativeTokenAddresses = getNativeTokenAddresses(Array.from(chainIds));
  nativeTokenAddresses.forEach((addr) =>
    portfolioNativeTokensAddresses.add(addr),
  );

  const nativeBalances = [];
  const stableBalances = [];
  const otherBalances = [];

  for (const balance of balancesFlat) {
    if (portfolioNativeTokensAddresses.has(balance.token.address)) {
      nativeBalances.push(balance);
    } else if (
      FIXED_STABLE_COINS_REGEX.test(balance.token.symbol) ||
      FLEXIBLE_STABLE_COINS_REGEX.test(balance.token.symbol)
    ) {
      stableBalances.push(balance);
    } else {
      otherBalances.push(balance);
    }
  }

  const nativeTokensBalanceUSD = toAggregatedAmountUSD(nativeBalances);
  const stableTokensBalanceUSD = toAggregatedAmountUSD(stableBalances);
  const otherTokensBalanceUSD = toAggregatedAmountUSD(otherBalances);

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
  summary: SummaryData,
) => {
  const balancesSummaries = flatMap(summary.balancesBySymbol);
  const balances = flatMap(
    balancesSummaries,
    (balancesSummary) => balancesSummary.balances,
  );

  const protocolSummaries = flatMap(summary.positionsByProtocol);
  const positions = flatMap(
    protocolSummaries,
    (protocolSummary) => protocolSummary.positions,
  );

  const top3ProtocolGroups = protocolSummaries.slice(0, 3);
  const top3Tokens = balancesSummaries.slice(0, 3);
  const chainIds = new Set<ChainId>();

  for (const balance of balances) {
    chainIds.add(balance.token.chainId);
  }
  for (const position of positions) {
    if (isChainPortfolioPosition(position)) {
      chainIds.add(position.chain.chainId);
    }
  }
  return {
    [TrackingEventParameter.PortfolioTotalBalanceUSD]:
      summary.totalPortfolioUsd.toFixed(2),
    [TrackingEventParameter.PortfolioTokenAmountUSD]:
      summary.totalBalancesUsd.toFixed(2),
    [TrackingEventParameter.PortfolioPositionsAmountUSD]:
      summary.totalPositionsUsd.toFixed(2),
    [TrackingEventParameter.PortfolioNumberOfChains]: chainIds.size,
    [TrackingEventParameter.PortfolioTop3Tokens]: JSON.stringify(
      top3Tokens.map((token) => ({
        [TrackingEventParameter.TokenName]: token.balances[0]?.token.symbol,
        [TrackingEventParameter.TokenTotalPriceUSD]: token.totalUsd.toFixed(2),
      })),
    ),
    [TrackingEventParameter.PortfolioTop3Protocols]: JSON.stringify(
      top3ProtocolGroups.map((group) => ({
        [TrackingEventParameter.ProtocolName]:
          group.positions[0]?.protocol.name,
        [TrackingEventParameter.ProtocolTotalPriceUSD]:
          group.totalUsd.toFixed(2),
      })),
    ),
    [TrackingEventParameter.WalletAddresses]: addresses.join(','),
  };
};
