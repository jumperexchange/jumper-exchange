import type { Breakpoint, Theme } from '@mui/material';

import useMediaQuery from '@mui/material/useMediaQuery';

interface Props {
  theme: Theme;
}

const JumperLogo = ({ theme }: Props) => {
  const mainCol =
    theme.palette.mode === 'light'
      ? theme.palette.accent1.main
      : theme.palette.accent1Alt.main;
  const subCol = theme.palette.accent2.main;

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={128} height={32} fill="none">
      <g clipPath="url(#a)">
        <path
          fill={mainCol}
          d="M18.868 16 6.998 27.869l3.238 3.237a3.052 3.052 0 0 0 4.316 0L27.5 18.158a3.052 3.052 0 0 0 0-4.316l-7.553-7.553-5.395 5.395L18.868 16Z"
        />
        <path
          fill={subCol}
          d="M6.999 4.13 10.236.895a3.052 3.052 0 0 1 4.316 0l3.237 3.237-5.395 5.395L6.999 4.13Z"
        />
      </g>
      <path
        fill={mainCol}
        d="M111.001 11h3V7h9V5a1 1 0 0 0-1-1h-10a1 1 0 0 0-1 1v6Z"
      />
      <path fill={subCol} d="M114.001 16h-2a1 1 0 0 1-1-1v-2h3v3Z" />
      <path
        fill={mainCol}
        d="M100.001 13v-2h6V9h-6V7h9V5a1 1 0 0 0-1-1h-10a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-2h-9ZM83.001 11.5h3V16h-2a1 1 0 0 1-1-1v-3.5Z"
      />
      <path
        fill={mainCol}
        fillRule="evenodd"
        d="M84.001 4a1 1 0 0 0-1 1v8h9a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3h-8Zm7 3h-5v3h5a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1Z"
        clipRule="evenodd"
      />
      <path
        fill={mainCol}
        d="M81.001 5a1 1 0 0 0-1-1h-10a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h2V7h1.5v9h3V7h1.5v9h2a1 1 0 0 0 1-1V5ZM55.002 5a1 1 0 0 1 1-1h2v9h6V4h2a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-10a1 1 0 0 1-1-1V5Z"
      />
      <path fill={subCol} d="M50.002 4h2a1 1 0 0 1 1 1v2h-3V4Z" />
      <path
        fill={mainCol}
        d="M53.002 9h-3v4h-9v2a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V9Z"
      />
      <path
        fill={mainCol}
        fillRule="evenodd"
        d="M46.5 22h-5a.5.5 0 0 0-.5.5v5a.5.5 0 0 0 .5.5h5a.5.5 0 0 0 .5-.5v-1h-4.5v-1H46v-1h-3.5v-1H47v-1a.5.5 0 0 0-.5-.5ZM102.5 22h-5a.5.5 0 0 0-.5.5v5a.5.5 0 0 0 .5.5h5a.5.5 0 0 0 .5-.5v-1h-4.5v-1h3.5v-1h-3.5v-1h4.5v-1a.5.5 0 0 0-.5-.5ZM54.426 21.997a.5.5 0 0 0-.707 0l-1.787 1.787-1.787-1.787a.5.5 0 0 0-.707 0l-.492.491a.5.5 0 0 0 0 .708l1.787 1.787-1.787 1.787a.5.5 0 0 0 0 .707l.492.491a.5.5 0 0 0 .707 0l1.787-1.786 1.787 1.787a.5.5 0 0 0 .707 0l.492-.492a.5.5 0 0 0 0-.707l-1.787-1.787 1.787-1.787a.5.5 0 0 0 0-.708l-.492-.491ZM65.478 22a.5.5 0 0 0-.5.5v5a.5.5 0 0 0 .5.5h1v-2.25h3V28h1a.5.5 0 0 0 .5-.5v-5a.5.5 0 0 0-.5-.5h-1v2.25h-3V22h-1ZM73.478 22a.5.5 0 0 0-.5.5v5a.5.5 0 0 0 .5.5h1v-1.5h3V28h1a.5.5 0 0 0 .5-.5v-5a.5.5 0 0 0-.5-.5h-5Zm1 1.5V25h3v-1.5h-3ZM80.978 22.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-.5.5h-1v-4.5h-3V28h-1a.5.5 0 0 1-.5-.5v-5ZM57.5 28a.5.5 0 0 1-.5-.5v-5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 .5.5v1h-4.5v3H63v1a.5.5 0 0 1-.5.5h-5ZM89.478 22a.5.5 0 0 0-.5.5v5a.5.5 0 0 0 .5.5h5a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 0-.5-.5h-1v1.5h-3v-3h4.5v-1a.5.5 0 0 0-.5-.5h-5Z"
        clipRule="evenodd"
      />
      <defs>
        <clipPath id="a">
          <path fill="#fff" d="M-.001 0h32v32h-32z" />
        </clipPath>
      </defs>
    </svg>
  );
};

const JumperIcon = ({ theme }: Props) => {
  const mainCol =
    theme.palette.mode === 'light'
      ? theme.palette.accent1.main
      : theme.palette.accent1Alt.main;

  const subCol = theme.palette.accent2.main;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      fill="none"
      viewBox="0 0 32 32"
    >
      <path
        fill={mainCol}
        d="M18.869 16 6.999 27.869l3.238 3.237a3.052 3.052 0 0 0 4.316 0L27.5 18.158a3.052 3.052 0 0 0 0-4.316l-7.553-7.553-5.395 5.395L18.869 16Z"
      />
      <path
        fill={subCol}
        d="M7 4.13 10.237.895a3.052 3.052 0 0 1 4.316 0L17.79 4.13l-5.395 5.395L7 4.131Z"
      />
    </svg>
  );
};

type BrandLogoProps = {
  isConnected: boolean;
  theme: Theme;
};

export const BrandLogo = ({ isConnected, theme }: BrandLogoProps) => {
  const isTablet = useMediaQuery(theme.breakpoints.up('sm' as Breakpoint));

  return !isTablet || (!isTablet && isConnected) ? (
    <JumperIcon theme={theme} />
  ) : (
    <JumperLogo theme={theme} />
  );
};
