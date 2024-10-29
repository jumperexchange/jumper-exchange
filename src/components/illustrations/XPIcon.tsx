import { useTheme } from '@mui/material';

// XPIcon
interface XPIconProps {
  size?: number;
}

export const XPIcon = ({ size }: XPIconProps) => {
  const theme = useTheme();

  return (
    <svg
      width={size ?? 20}
      height={size ?? 20}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx={size ? size / 2 : 10}
        cy={size ? size / 2 : 10}
        r={size ? size / 2 : 10}
        fill={
          theme.palette.mode === 'light'
            ? theme.palette.primary.main
            : theme.palette.accent1Alt.main
        }
      />
      <path
        d="M5.187 7.687a.625.625 0 0 0 0 .884l1.436 1.436-1.436 1.436a.625.625 0 0 0 .884.884l1.436-1.436 1.436 1.436a.625.625 0 1 0 .884-.884L8.39 10.007 9.827 8.57a.625.625 0 0 0-.884-.884L7.507 9.123 6.07 7.687a.625.625 0 0 0-.884 0zM10.625 11.25h1.25v1.25h-.625c-.313 0-.625-.313-.625-.625v-.625z"
        fill="#fff"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.25 7.5c-.313 0-.625.313-.625.625v3.125h3.125c1.25 0 1.875-.938 1.875-1.875 0-.938-.625-1.875-1.875-1.875h-2.5zm2.5 1.25h-1.875V10h1.875c.469 0 .625-.395.625-.625 0-.23-.156-.625-.625-.625z"
        fill="#fff"
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
      viewBox="0 0 32 32"
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
