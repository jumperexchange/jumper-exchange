import { useTheme } from '@mui/material';

// jumper-icon
export const JumperIcon = () => {
  const theme = useTheme();
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
        d="M17.141 16 5.827 27.313l2.829 2.829c1.414 1.414 4.242 1.414 5.656 0l11.314-11.314c1.414-1.414 1.414-4.242 0-5.657L19.97 7.515l-5.656 5.656L17.14 16Z"
      />
      <path
        fill={subCol}
        d="m5.828 4.686 2.828-2.828c1.414-1.414 4.243-1.414 5.657 0l2.828 2.828-5.657 5.657-5.656-5.657Z"
      />
    </svg>
  );
};
