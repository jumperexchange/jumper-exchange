import type { BoxProps } from '@mui/material';
import { Box, styled } from '@mui/material';

export const InstructionsAccordionContainer = styled(Box)<BoxProps>(
  ({ theme }) => ({
    margin: theme.spacing(4, 0),
  }),
);
