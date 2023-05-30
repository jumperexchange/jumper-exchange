import { styled } from '@mui/material';

export const GlowBackground = styled('span')(({ theme }) => ({
  position: 'absolute',
  opacity: 0,
  zIndex: -1,
  minWidth: '440px',
  minHeight: '440px',
  width: '50vw',
  height: '50vw',
  transform: 'translateX(-50%)',
  left: '50%',
  top: '80px',
  // background:
  //   'radial-gradient(50% 50% at 50% 50%, #8700B8 0%, rgba(255, 255, 255, 0) 100%)',
  // transitionProperty: 'opacity',
  // transitionDuration: '.3s',
  // transitionTimingFunction: 'ease-in-out',
}));
