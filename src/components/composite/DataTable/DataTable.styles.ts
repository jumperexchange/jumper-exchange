import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';

export const TABLE_HEADER_CELL_SX = {
  color: 'text.secondary',
  borderBottom: '1px solid',
  borderColor: 'divider',
  height: 40,
  py: 0,
  px: 1.5,
  pr: 2,
  typography: 'bodySmall',
  fontWeight: 400,
  textTransform: 'none',
} as const;

export const TABLE_CELL_SX = {
  borderBottom: '1px solid',
  borderColor: 'divider',
  py: 0,
  px: 1.5,
  pr: 2,
  verticalAlign: 'middle',
} as const;

export const DataTableContainer = styled(Stack)(({ theme }) => ({
  gap: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    gap: theme.spacing(1),
    padding: theme.spacing(1.5),
    background: (theme.vars || theme).palette.surface1.main,
    boxShadow: theme.shadows[3],
    borderRadius: `${theme.shape.borderRadius}px`,
  },
}));

export const DataTableHeader = styled(Box)(({ theme }) => ({
  display: 'none',
  padding: theme.spacing(1, 1.5),
  [theme.breakpoints.up('sm')]: {
    display: 'flex',
  },
}));

export const DataTableValueCell = styled(Box)({
  flex: '1 1 0',
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
});

export const DataTableDesktopRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1.5),
  borderRadius: `${theme.shape.borderRadius}px`,
}));

export const DataTableMobileRowContainer = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(1.5),
  gap: theme.spacing(3),
  borderRadius: `${theme.shape.borderRadius}px`,
}));

export const DataTableMobileRowSection = styled(Stack)(({ theme }) => ({
  gap: theme.spacing(1),
}));

export const DataTableMobilePairRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
}));

export const DataTableRowCard = styled(Stack, {
  shouldForwardProp: (prop) => prop !== 'isInteractive',
})<{ isInteractive?: boolean }>(({ theme, isInteractive }) => ({
  borderRadius: `${theme.shape.borderRadius}px`,
  boxShadow: theme.shadows[3],
  background: (theme.vars || theme).palette.surface1.main,
  padding: theme.spacing(1.5),
  cursor: isInteractive ? 'pointer' : 'default',
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
