import { styled } from '@mui/material/styles';
import { motion } from 'motion/react';

export const AnimatedBackgroundImageContainer = styled(motion.div)({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: -1,
  overflow: 'hidden',
});
