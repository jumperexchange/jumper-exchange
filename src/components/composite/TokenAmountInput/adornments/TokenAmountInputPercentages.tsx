import Box from '@mui/material/Box';
import { useTokenAmountInput } from '@/hooks/tokens/useTokenAmountInput';
import { PercentagesContainer } from '../TokenAmountInput.styles';
import { Button } from '@/components/core/buttons/Button/Button';
import { Size, Variant } from '@/components/core/buttons/types';

interface TokenAmountInputPercentagesProps {
  decimals: number;
  maxAmount: bigint;
  onAmountChange: (amount: string) => void;
}

export const TokenAmountInputPercentages = ({
  decimals,
  maxAmount,
  onAmountChange,
}: TokenAmountInputPercentagesProps) => {
  const { toAmount } = useTokenAmountInput();

  const handlePercentage = (percentage: number) => {
    const percentageAmount = (maxAmount * BigInt(percentage)) / 100n;
    onAmountChange(toAmount(percentageAmount, decimals));
  };

  const handleMax = () => {
    onAmountChange(toAmount(maxAmount, decimals));
  };

  return (
    <Box
      sx={{
        mt: 'auto',
      }}
    >
      <PercentagesContainer>
        <Button
          size={Size.SM}
          variant={Variant.AlphaDark}
          onClick={() => handlePercentage(25)}
          data-delay="0"
        >
          25%
        </Button>
        <Button
          size={Size.SM}
          variant={Variant.AlphaDark}
          onClick={() => handlePercentage(50)}
          data-delay="1"
        >
          50%
        </Button>
        <Button
          size={Size.SM}
          variant={Variant.AlphaDark}
          onClick={() => handlePercentage(75)}
          data-delay="2"
        >
          75%
        </Button>
        <Button
          size={Size.SM}
          variant={Variant.AlphaDark}
          onClick={handleMax}
          data-delay="3"
        >
          max
        </Button>
      </PercentagesContainer>
    </Box>
  );
};
