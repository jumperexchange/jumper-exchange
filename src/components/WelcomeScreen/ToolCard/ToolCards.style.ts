'use client';
import { styled } from '@mui/material';

export const ToolCardsContainer = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(4),
  flexWrap: 'wrap',
  display: 'flex',
  justifyContent: 'center',
  gap: theme.spacing(2),
  [`@media screen and (max-height: 600px)`]: {
    display: 'none',
  },
}));
