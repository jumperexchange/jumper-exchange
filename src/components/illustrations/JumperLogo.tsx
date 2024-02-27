import { useTheme } from '@mui/material';

// brand-logo: "jumper" + jumper-icon
export const JumperLogo = () => {
  const theme = useTheme();
  const mainCol =
    theme.palette.mode === 'light'
      ? theme.palette.accent1.main
      : theme.palette.accent1Alt.main;
  const subCol = theme.palette.accent2.main;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="148"
      height="32"
      fill="none"
      viewBox="0 0 148 32"
    >
      <path
        fill={mainCol}
        d="M17.145 16 5.83 27.314l2.828 2.828c1.414 1.414 4.243 1.414 5.657 0L25.63 18.828c1.414-1.414 1.414-4.242 0-5.656l-5.657-5.657-5.657 5.657L17.145 16Z"
      />
      <path
        fill={subCol}
        d="M5.831 4.686 8.66 1.858c1.415-1.414 4.243-1.414 5.657 0l2.829 2.828-5.657 5.657L5.83 4.686Z"
      />
      <path
        fill={mainCol}
        d="M132.002 18h4v-6h12v-2c0-1-1-2-2-2h-12c-1 0-2 1-2 2v8Z"
      />
      <path fill={subCol} d="M136.002 24h-2c-1 0-2-1-2-2v-2h4v4Z" />
      <path
        fill={mainCol}
        d="M117.002 20v-2.667h10v-2.666h-10V12h12v-2c0-1-1-2-2-2h-12c-1 0-2 1-2 2v12c0 1 1 2 2 2h12c1 0 2-1 2-2v-2h-12Zm-22 0h4v4h-2c-1 0-2-1-2-2v-2Z"
      />
      <path
        fill={mainCol}
        fill-rule="evenodd"
        d="M97.002 8c-1 0-2 1-2 2v10h10c4 0 6-3 6-6s-2-6-6-6h-8Zm8 4h-6v4h6c1.5 0 2-1.264 2-2s-.5-2-2-2Z"
        clip-rule="evenodd"
      />
      <path
        fill={mainCol}
        d="M92.002 10c0-1-1-2-2-2h-12c-1 0-2 1-2 2v12c0 1 1 2 2 2h2V12h2.5v12h3V12h2.5v12h2c1 0 2-1 2-2V10Zm-34.999 0c0-1 1-2 2-2h2v12h8V8h2c1 0 2 1 2 2v12c0 1-1 2-2 2h-12c-1 0-2-1-2-2V10Z"
      />
      <path fill={subCol} d="M50.007 8h1.996c1 0 2 1 2 2l.004 2h-4V8Z" />
      <path
        fill={mainCol}
        d="M54.007 14h-4v6h-12l-.005 2c0 1 1 2 2 2h12c1 0 2.005-1 2-2l.005-8Z"
      />
    </svg>
  );
};
