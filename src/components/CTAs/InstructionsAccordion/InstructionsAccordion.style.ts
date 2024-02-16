import type { BoxProps } from '@mui/material';
import { Box, styled } from '@mui/material';

export const InstructionsAccordionContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'styles',
})<BoxProps>(({ theme }) => ({}));
