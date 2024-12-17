import {
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { DynamicPagesContainer } from 'src/components/DynamicPagesContainer';

interface Info {
  logoURI?: string;
  name: string;
}

interface Data {
  label: string;
  value: string | number | JSX.Element | JSX.Element[];
}
// should be replaced by <InformationCard> after merging: https://github.com/jumperexchange/jumper-exchange/pull/1557
function HalfSizeBlock({
  info,
  data = [],
  type,
}: {
  info: Info;
  data: Data[];
  type: 'Blockchain' | 'Token';
}) {
  return (
    <DynamicPagesContainer width={'48.5%'}>
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
    </DynamicPagesContainer>
  );
}

export default HalfSizeBlock;
