import type { BoxProps } from '@mui/material';
import { alpha, Box, styled, useTheme } from '@mui/material';

interface RANKIconProps {
  color?: string;
  bgColor?: string;
  size?: number;
  variant?: 'primary' | 'secondary' | 'completed';
}

export const RANKIcon = ({
  color,
  bgColor,
  size,
  variant = 'primary',
}: RANKIconProps) => {
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
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M8.75 10.4689L8.75 9.53142H9.375V8.75017L8.75 8.75024V8.12524C8.75 7.81274 8.4375 7.50024 8.125 7.50024H7.5V8.75024H6.25V7.50024H5.625C5.3125 7.50024 5 7.81274 5 8.12524V8.75024H4.375V9.53142H5V10.4689H4.375V11.2502H5V11.8752C5 12.1877 5.3125 12.5002 5.625 12.5002H6.25V11.2502H7.5V12.5002H8.125C8.4375 12.5002 8.75 12.1877 8.75 11.8752V11.2502H9.375V10.4689H8.75ZM7.5 9.53142H6.25V10.4689H7.5V9.53142Z"
        fill="white"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M15 10.4689L15 9.53142H15.625V8.75017L15 8.75024V8.12524C15 7.81274 14.6875 7.50024 14.375 7.50024H13.75V8.75024H12.5V7.50024H11.875C11.5625 7.50024 11.25 7.81274 11.25 8.12524V8.75024H10.625V9.53142H11.25V10.4689H10.625V11.2502H11.25V11.8752C11.25 12.1877 11.5625 12.5002 11.875 12.5002H12.5V11.2502H13.75V12.5002H14.375C14.6875 12.5002 15 12.1877 15 11.8752V11.2502H15.625V10.4689H15ZM13.75 9.53142H12.5V10.4689H13.75V9.53142Z"
        fill="white"
      />
    </svg>
  );
};
