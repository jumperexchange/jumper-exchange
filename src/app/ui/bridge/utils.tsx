import { Link as MuiLink } from '@mui/material';
import Link from 'next/link';
import type { ExtendedChain, Token } from '@lifi/sdk';
import { getChainById } from '@/utils/tokenAndChain';
import { currencyFormatter } from '@/utils/formatNumbers';

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

export function getChainInfoData(chainInfo: ExtendedChain) {
  return [
    { label: 'Native token', value: chainInfo.nativeToken.symbol },
    { label: 'Chain type', value: chainInfo.chainType },
    { label: 'Chain id', value: chainInfo.id },
    {
      label: 'Block explorer urls',
      value: chainInfo.metamask?.blockExplorerUrls?.map((blockExplorerUrl) => (
        <MuiLink
          color="text.primary"
          sx={{ marginRight: 2 }}
          component={Link}
          target="_blank"
          href={blockExplorerUrl}
          key={blockExplorerUrl}
        >
          {blockExplorerUrl}
        </MuiLink>
      )),
    },
  ];
}

export function getTokenInfoData(chains: ExtendedChain[], tokenInfo: Token) {
  const chain = getChainById(chains, tokenInfo.chainId);
  return [
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
      value: currencyFormatter('en').format(Number(tokenInfo.priceUSD) ?? 0),
    },
  ];
}
