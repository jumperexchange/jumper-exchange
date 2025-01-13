import {
  Avatar,
  Box,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';
import { InformationCardContainer } from './InformationCard.style';

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
