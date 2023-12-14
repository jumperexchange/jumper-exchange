import type { Theme } from '@mui/material';

interface Props {
  theme: Theme;
}

// jumper-icon
export const LogoSmall = ({ theme }: Props) => {
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
