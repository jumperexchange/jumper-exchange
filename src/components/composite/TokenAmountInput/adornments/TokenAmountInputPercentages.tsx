import Box from '@mui/material/Box';
import {
  PercentageButton,
  PercentagesContainer,
} from '../TokenAmountInput.styles';
import { Size, Variant } from '@/components/core/buttons/types';

interface TokenAmountInputPercentagesProps {
  maxAmount: bigint;
  onAmountChange: (amount: string) => void;
}

export const TokenAmountInputPercentages = ({
  maxAmount,
  onAmountChange,
}: TokenAmountInputPercentagesProps) => {
  const handlePercentage = (percentage: number) => {
    const percentageAmount = (maxAmount * BigInt(percentage)) / 100n;
    onAmountChange(percentageAmount.toString());
  };

  const handleMax = () => {
    onAmountChange(maxAmount.toString());
  };

  return (
    <Box
      sx={{
        display: 'contents',
      }}
    >
      <PercentagesContainer>
        <PercentageButton
          size={Size.XS}
          variant={Variant.AlphaDark}
          onClick={() => handlePercentage(25)}
          data-delay="0"
        >
          25%
        </PercentageButton>
        <PercentageButton
          size={Size.XS}
          variant={Variant.AlphaDark}
          onClick={() => handlePercentage(50)}
          data-delay="1"
        >
          50%
        </PercentageButton>
        <PercentageButton
          size={Size.XS}
          variant={Variant.AlphaDark}
          onClick={() => handlePercentage(75)}
          data-delay="2"
        >
          75%
        </PercentageButton>
        <PercentageButton
          size={Size.XS}
          variant={Variant.AlphaDark}
          onClick={handleMax}
          data-delay="3"
        >
          MAX
        </PercentageButton>
      </PercentagesContainer>
    </Box>
  );
};
