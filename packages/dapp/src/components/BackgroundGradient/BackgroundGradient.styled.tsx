import { styled } from '@mui/material/styles';
export interface BackgroundGradientContainerProps
  extends Omit<HTMLDivElement, 'isDarkMode' | 'children'> {
  children?: JSX.Element | JSX.Element[] | React.ReactNode;
}
export interface BackgroundGradientProps
  extends Omit<HTMLSpanElement, 'isDarkMode' | 'children' | 'className'> {
  isDarkMode?: boolean;
  children?: JSX.Element | JSX.Element[] | React.ReactNode;
  className?: string;
}

export const BackgroundGradientContainer = styled('div')<any>(({ theme }) => ({
  position: 'absolute',
  overflow: 'hidden',
  pointerEvents: 'none',
  background: theme.palette.bg.main,
  height: '100vh',
  width: '100vw',
  left: 0,
  bottom: 0,
  right: 0,
  top: 0,
  zIndex: -1,
}));

export const BackgroundGradient = styled('span')<any>(({ theme }) => ({
  content: '""',
  position: 'absolute',
  width: '100vh',
  height: '100vh',
  opacity: '0.12',
}));

export const BackgroundGradientBottomLeft = styled(BackgroundGradient, {
  shouldForwardProp: (prop) => prop !== 'isDarkMode',
})<BackgroundGradientProps>(({ theme, isDarkMode }) => ({
  transform: 'translate(-50%,50%) scale(1.5)',
  left: 0,
  opacity: theme.palette.mode === 'dark' ? '0.24' : '0.12',
  bottom: 0,
  background:
    'radial-gradient(50% 50% at 50% 50%, #1969FF 0%, rgba(255, 255, 255, 0) 100%)',
}));

export const BackgroundGradientBottomRight = styled(BackgroundGradient, {
  shouldForwardProp: (prop) => prop !== 'isDarkMode',
})<BackgroundGradientProps>(({ theme, isDarkMode }) => ({
  transform: 'translate(50%,50%) scale(1.5)',
  right: 0,
  bottom: 0,
  opacity: theme.palette.mode === 'dark' ? '0.24' : '0.12',
  background:
    'radial-gradient(50% 50% at 50% 50%, #E1147B 0%, rgba(255, 255, 255, 0) 100%)',
}));

export const BackgroundGradientTopCenter = styled(BackgroundGradient, {
  shouldForwardProp: (prop) => prop !== 'isDarkMode',
})<BackgroundGradientProps>(({ theme, isDarkMode }) => ({
  transform:
    theme.palette.mode === 'dark'
      ? 'translate(-50%, -50%) scale( calc( 1 + 1 / 3 ))'
      : 'translate(-50%,-50%) scale(1.5)',
  top: 0,
  left: '50%',
  width: theme.palette.mode === 'dark' ? '100vw' : '100vh',
  height: theme.palette.mode === 'dark' ? '100vw' : '100vh',
  opacity: theme.palette.mode === 'dark' ? '0.24' : '0.12',
  background:
    'radial-gradient(50% 50% at 50% 50%, #9747FF 0%, rgba(255, 255, 255, 0) 100%)',
}));
