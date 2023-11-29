import { Box, styled } from '@mui/material';

export const WidgetWrapper = styled(Box)(() => ({
  width: 'fit-content',
  minWidth: '392px',
  margin: ' 0 auto',
  position: 'relative',
  zIndex: 2,
}));

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
}));
