import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';

export const StyledTableContainer = styled(Stack)(({ theme }) => ({
  gap: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    gap: theme.spacing(1),
    padding: theme.spacing(1.5),
    background: (theme.vars || theme).palette.surface1.main,
    boxShadow: theme.shadows[3],
    borderRadius: `${theme.shape.borderRadius}px`,
  },
}));

interface StyledCardProps {
  disableInteraction?: boolean;
}

export const StyledCard = styled(Stack, {
  shouldForwardProp: (prop) => prop !== 'disableInteraction',
})<StyledCardProps>(({ theme, disableInteraction }) => ({
  borderRadius: `${theme.shape.borderRadius}px`,
  boxShadow: theme.shadows[3],
  background: (theme.vars || theme).palette.surface1.main,
  padding: theme.spacing(1.5),

  cursor: disableInteraction ? 'default' : 'pointer',

  '& > :first-child': {
    transition: 'background-color 300ms ease-in-out',
  },
  '&:not(:has([data-hint-hover-active]))': {
    '&:hover, &:focus-visible, &:focus': {
      '& > :first-child': {
        backgroundColor: (theme.vars || theme).palette.alpha100.main,
      },
    },
  },

  [theme.breakpoints.up('sm')]: {
    boxShadow: 'none',
    borderRadius: 0,
    padding: 0,
  },
}));

export const StyledRowContainer = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(1.5),
  gap: theme.spacing(3),
  borderRadius: `${theme.shape.borderRadius}px`,
}));

export const StyledRowSection = styled(Stack)(({ theme }) => ({
  gap: theme.spacing(1),
}));

export const StyledPairRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
}));

export const StyledValueCell = styled(Box)({
  flex: '1 1 0',
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
});

export const StyledColumnHeaderDivider = styled(Box)(({ theme }) => ({
  height: '1px',
  backgroundColor: (theme.vars || theme).palette.alpha100.main,
}));

export const StyledDesktopRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1.5),
  borderRadius: `${theme.shape.borderRadius}px`,
}));

export const StyledTableHeader = styled(Box)(({ theme }) => ({
  display: 'none',
  padding: theme.spacing(1, 1.5),
  [theme.breakpoints.up('sm')]: {
    display: 'flex',
  },
}));
