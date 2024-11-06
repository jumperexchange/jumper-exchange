import type { BoxProps } from '@mui/material';
import { alpha, Box, styled, useTheme } from '@mui/material';

interface XPIconBackgroundProps extends BoxProps {
  bgColor?: string;
  size?: number;
}

export const XPIconBackground = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'bgColor' && prop !== 'size',
})<XPIconBackgroundProps>(({ theme, bgColor, size }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: size || 20,
  height: size || 20,
  borderRadius: `${size ? size / 2 : 10}px`,
  backgroundColor: bgColor
    ? bgColor
    : theme.palette.mode === 'light'
      ? theme.palette.primary.main
      : theme.palette.accent1Alt.main,
}));

interface XPIconProps {
  color?: string;
  bgColor?: string;
  size?: number;
  variant?: 'primary' | 'secondary' | 'completed';
}

export const XPIcon = ({
  color,
  bgColor,
  size,
  variant = 'primary',
}: XPIconProps) => {
  const theme = useTheme();
  let iconColor, iconBgColor;
  switch (variant) {
    case 'secondary':
      iconColor =
        theme.palette.mode === 'light'
          ? theme.palette.white.main
          : theme.palette.primary.main;
      iconBgColor =
        theme.palette.mode === 'light'
          ? theme.palette.accent1.main
          : theme.palette.white.main;
      break;
    case 'completed': {
      iconColor = theme.palette.white.main;
      iconBgColor = '#00B849';
      break;
    }
    default:
      iconColor =
        theme.palette.mode === 'light'
          ? theme.palette.primary.main
          : theme.palette.white.main;
      iconBgColor =
        theme.palette.mode === 'light'
          ? alpha(theme.palette.primary.main, 0.08)
          : alpha(theme.palette.primary.main, 0.42);
      break;
  }

  return (
    <XPIconBackground size={size || 20} bgColor={bgColor ?? iconBgColor}>
      <svg
        width={size ? size * 0.6 : 11}
        height={size ? size * 0.6 : 11}
        fill="none"
        style={{ marginLeft: '5%' }}
        viewBox={`0 0 11 11`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M.378 3.18a.625.625 0 0 0 0 .884L1.814 5.5.378 6.936c-.59.59.295 1.474.884.884l1.436-1.436L4.134 7.82c.59.59 1.474-.294.884-.884L3.581 5.5l1.437-1.437c.59-.589-.294-1.473-.884-.884L2.698 4.616 1.261 3.18a.625.625 0 0 0-.884 0z"
          fill={color ?? iconColor}
        />
        <path
          fill={color ?? iconColor}
          d="M6.441 2.994c-.313 0-.625.313-.625.624V7.37c0 .312.312.625.625.625h.625v-1.25h1.875c1.25 0 1.875-.939 1.875-1.875 0-.938-.625-1.875-1.875-1.875zm.625 1.251h1.875c.47 0 .625.395.625.625 0 .23-.156.625-.625.625H7.066z"
        />
      </svg>
    </XPIconBackground>
  );
};

export const SuperfestXPIcon = ({ size }: XPIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size ?? '32'}
      height={size ?? '32'}
      fill="none"
      viewBox={`0 0 ${size} ${size}`}
    >
      <g clipPath="url(#a)">
        <circle cx="16" cy="16" r="16" fill={'#ffffff'} />
        <path
          fill={'#31007A'}
          d="M6.374 11.374a1.25 1.25 0 0 0 0 1.768l2.872 2.872-2.872 2.872a1.25 1.25 0 0 0 1.768 1.767l2.872-2.872 2.872 2.872a1.25 1.25 0 0 0 1.767-1.767l-2.872-2.872 2.872-2.872a1.25 1.25 0 0 0-1.767-1.768l-2.872 2.872-2.872-2.872a1.25 1.25 0 0 0-1.768 0ZM18 18.5h2.5V21h-1.25c-.625 0-1.25-.625-1.25-1.25V18.5Z"
        />
        <path
          fill={'#31007A'}
          fillRule="evenodd"
          d="M19.25 11c-.625 0-1.25.625-1.25 1.25v6.25h6.25c2.5 0 3.75-1.875 3.75-3.75S26.75 11 24.25 11h-5Zm5 2.5H20.5V16h3.75c.938 0 1.25-.79 1.25-1.25 0-.46-.313-1.25-1.25-1.25Z"
          clipRule="evenodd"
        />
      </g>
      <defs>
        <clipPath id="a">
          <path fill="#fff" d="M0 0h32v32H0z" />
        </clipPath>
      </defs>
    </svg>
  );
};
