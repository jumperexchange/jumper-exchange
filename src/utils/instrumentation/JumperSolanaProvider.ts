import type { SDKProvider, Token, TokenAmount } from '@lifi/sdk';
import type { SolanaSDKProvider } from '@lifi/sdk-provider-solana';
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

  try {
    const responseTokens = await getProxyTokenBalances({
      address: walletAddress,
      chainType: 'SVM',
      tokens: tokens.map((t) => t.address),
    });

    const tokensByAddress = new Map(responseTokens.map((t) => [t.address, t]));

    return tokens.map((inputToken): TokenAmount => {
      const match = tokensByAddress.get(inputToken.address);
      return {
        ...inputToken,
        amount: match?.amount != null ? BigInt(match.amount) : 0n,
      };
    });
  } catch (error) {
    console.warn('jumperGetBalance failed, returning zero balances', error);
    return tokens.map((t): TokenAmount => ({ ...t, amount: 0n }));
  }
}

export const JumperSolanaProvider = (): SolanaSDKProvider => {
  const lifiProvider = SolanaProvider();
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
