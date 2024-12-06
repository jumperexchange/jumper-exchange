import type { BoxProps } from '@mui/material';
import { alpha, Box, styled, useTheme } from '@mui/material';

interface XPIconHeaderBackgroundProps extends BoxProps {
  bgColor?: string;
  size?: number;
}

export const XPIconHeaderBackground = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'bgColor' && prop !== 'size',
})<XPIconHeaderBackgroundProps>(({ theme, bgColor, size }) => ({
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

interface XPIconHeaderProps {
  color?: string;
  bgColor?: string;
  size?: number;
  variant?: 'primary' | 'secondary' | 'completed';
}

export const XPIconHeader = ({
  color,
  bgColor,
  size,
  variant = 'primary',
}: XPIconHeaderProps) => {
  const theme = useTheme();
  let iconColor, iconBgColor;
  switch (variant) {
    case 'secondary':
      iconColor = theme.palette.white.main;
      iconBgColor = theme.palette.accent1.main;

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
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="10" cy="10" r="10" fill="#31007A" />
      <path
        d="M5.18696 7.68696C4.94289 7.93104 4.94289 8.32677 5.18696 8.57085L6.62298 10.0069L5.18696 11.4429C4.94289 11.687 4.94289 12.0827 5.18696 12.3268C5.43104 12.5708 5.82677 12.5708 6.07085 12.3268L7.50686 10.8907L8.94286 12.3267C9.18694 12.5708 9.58267 12.5708 9.82674 12.3267C10.0708 12.0827 10.0708 11.6869 9.82674 11.4429L8.39075 10.0069L9.82674 8.57087C10.0708 8.32679 10.0708 7.93106 9.82674 7.68698C9.58267 7.4429 9.18694 7.4429 8.94286 7.68698L7.50686 9.12298L6.07085 7.68696C5.82677 7.44289 5.43104 7.44289 5.18696 7.68696Z"
        fill="white"
      />
      <path
        d="M10.625 11.25H11.875V12.5H11.25C10.9375 12.5 10.625 12.1875 10.625 11.875V11.25Z"
        fill="white"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M11.25 7.5C10.9375 7.5 10.625 7.8125 10.625 8.125V11.25H13.75C15 11.25 15.625 10.3125 15.625 9.375C15.625 8.4375 15 7.5 13.75 7.5H11.25ZM13.75 8.75H11.875V10H13.75C14.2188 10 14.375 9.60512 14.375 9.375C14.375 9.14488 14.2188 8.75 13.75 8.75Z"
        fill="white"
      />
    </svg>
  );
};
