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

function ChainInfo({ chainInfo }: { chainInfo: ExtendedChain }) {
  return (
    <BridgePageContainer>
      <Typography variant="h3">
        {chainInfo.logoURI && (
          <Image
            src={chainInfo.logoURI}
            alt={chainInfo.name}
            width={32}
            height={32}
          />
        )}
        {chainInfo.coin} / {chainInfo.name} - Information
      </Typography>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>Native token</TableCell>
            <TableCell>{chainInfo.nativeToken.symbol}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Chain type</TableCell>
            <TableCell>{chainInfo.chainType}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Chain id</TableCell>
            <TableCell>{chainInfo.id}</TableCell>
          </TableRow>
          {chainInfo.metamask?.blockExplorerUrls && (
            <TableRow>
              <TableCell>Block explorer urls</TableCell>
              <TableCell>
                {chainInfo.metamask?.blockExplorerUrls.map(
                  (blockExplorerUrl) => (
                    <MuiLink
                      sx={{ marginRight: 2 }}
                      component={Link}
                      target="_blank"
                      href={blockExplorerUrl}
                      key={blockExplorerUrl}
                    >
                      {blockExplorerUrl}
                    </MuiLink>
                  ),
                )}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </BridgePageContainer>
  );
}

export default ChainInfo;
