import type { FC } from 'react';
import { useState } from 'react';
import { TokenAmountInput } from '@/components/composite/TokenAmountInput/TokenAmountInput';
import { SelectCardMode } from '@/components/Cards/SelectCard/SelectCard.styles';
import type { Balance, ExtendedToken } from '@/types/tokens';
import { EarnYieldColumnsContainer } from '../EarnDetails.styles';
import { useTokenFormatters } from '@/hooks/tokens/useTokenFormatters';
import { useTokenAmountInput } from '@/hooks/tokens/useTokenAmountInput';
import { TitleWithHint } from '@/components/composite/TitleWithHint/TitleWithHint';
import {
  SEVEN_DAYS,
  THIRTY_DAYS,
  THREE_HUNDRED_SIXTY_FIVE_DAYS,
} from '@/const/time';

interface EarnYourYieldViewProps {
  depositTokenBalance: Balance<ExtendedToken>;
  yieldBoost: number;
}

const DURATION_DAY_OPTIONS = [
  SEVEN_DAYS,
  THIRTY_DAYS,
  THREE_HUNDRED_SIXTY_FIVE_DAYS,
];

const PERCENTAGE_DECIMALS = 4;

export const EarnYourYieldView: FC<EarnYourYieldViewProps> = ({
  depositTokenBalance,
  yieldBoost,
}) => {
  const token = depositTokenBalance.token;

  const [inputAmount, setInputAmount] = useState(
    depositTokenBalance.amount.toString(),
  );

  const { toDisplayAmountUSD } = useTokenFormatters();
  const { toRawAmount } = useTokenAmountInput();

  const handleAmountChange = (amount: string) => {
    setInputAmount(amount);
  };

  const formatYieldAmount = (duration: number, yieldBoost: number) => {
    const rawAmount = toRawAmount(inputAmount, token.decimals);

    const yieldBoostScaled = toRawAmount(
      yieldBoost.toString(),
      PERCENTAGE_DECIMALS,
    );
    const durationBigInt = toRawAmount(duration.toString(), 0);
    const yearDaysBigInt = toRawAmount(
      THREE_HUNDRED_SIXTY_FIVE_DAYS.toString(),
      0,
    );

    const scale = BigInt(10 ** PERCENTAGE_DECIMALS);
    const yieldPortion =
      (rawAmount * yieldBoostScaled * durationBigInt) / yearDaysBigInt / scale;
    const yieldAmount = rawAmount + yieldPortion;

    const useCompactNotation =
      yieldAmount > toRawAmount('1000', token.decimals);

    return toDisplayAmountUSD(
      {
        amount: yieldAmount,
        token,
      },
      {
        maximumFractionDigits: 2,
        compact: useCompactNotation,
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
            key={duration}
            title={formatYieldAmount(duration, yieldBoost)}
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
