import { Avatar, Table, TableBody, TableRow, Typography } from '@mui/material';
import { Box } from '@mui/system';
import {
  InformationCardCell,
  InformationCardContainer,
} from './InformationCard.style';

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
  fullWidth,
}: {
  info: Info;
  data: Data[];
  type: 'Blockchain' | 'Token';
  fullWidth?: boolean;
}) {
  return (
    <InformationCardContainer fullWidth={fullWidth}>
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
              <InformationCardCell fullWidth>{label}</InformationCardCell>
              <InformationCardCell fullWidth>{value}</InformationCardCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </InformationCardContainer>
  );
}

export default InformationCard;
