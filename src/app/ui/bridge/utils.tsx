import { currencyFormatter } from '@/utils/formatNumbers';
import { getChainById } from '@/utils/tokenAndChain';
import type { ChainId } from '@lifi/sdk';
import { type ExtendedChain, type Token } from '@lifi/sdk';
import { Link as MuiLink } from '@mui/material';
import Link from 'next/link';

export function buildExplorerLink(
  blockExplorerUrls: string[] = [],
  address: string,
  chainId?: ChainId,
) {
  if (blockExplorerUrls.length === 0) {
    return address;
  }

  return (
    <MuiLink
      sx={(theme) => ({
        color: theme.palette.text.primary,
      })}
      component={Link}
      target="_blank"
      href={`${blockExplorerUrls[0]}token/${address}`}
      style={{
        display: 'block',
        maxWidth: '100%',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}
    >
      {address}
    </MuiLink>
  );
}

export function getChainInfoData(chainInfo: ExtendedChain) {
  return [
    {
      id: 'native-token',
      label: 'Native token',
      value: chainInfo.nativeToken.symbol,
    },
    { id: 'chain-type', label: 'Chain type', value: chainInfo.chainType },
    { id: 'chain-id', label: 'Chain id', value: chainInfo.id },
    {
      id: 'block-explorer-urls',
      label: 'Block explorer urls',
      value: chainInfo.metamask?.blockExplorerUrls?.map((blockExplorerUrl) => (
        <MuiLink
          sx={(theme) => ({
            color: theme.palette.text.primary,
            marginRight: 2,
          })}
          component={Link}
          target="_blank"
          href={blockExplorerUrl}
          key={blockExplorerUrl}
          style={{ overflowWrap: 'break-word' }}
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
    { id: 'symbol', label: 'Symbol', value: tokenInfo.symbol },
    {
      id: 'token-address',
      label: 'Token address',
      value: buildExplorerLink(
        chain?.metamask?.blockExplorerUrls,
        tokenInfo.address,
        tokenInfo.chainId,
      ),
    },
    { id: 'decimals', label: 'Decimals', value: tokenInfo.decimals },
    {
      id: 'current-usd-price',
      label: 'Current USD price',
      value: currencyFormatter('en', { currency: 'USD' })(tokenInfo.priceUSD),
    },
  ];
}
