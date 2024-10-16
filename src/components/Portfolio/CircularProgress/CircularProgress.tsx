import type { Process } from '@lifi/sdk';
import {
  Done,
  ErrorRounded,
  InfoRounded,
  WarningRounded,
} from '@mui/icons-material';
import { darken } from '@mui/material';
import {
  CircularIcon,
  CircularProgressPending,
} from './CircularProgress.style.jsx';

export function CircularProgress({ process }: { process: Process }) {
  return (
    <CircularIcon status={process.status} substatus={process.substatus}>
      {process.status === 'STARTED' || process.status === 'PENDING' ? (
        <CircularProgressPending size={40} />
      ) : null}
      {process.status === 'ACTION_REQUIRED' ? (
        <InfoRounded
          color="info"
          sx={{
            position: 'absolute',
            fontSize: '1.5rem',
          }}
        />
      ) : null}
      {process.status === 'DONE' &&
      (process.substatus === 'PARTIAL' || process.substatus === 'REFUNDED') ? (
        <WarningRounded
          sx={(theme) => ({
            position: 'absolute',
            fontSize: '1.5rem',
            color: darken(theme.palette.warning.main, 0.32),
          })}
        />
      ) : process.status === 'DONE' ? (
        <Done
          color="success"
          sx={{
            position: 'absolute',
            fontSize: '1.5rem',
          }}
        />
      ) : null}
      {process.status === 'FAILED' ? (
        <ErrorRounded
          color="error"
          sx={{
            position: 'absolute',
            fontSize: '1.5rem',
          }}
        />
      ) : null}
    </CircularIcon>
  );
}
