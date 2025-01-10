import {
  Avatar,
  Link as MuiLink,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import { Box } from '@mui/material';
import { InformationCardContainer } from './InformationCard.style';

function buildExplorerLink(blockExplorerUrls: string[] = [], address: string) {
  if (blockExplorerUrls.length === 0) {
    return address;
  }

  return (
    <MuiLink
      color="text.primary"
      component={Link}
      target="_blank"
      href={`${blockExplorerUrls[0]}tokens/${address}`}
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

function InformationCard({
  info,
  data = [],
  type,
}: {
  info: Info;
  data: Data[];
  type: 'Blockchain' | 'Token';
}) {
  return (
    <InformationCardContainer>
      <Typography variant="h3" display="flex" alignItems="center">
        {info.logoURI && (
          <Box display="flex" marginRight={2}>
            <Avatar
              variant="rounded"
              src={info.logoURI}
              alt={info.name}
              sx={{ width: 32, height: 32, borderRadius: 50 }}
            />
          </Box>
        )}
        {info.name} - {type} Information
      </Typography>
      <Table
        sx={(theme) => ({ tableLayout: 'fixed', marginTop: theme.spacing(1) })}
      >
        <TableBody>
          {data.map(({ label, value }, index) => (
            <TableRow key={index}>
              <TableCell style={{ width: '30%' }}>{label}</TableCell>
              <TableCell>{value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </InformationCardContainer>
  );
}

export default InformationCard;
