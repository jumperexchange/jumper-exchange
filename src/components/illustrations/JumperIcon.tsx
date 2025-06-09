import { useColorScheme, useTheme } from '@mui/material';

// jumper-icon
export const JumperIcon = () => {
  const theme = useTheme();
  const { mode } = useColorScheme();

  const mainCol =
    mode === 'light'
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
        d="M11.66 8.69 17.32 3.03 15.9 1.61C13.07-1.22 10.24-1.22 7.41 1.61L6 3.03l5.66 5.66Z"
        fill={mainCol}
      />
      <path
        d="M17.32 17.68c-.64.66-11.32 11.32-11.32 11.32l1.41 1.41c1.41 1.41 6.32 2.82 9.15 0l11.61-11.61c1.41-1.41 1.41-3.74 0-5.15L20.14 6.85 14.48 12.5s2.12 2.12 2.84 2.84c.71.71.61 2.01 0 2.34Z"
        fill={subCol}
      />
    </svg>
  );
};
