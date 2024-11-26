import { Box, styled } from '@mui/material';
import Image from 'next/image';

export const BeraChainWelcomeIllustrations = styled(Box)(() => ({
  aspectRatio: 1.3,
  position: 'absolute',
  padding: 0,
  top: 'calc(60vh - 80px)',
  width: '100%',
  height: 'auto',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: 474,
}));

export const BerachainWelcomeBear = styled(Image)(() => ({
  position: 'absolute',
  aspectRatio: 0.8,
  height: '100%',
  width: 'auto',
}));
