import type { SDKProvider, Token } from '@lifi/sdk';
import type { SolanaSDKProvider } from '@lifi/sdk-provider-solana';
import { SolanaProvider } from '@lifi/sdk-provider-solana';
import { partition } from 'lodash';

type GetSolanaBalance = SDKProvider['getBalance'];

const isProxyToken = (token: Token) => {
  return token.address.startsWith('proxy:');
};

const jumperGetBalance: GetSolanaBalance = async (
  client,
  walletAddress,
  tokens,
) => {
  console.log('jumperGetBalance', client, walletAddress, tokens);
  return [];
};

export const JumperSolanaProvider = (): SolanaSDKProvider => {
  const lifiProvider = SolanaProvider();
  const lifiGetBalance: GetSolanaBalance = lifiProvider.getBalance;

  const overrideGetBalances: GetSolanaBalance = async (
    client,
    walletAddress,
    tokens,
  ) => {
    console.log('overrideGetBalances', client, walletAddress, tokens);
    const [proxyTokens, regularTokens] = partition(tokens, isProxyToken);

    const regularBalances = await lifiGetBalance(
      client,
      walletAddress,
      regularTokens,
    );
    const proxyBalances = await jumperGetBalance(
      client,
      walletAddress,
      proxyTokens,
    );

    return [...regularBalances, ...proxyBalances];
  };

  return {
    ...lifiProvider,
    getBalance: overrideGetBalances,
  };
};
