'use client';

import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import { getSurfaceBorder } from '@/theme/utils/getSurfaceBorder';
import { Link } from 'src/components/Link/Link';

export const NavDropdownPaper = styled(Paper)(({ theme }) => ({
  background: (theme.vars || theme).palette.surface1.main,
  border: getSurfaceBorder(theme, 'surface1'),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
  padding: theme.spacing(1),
  minWidth: 180,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5),
}));

interface NavDropdownLinkItemProps {
  isActive?: boolean;
}

export const NavDropdownLinkItem = styled(Link, {
  shouldForwardProp: (prop) => prop !== 'isActive',
})<NavDropdownLinkItemProps>(({ theme, isActive }) => ({
  ...theme.typography.bodyMediumStrong,
  color: isActive
    ? (theme.vars || theme).palette.text.primary
    : (theme.vars || theme).palette.alpha600.main,
  textDecoration: 'none',
  padding: theme.spacing(1.25, 1.5),
  borderRadius: theme.shape.buttonBorderRadius,
  transition: 'background-color 0.15s ease, color 0.15s ease',
  ...(isActive && {
    background: (theme.vars || theme).palette.surface2.main,
  }),
  '&:hover': {
    backgroundColor: (theme.vars || theme).palette.alphaLight100.main,
    color: (theme.vars || theme).palette.text.primary,
  },
}));
