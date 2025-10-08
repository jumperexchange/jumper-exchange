import Box from '@mui/material/Box';
import { ButtonContainer, MaxButton } from './WithdrawWidget.style';
import { useMemo, type Dispatch, type SetStateAction } from 'react';
import { formatUnits } from 'viem';

interface WithdrawInputEndAdornmentProps {
  mainColor?: string;
  setValue: Dispatch<SetStateAction<string>>;
  decimals: number;
  maxAmount: bigint;
}

function WithdrawInputEndAdornment({
  mainColor,
  setValue,
  decimals,
  maxAmount,
}: WithdrawInputEndAdornmentProps) {
  const handlePercentage = (percentage: number) => {
    if (maxAmount && decimals) {
      const percentageAmount = (maxAmount * BigInt(percentage)) / 100n;
      setValue(formatUnits(percentageAmount, decimals));
    }
  };

  const handleMax = () => {
    if (maxAmount && decimals) {
      setValue(formatUnits(maxAmount, decimals));
    }
  };

  return (
    <Box
      sx={{
        mt: 'auto',
      }}
    >
      <ButtonContainer>
        <MaxButton onClick={() => handlePercentage(25)} data-delay="0">
          25%
        </MaxButton>
        <MaxButton onClick={() => handlePercentage(50)} data-delay="1">
          50%
        </MaxButton>
        <MaxButton onClick={() => handlePercentage(75)} data-delay="2">
          75%
        </MaxButton>
        <MaxButton onClick={handleMax} data-delay="3">
          max
        </MaxButton>
      </ButtonContainer>
    </Box>
  );
}

export default WithdrawInputEndAdornment;
