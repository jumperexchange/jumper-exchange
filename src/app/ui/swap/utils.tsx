import { currencyFormatter } from '@/utils/formatNumbers';
import { getChainById } from '@/utils/tokenAndChain';
import type { ExtendedChain, Token } from '@lifi/sdk';
import { Link as MuiLink } from '@mui/material';
import Link from 'next/link';

export function buildExplorerLink(
  blockExplorerUrls: string[] = [],
  address: string,
) {
  if (blockExplorerUrls.length === 0) {
    return address;
  }

  return (
    <MuiLink
      color="text.primary"
      component={Link}
      target="_blank"
      href={`${blockExplorerUrls[0]}/tokens/${address}`}
    >
      {address}
    </MuiLink>
  );
}

export function getTokenInfoData(chains: ExtendedChain[], tokenInfo: Token) {
  const chain = getChainById(chains, tokenInfo.chainId);
  return [
    { label: 'Symbol', value: tokenInfo.symbol },
    {
      label: 'Token address',
      value: buildExplorerLink(
        chain?.metamask?.blockExplorerUrls,
        tokenInfo.address,
      ),
    },
    { label: 'Decimals', value: tokenInfo.decimals },
    {
      label: 'Current USD price',
      value: currencyFormatter('en', { currency: 'USD' })(tokenInfo.priceUSD),
    },
  ];
}
