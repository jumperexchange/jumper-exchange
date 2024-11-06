import { styled } from '@mui/material';
import Link from 'next/link';

export const LeaderboardUserEntryBox = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: 'inherit',
  '&:hover': {
    textDecoration: 'none',
  },
  pointerEvents: 'auto',
  boxShadow: theme.palette.shadowLight.main,
  borderRadius: '24px',
}));
