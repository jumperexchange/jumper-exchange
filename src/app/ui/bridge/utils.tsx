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
      sx={(theme) => ({
        color: theme.palette.text.primary,
      })}
      component={Link}
      target="_blank"
      href={`${blockExplorerUrls[0]}tokens/${address}`} // todo: on OP it needs to be "token/..."
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
    { label: 'Native token', value: chainInfo.nativeToken.symbol },
    { label: 'Chain type', value: chainInfo.chainType },
    { label: 'Chain id', value: chainInfo.id },
    {
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
