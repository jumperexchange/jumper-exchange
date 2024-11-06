import { getSupportedChain } from './get-supported-chain';

export const getExplorerUrl = ({
  chainId,
  value,
  type,
}: {
  chainId: number;
  value: string;
  type: 'tx' | 'address';
}): string => {
  const chain = getSupportedChain(chainId);
  if (!chain) {
    return '';
  }

  const baseUrl = chain.blockExplorers?.default.url || '';

  if (type === 'tx') {
    return `${baseUrl}/tx/${value}`;
  } else if (type === 'address') {
    return `${baseUrl}/address/${value}`;
  } else {
    return baseUrl;
  }
};
