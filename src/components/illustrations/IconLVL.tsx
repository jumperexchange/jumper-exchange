import type { BoxProps } from '@mui/material';
import { alpha, Box, styled, useTheme } from '@mui/material';

interface LVLIconProps {
  color?: string;
  bgColor?: string;
  size?: number;
  variant?: 'primary' | 'secondary' | 'completed';
}

export const LVLIcon = ({
  color,
  bgColor,
  size,
  variant = 'primary',
}: LVLIconProps) => {
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
        d="M13.75 7.5C14.0625 7.5 14.375 7.5 14.375 7.5L14.375 11.25H18.125V11.875C18.125 12.1875 17.8125 12.5 17.5 12.5H13.75C13.4375 12.5 13.125 12.1875 13.125 11.875C13.125 11.875 13.125 8.4375 13.125 8.125C13.125 7.8125 13.4375 7.5 13.75 7.5Z"
        fill="white"
      />
      <path
        d="M7.5 8.12481C7.5 7.8125 7.81242 7.49981 8.12492 7.5H8.75L9.99939 11.25L11.25 7.5L11.8749 7.5C12.1874 7.5 12.4994 7.8125 12.5 8.12481C12.5 8.12481 11.614 10.9375 11.4056 11.5625C11.3015 11.875 10.9369 12.5 9.99939 12.5C9.06189 12.5 8.69709 11.875 8.59314 11.5625C8.38521 10.9375 7.5 8.12481 7.5 8.12481Z"
        fill="white"
      />
      <path
        d="M3.125 7.5C3.4375 7.5 3.75 7.5 3.75 7.5L3.75 11.25H7.5V11.875C7.5 12.1875 7.1875 12.5 6.875 12.5H3.125C2.8125 12.5 2.5 12.1875 2.5 11.875C2.5 11.875 2.5 8.4375 2.5 8.125C2.5 7.8125 2.8125 7.5 3.125 7.5Z"
        fill="white"
      />
    </svg>
  );
};
