import { useEffect, useState } from 'react';
import { differenceInSeconds } from 'date-fns';
import Typography from '@mui/material/Typography';

type TimerProps = {
  target: Date | string | number;
};

const MAX_SECONDS = 24 * 60 * 60;

function formatTime(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n: number) => String(n).padStart(2, '0');

  return hours > 0
    ? `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
    : `${pad(minutes)}:${pad(seconds)}`;
}

/** @NOTE: we might need to extract this to a core component */
export function Timer({ target }: TimerProps) {
  const [seconds, setSeconds] = useState(() => {
    const diff = differenceInSeconds(new Date(target), new Date());
    return Math.min(Math.abs(diff), MAX_SECONDS);
  });

  useEffect(() => {
    if (seconds === 0) {
      return;
    }

    const targetDate = new Date(target);

    const interval = setInterval(() => {
      const diff = differenceInSeconds(targetDate, new Date());
      const next = Math.min(Math.abs(diff), MAX_SECONDS);
      setSeconds(next);
    }, 1000);

    return () => clearInterval(interval);
  }, [target, seconds]);

  if (seconds === 0) {
    return null;
  }

  return (
    <Typography variant="bodySmallStrong">{formatTime(seconds)}</Typography>
  );
}
