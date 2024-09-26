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
import { Box } from '@mui/system';

function buildExplorerLink(blockExplorerUrls: string[] = [], address: string) {
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

interface Info {
  logoURI?: string;
  name: string;
}

interface Data {
  label: string;
  value: string | number | JSX.Element | JSX.Element[];
}

function HalfSizeBlock({ info, data = [] }: { info: Info; data: Data[] }) {
  return (
    <BridgePageContainer width={'48.5%'}>
      <Typography variant="h3" display="flex" alignItems="center">
        {info.logoURI && (
          <Box display="flex" marginRight={2}>
            <Image src={info.logoURI} alt={info.name} width={32} height={32} />
          </Box>
        )}
        {info.name} - Information
      </Typography>
      <Table>
        <TableBody>
          {data.map(({ label, value }, index) => (
            <TableRow key={index}>
              <TableCell>{label}</TableCell>
              <TableCell>{value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </BridgePageContainer>
  );
}

export default HalfSizeBlock;
