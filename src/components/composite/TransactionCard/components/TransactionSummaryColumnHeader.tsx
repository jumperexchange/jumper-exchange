import type { FC } from 'react';
import Typography from '@mui/material/Typography';
import type { TransactionSummaryRowConfig } from '../types';
import {
  StyledColumnHeaderDivider,
  StyledRowSection,
} from '../TransactionTable.styles';

interface TransactionSummaryColumnHeaderProps {
  label: string;
  config: TransactionSummaryRowConfig;
}

export const TransactionSummaryColumnHeader: FC<
  TransactionSummaryColumnHeaderProps
> = ({ label, config }) => (
  <StyledRowSection>
    <Typography
      variant={config.descriptionVariant}
      color="textSecondary"
      sx={{ fontWeight: 500 }}
    >
      {label}
    </Typography>
    <StyledColumnHeaderDivider />
  </StyledRowSection>
);
