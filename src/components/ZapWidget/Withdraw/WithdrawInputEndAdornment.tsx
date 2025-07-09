import Box from '@mui/material/Box';
import { MaxButton, MaxValue } from './WithdrawWidget.style';
import type { Dispatch, SetStateAction } from 'react';

interface WithdrawInputEndAdornmentProps {
  balance: string;
  mainColor?: string;
  setValue: Dispatch<SetStateAction<string>>;
}

function WithdrawInputEndAdornment({
  balance,
  mainColor,
  setValue,
}: WithdrawInputEndAdornmentProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 0.75,
        mt: 'auto',
      }}
    >
      <MaxButton
        aria-label="menu"
        mainColor={mainColor}
        onClick={() => setValue(balance ?? '0')}
      >
        max
      </MaxButton>
      <MaxValue variant="bodyXSmall" color="textSecondary">
        /{' '}
        {Intl.NumberFormat('en-US', {
          notation: 'compact',
          useGrouping: true,
          minimumFractionDigits: 0,
          maximumFractionDigits: parseFloat(balance) > 1 ? 1 : 4,
        }).format(parseFloat(balance))}
      </MaxValue>
    </Box>
  );
}

export default WithdrawInputEndAdornment;
