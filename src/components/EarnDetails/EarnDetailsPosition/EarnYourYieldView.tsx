import type { FC } from 'react';
import { useState } from 'react';
import { TokenAmountInput } from '@/components/composite/TokenAmountInput/TokenAmountInput';
import { SelectCardMode } from '@/components/Cards/SelectCard/SelectCard.styles';
import type { Balance, ExtendedToken } from '@/types/tokens';
import { EarnYieldColumnsContainer } from '../EarnDetails.styles';
import { useTokenFormatters } from '@/hooks/tokens/useTokenFormatters';
import { useTokenAmountInput } from '@/hooks/tokens/useTokenAmountInput';
import { formatApy } from '@/utils/numbers/apy';
import { TitleWithHint } from '@/components/composite/TitleWithHint/TitleWithHint';

interface EarnYourYieldViewProps {
  depositTokenBalance: Balance<ExtendedToken>;
  apy: number;
}

const DURATION_DAY_OPTIONS = [7, 30, 365];

export const EarnYourYieldView: FC<EarnYourYieldViewProps> = ({
  depositTokenBalance,
  apy,
}) => {
  const [inputAmount, setInputAmount] = useState<bigint>(
    depositTokenBalance.amount,
  );

  const { toDisplayAmountUSD } = useTokenFormatters();
  const { toRawAmount, toTokenAmountString } = useTokenAmountInput();

  const handleAmountChange = (amount: bigint) => {
    setInputAmount(amount);
  };

  const formatYieldAmount = (duration: number, apyPercent: number) => {
    const token = depositTokenBalance.token;
    const amountString = toTokenAmountString(inputAmount, token.decimals);
    const amountDecimal = parseFloat(amountString);
    const apyDecimal = parseFloat(formatApy(apy));
    const yieldDecimal =
      amountDecimal + (amountDecimal * apyDecimal * duration) / 365;
    const yieldString = yieldDecimal.toString();
    const yieldAmount = toRawAmount(yieldString, token.decimals);

    return toDisplayAmountUSD(
      {
        amount: yieldAmount,
        token,
      },
      {
        compact: true,
      },
    );
  };

  return (
    <>
      <TokenAmountInput
        mode={SelectCardMode.Input}
        tokenBalance={depositTokenBalance}
        enableSwapButton
        onAmountChange={handleAmountChange}
      />
      <EarnYieldColumnsContainer>
        {DURATION_DAY_OPTIONS.map((duration) => (
          <TitleWithHint
            title={formatYieldAmount(duration, apy)}
            titleVariant="bodyLargeStrong"
            hint={`${duration} days`}
            hintVariant="bodyXSmall"
            gap={6}
            sx={{
              display: 'flex',
              flexDirection: 'column-reverse',
            }}
          />
        ))}
      </EarnYieldColumnsContainer>
    </>
  );
};
