import { styled } from '@mui/material/styles';
import Link from 'next/link';

export const SupportLink = styled(Link)(({ theme }) => ({
  position: 'absolute',
  left: 0,
  bottom: 0,
  margin: theme.spacing(1.5),
}));
