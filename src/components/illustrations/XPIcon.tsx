import type { BoxProps } from '@mui/material';
import { alpha, Box, styled, useTheme } from '@mui/material';

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
      width={28}
      height={28}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 28 28"
      style={{ width: size, height: size }}
    >
      <circle cx={14} cy={14} r={14} fill={bgColor || iconBgColor} />
      <path
        d="M7.262 10.762a.875.875 0 0 0 0 1.237l2.01 2.01-2.01 2.01A.875.875 0 0 0 8.5 17.258l2.01-2.01 2.01 2.01a.875.875 0 1 0 1.238-1.237l-2.01-2.01 2.01-2.01a.875.875 0 1 0-1.238-1.238l-2.01 2.01-2.01-2.01a.875.875 0 0 0-1.238 0zM14.875 15.75h1.75v1.75h-.875c-.438 0-.875-.438-.875-.875v-.875z"
        fill={color || iconColor}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.75 10.5c-.438 0-.875.438-.875.875v4.375h4.375c1.75 0 2.625-1.313 2.625-2.625 0-1.313-.875-2.625-2.625-2.625h-3.5zm3.5 1.75h-2.625V14h2.625c.656 0 .875-.553.875-.875 0-.322-.219-.875-.875-.875z"
        fill={color || iconColor}
      />
    </svg>
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
