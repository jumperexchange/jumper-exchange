import type { ExtendedChain } from '@lifi/types';
import {
  Link as MuiLink,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { BridgePageContainer } from '@/app/ui/bridge/BridgePage.style';
import type { Token } from '@lifi/sdk';
import { currencyFormatter } from '@/utils/formatNumbers';

function buildExplorerLink(blockExplorerUrls: string[] = [], address: string) {
  if (blockExplorerUrls.length === 0) {
    return address;
  }

  return (
    <MuiLink
      component={Link}
      target="_blank"
      href={`${blockExplorerUrls[0]}/tokens/${address}`}
    >
      {address}
    </MuiLink>
  );
}

function TokenInfo({
  tokenInfo,
  chainInfo,
}: {
  tokenInfo: Token;
  chainInfo: ExtendedChain;
}) {
  return (
    <BridgePageContainer>
      <Typography variant="h3">
        {tokenInfo.logoURI && (
          <Image
            src={tokenInfo.logoURI}
            alt={tokenInfo.name}
            width={32}
            height={32}
          />
        )}
        {tokenInfo.symbol} / {tokenInfo.name} - Information
      </Typography>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>token address</TableCell>
            <TableCell>
              {buildExplorerLink(
                chainInfo.metamask?.blockExplorerUrls,
                tokenInfo.address,
              )}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>decimals</TableCell>
            <TableCell>{tokenInfo.decimals}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Current USD price</TableCell>
            <TableCell>
              {currencyFormatter('en').format(Number(tokenInfo.priceUSD) ?? 0)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </BridgePageContainer>
  );
}

export default TokenInfo;
