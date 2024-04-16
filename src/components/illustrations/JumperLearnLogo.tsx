import { useTheme } from '@mui/material';

export const JumperLearnLogo = () => {
  const theme = useTheme();
  const mainCol =
    theme.palette.mode === 'light'
      ? theme.palette.accent1.main
      : theme.palette.accent1Alt.main;
  const subCol = theme.palette.accent2.main;

  return (
    <svg
      className="jumper-learn-logo"
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      fill="none"
    >
      <g clipPath="url(#a)">
        <path
          fill={mainCol}
          d="M17.144 16 5.83 27.314l2.829 2.828c1.414 1.414 4.242 1.414 5.656 0L25.63 18.828c1.415-1.414 1.415-4.242 0-5.657l-5.656-5.657-5.657 5.657L17.144 16Z"
        />
        <path
          fill={subCol}
          d="m5.83 4.686 2.83-2.828c1.414-1.414 4.243-1.414 5.657 0l2.828 2.828-5.657 5.657-5.656-5.657Z"
        />
      </g>
      <path
        className="jumper-learn-logo-desktop"
        fill={mainCol}
        d="M132.002 18h4v-6h12v-2c0-1-1-2-2-2h-12c-1 0-2 1-2 2v8Z"
      />
      <path
        className="jumper-learn-logo-desktop"
        fill={subCol}
        d="M136.002 24h-2c-1 0-2-1-2-2v-2h4v4Z"
      />
      <path
        className="jumper-learn-logo-desktop"
        fill={mainCol}
        d="M117.002 20v-2.667h10v-2.666h-10V12h12v-2c0-1-1-2-2-2h-12c-1 0-2 1-2 2v12c0 1 1 2 2 2h12c1 0 2-1 2-2v-2h-12Zm-22 0h4v4h-2c-1 0-2-1-2-2v-2Z"
      />
      <path
        className="jumper-learn-logo-desktop"
        fill={mainCol}
        fillRule="evenodd"
        d="M97.002 8c-1 0-2 1-2 2v10h10c4 0 6-3 6-6s-2-6-6-6h-8Zm8 4h-6v4h6c1.5 0 2-1.264 2-2s-.5-2-2-2Z"
        clipRule="evenodd"
      />
      <path
        className="jumper-learn-logo-desktop"
        fill={mainCol}
        d="M92.002 10c0-1-1-2-2-2h-12c-1 0-2 1-2 2v12c0 1 1 2 2 2h2V12h2.5v12h3V12h2.5v12h2c1 0 2-1 2-2V10Zm-35 0c0-1 1-2 2-2h2v12h8V8h2c1 0 2 1 2 2v12c0 1-1 2-2 2h-12c-1 0-2-1-2-2V10Z"
      />
      <path
        className="jumper-learn-logo-desktop"
        fill={subCol}
        d="M50.006 8h1.996c1 0 2 1 2 2l.004 2h-4V8Z"
      />
      <path
        className="jumper-learn-logo-desktop"
        fill={mainCol}
        d="M54.006 14h-4v6h-12l-.004 2c0 1 1 2 2 2h12c1 0 2.004-1 2-2l.004-8Z"
      />
      <path
        className="jumper-learn-logo-desktop"
        fill={subCol}
        d="M247.001 22c0 1-1 2-2 2h-2V12h-8v12h-2c-1 0-2-1-2-2V10c0-1 1-2 2-2h12c1 0 2 1 2 2v12Zm-32 2h2V12h12v-2c0-1-1-2-2-2h-12c-1 0-2 1-2 2v12c0 1 1 2 2 2Z"
      />
      <path
        className="jumper-learn-logo-desktop"
        fill={subCol}
        fillRule="evenodd"
        d="M208.668 24c.737 0 1.333-.597 1.333-1.333V9.334c0-.737-.596-1.334-1.333-1.334h-13.333c-.737 0-1.334.597-1.334 1.334v13.333c0 .736.597 1.333 1.334 1.333h2.666v-4h8v4h2.667Zm-2.667-8v-4h-8v4h8Z"
        clipRule="evenodd"
      />
      <path
        className="jumper-learn-logo-desktop"
        fill={subCol}
        d="M179.001 20v-2.666h10v-2.667h-10V12h12v-2c0-1-1-2-2-2h-12c-1 0-2 1-2 2v12c0 1 1 2 2 2h12c1 0 2-1 2-2v-2h-12Zm-21-12h2v12h12v2c0 1-1 2-2 2h-12c-1 0-2-1-2-2V10c0-1 1-2 2-2Z"
      />
      <defs>
        <clipPath id="a">
          <path fill="#fff" d="M.003 0h32v32h-32z" />
        </clipPath>
      </defs>
      <style type="text/css">
        {`
            .jumper-learn-logo {
              width: 248px;
              height: 32px;
            }
            @media (max-width: ${theme.breakpoints.values.sm}px) {
              .jumper-learn-logo {
                width: 32px;
                height: 32px;
              }
              .jumper-learn-logo-desktop {
                display: none;
              }
            }
          `}
      </style>
    </svg>
  );
};
