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
      xmlns="http://www.w3.org/2000/svg"
      width="128"
      height="32"
      fill="none"
      viewBox="0 0 128 32"
    >
      <path
        fill={mainCol}
        d="M17.143 16 5.83 27.314l2.829 2.828c1.414 1.414 4.242 1.414 5.657 0l11.313-11.314c1.415-1.414 1.415-4.242 0-5.657l-5.656-5.657-5.657 5.657L17.143 16Z"
      />
      <path
        fill={subCol}
        d="m5.83 4.686 2.828-2.828c1.414-1.414 4.243-1.414 5.657 0l2.828 2.828-5.657 5.657L5.83 4.686Z"
      />
      <path
        fill={mainCol}
        d="M108.5 11.5h3V7h9V5.5c0-.75-.75-1.5-1.5-1.5h-9c-.75 0-1.5.75-1.5 1.5v6Z"
      />
      <path fill={subCol} d="M111.5 16H110c-.75 0-1.5-.75-1.5-1.5V13h3v3Z" />
      <path
        fill={mainCol}
        d="M97.25 13v-2h7.5V9h-7.5V7h9V5.5c0-.75-.75-1.5-1.5-1.5h-9c-.75 0-1.5.75-1.5 1.5v9c0 .75.75 1.5 1.5 1.5h9c.75 0 1.5-.75 1.5-1.5V13h-9Zm-16.5 0h3v3h-1.5c-.75 0-1.5-.75-1.5-1.5V13Z"
      />
      <path
        fill={mainCol}
        fill-rule="evenodd"
        d="M82.25 4c-.75 0-1.5.75-1.5 1.5V13h7.5c3 0 4.5-2.25 4.5-4.5S91.25 4 88.25 4h-6Zm6 3h-4.5v3h4.5c1.126 0 1.5-.948 1.5-1.5S89.377 7 88.25 7Z"
        clip-rule="evenodd"
      />
      <path
        fill={mainCol}
        d="M78.5 5.5c0-.75-.75-1.5-1.5-1.5h-9c-.75 0-1.5.75-1.5 1.5v9c0 .75.75 1.5 1.5 1.5h1.5V7h1.876v9h2.25V7H75.5v9H77c.75 0 1.5-.75 1.5-1.5v-9Zm-26.249 0c0-.75.75-1.5 1.5-1.5h1.5v9h6V4h1.5c.75 0 1.5.75 1.5 1.5v9c0 .75-.75 1.5-1.5 1.5h-9c-.75 0-1.5-.75-1.5-1.5v-9Z"
      />
      <path
        fill={subCol}
        d="M47.003 4H48.5c.75 0 1.5.75 1.5 1.5l.003 1.5h-3V4Z"
      />
      <path
        fill={mainCol}
        d="M50.004 8.5h-3V13h-9L38 14.5c0 .75.75 1.5 1.5 1.5h9c.75 0 1.503-.75 1.5-1.5l.003-6Z"
      />
      <path
        fill={subCol}
        d="M83.501 27c0 .5-.5 1-1 1h-1v-6h-4v6h-1c-.5 0-1-.5-1-1v-6c0-.5.5-1 1-1h6c.5 0 1 .5 1 1v6Zm-16 1h1v-6h6v-1c0-.5-.5-1-1-1h-6c-.5 0-1 .5-1 1v6c0 .5.5 1 1 1Z"
      />
      <path
        fill={subCol}
        fill-rule="evenodd"
        d="M64.335 28a.667.667 0 0 0 .666-.666v-6.667a.667.667 0 0 0-.666-.667h-6.667a.667.667 0 0 0-.666.667v6.666c0 .369.298.667.666.667h1.334v-2h4v2h1.333Zm-1.333-4v-2h-4v2h4Z"
        clip-rule="evenodd"
      />
      <path
        fill={subCol}
        d="M49.502 26v-1.333h5v-1.334h-5V22h6v-1c0-.5-.5-1-1-1h-6c-.5 0-1 .5-1 1v6c0 .5.5 1 1 1h6c.5 0 1-.5 1-1v-1h-6Zm-10.5-6h1v6h6v1c0 .5-.5 1-1 1h-6c-.5 0-1-.5-1-1v-6c0-.5.5-1 1-1Z"
      />
    </svg>
  );
};
