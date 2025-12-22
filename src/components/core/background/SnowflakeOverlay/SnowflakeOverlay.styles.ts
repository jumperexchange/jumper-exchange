import AcUnitRoundedIcon from '@mui/icons-material/AcUnitRounded';
import { keyframes, styled } from '@mui/material/styles';

export const SnowflakeOverlayContainer = styled('div')(() => ({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  pointerEvents: 'none',
  overflow: 'hidden',
  zIndex: 1,
  '@media (prefers-reduced-motion: reduce)': {
    display: 'none',
  },
}));

const snowfall = keyframes`
  0% {
    transform: translate3d(0, -10vh, 0) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translate3d(0, 110vh, 0) rotate(720deg);
    opacity: 0.3;
  }
`;

const sway = keyframes`
  0%, 100% {
    margin-left: 0;
  }
  50% {
    margin-left: 30px;
  }
`;

export interface SnowflakeStyleProps {
  $left: number;
  $size: number;
  $duration: number;
  $delay: number;
  $swayDuration: number;
}

export const Snowflake = styled(AcUnitRoundedIcon, {
  shouldForwardProp: (prop) =>
    !['$left', '$size', '$duration', '$delay', '$swayDuration'].includes(
      prop as string,
    ),
})<SnowflakeStyleProps>(
  ({ $left, $size, $duration, $delay, $swayDuration }) => ({
    position: 'absolute',
    top: '-5vh',
    left: `${$left}%`,
    fontSize: `${$size}rem`,
    color: 'rgba(255, 255, 255, 0.8)',
    filter: 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.5))',
    willChange: 'transform, opacity',
    animation: `${snowfall} ${$duration}s linear ${$delay}s infinite, ${sway} ${$swayDuration}s ease-in-out ${$delay}s infinite`,
  }),
);
