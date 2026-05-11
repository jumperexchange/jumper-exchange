import type { SDKProvider, Token, TokenAmount } from '@lifi/sdk';
import type {
  SolanaProviderOptions,
  SolanaSDKProvider,
} from '@lifi/sdk-provider-solana';
import { SolanaProvider } from '@lifi/sdk-provider-solana';
import { partition } from 'lodash';
import { getProxyTokenBalances } from '@/app/lib/getProxyTokenBalances';

type GetSolanaBalance = SDKProvider['getBalance'];

const isProxyToken = (token: Token) => {
  return token.address.startsWith('proxy:');
};

async function jumperGetBalance(
  walletAddress: string,
  tokens: Token[],
): Promise<TokenAmount[]> {
  if (!tokens.length) {
    return [];
  }

  // Synthetic, truthy slot stamp: @lifi/widget keeps balances in a loading
  // state until every TokenAmount has a non-zero blockNumber. We have no real
  // Solana slot for proxy tokens, so we mint a wall-clock millis value -
  // always truthy, monotonically increasing, obviously synthetic in logs.
  // See widget's `getTokenBalancesWithRetry` for implementation details.
  const blockNumber = BigInt(Date.now());

  try {
    const responseTokens = await getProxyTokenBalances({
      address: walletAddress,
      chainType: 'SVM',
      tokens: tokens.map((t) => t.address),
    });

    return responseTokens.map(
      ({ amount, ...token }): TokenAmount => ({
        ...token,
        amount: amount != null ? BigInt(amount) : 0n,
        blockNumber,
      }),
    );
  } catch {
    return tokens.map((t): TokenAmount => ({ ...t, amount: 0n, blockNumber }));
  }
}

export const JumperSolanaProvider = (
  options?: SolanaProviderOptions,
): SolanaSDKProvider => {
  const lifiProvider = SolanaProvider(options);
  const lifiGetBalance: GetSolanaBalance = lifiProvider.getBalance;

  const overrideGetBalances: GetSolanaBalance = async (
    client,
    walletAddress,
    tokens,
  ) => {
    const [proxyTokens, regularTokens] = partition(tokens, isProxyToken);

    const [regularBalances, proxyBalances] = await Promise.all([
      lifiGetBalance(client, walletAddress, regularTokens),
      jumperGetBalance(walletAddress, proxyTokens),
    ]);

    return [...regularBalances, ...proxyBalances];
  };

  return {
    ...lifiProvider,
    getBalance: overrideGetBalances,
  };
};
