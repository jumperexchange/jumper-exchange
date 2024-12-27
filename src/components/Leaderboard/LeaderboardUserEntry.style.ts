import { styled } from '@mui/material';
import Link from 'next/link';

export const LeaderboardUserEntryBox = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: 'inherit',
  '&:hover': {
    textDecoration: 'none',
  },
  pointerEvents: 'auto',
  borderRadius: '24px',
}));
