'use client';

import { styled } from '@mui/material/styles';
import Image from 'next/image';

export const LogoPartnerImage = styled(Image)(({ theme }) => ({
  maxHeight: 32,
  width: 'auto',
}));
