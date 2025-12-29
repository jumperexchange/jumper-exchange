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
    transform: translateX(0);
  }
  50% {
    transform: translateX(30px);
  }
`;

export interface SnowflakeWrapperStyleProps {
  $left: number;
  $delay: number;
  $swayDuration: number;
}

export const SnowflakeWrapper = styled('div', {
  shouldForwardProp: (prop) =>
    !['$left', '$delay', '$swayDuration'].includes(prop as string),
})<SnowflakeWrapperStyleProps>(({ $left, $delay, $swayDuration }) => ({
  position: 'absolute',
  top: '-5vh',
  left: `${$left}%`,
  willChange: 'transform',
  animation: `${sway} ${$swayDuration}s ease-in-out ${$delay}s infinite`,
}));

export interface SnowflakeStyleProps {
  $size: number;
  $duration: number;
  $delay: number;
}

export const Snowflake = styled(AcUnitRoundedIcon, {
  shouldForwardProp: (prop) =>
    !['$size', '$duration', '$delay'].includes(prop as string),
})<SnowflakeStyleProps>(({ $size, $duration, $delay, theme }) => ({
  display: 'block',
  fontSize: `${$size}rem`,
  color: `color-mix(in srgb, ${(theme.vars || theme).palette.white.main} / 80%, transparent)`,
  filter: `drop-shadow(0 0 4px color-mix(in srgb, ${(theme.vars || theme).palette.white.main} / 50%, transparent))`,
  willChange: 'transform, opacity',
  animation: `${snowfall} ${$duration}s linear ${$delay}s infinite`,
  ...theme.applyStyles('light', {
    color: (theme.vars || theme).palette.lavenderDark[0],
    filter: `drop-shadow(0 0 4px ${(theme.vars || theme).palette.lavenderLight[400]})`,
  }),
}));
