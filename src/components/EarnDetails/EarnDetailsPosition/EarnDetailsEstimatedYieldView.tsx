import type { FC } from 'react';
import { useState } from 'react';
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
import { TokenPriceFormInput } from '@/components/Form/TokenPriceFormInput/TokenPriceFormInput';
import { IconButton } from '@/components/core/buttons/IconButton/IconButton';
import {
  Variant as IconButtonVariant,
  Size as IconButtonSize,
} from '@/components/core/buttons/types';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useTranslation } from 'react-i18next';

interface EarnDetailsEstimatedYieldViewProps {
  yieldEstimateTokenBalance: Balance<ExtendedToken>;
  yieldBoost: number;
}

const DURATION_DAY_OPTIONS = [
  SEVEN_DAYS,
  THIRTY_DAYS,
  THREE_HUNDRED_SIXTY_FIVE_DAYS,
];

const PERCENTAGE_DECIMALS = 4;

export const EarnDetailsEstimatedYieldView: FC<
  EarnDetailsEstimatedYieldViewProps
> = ({ yieldEstimateTokenBalance, yieldBoost }) => {
  const token = yieldEstimateTokenBalance.token;

  const { t } = useTranslation();

  const { toDisplayAmountUSD } = useTokenFormatters();
  const { toRawAmount, toAmount } = useTokenAmountInput();

  const initialAmount = toAmount(
    yieldEstimateTokenBalance.amount,
    token.decimals,
  );

  const [inputAmount, setInputAmount] = useState(initialAmount);
  const [inputKey, setInputKey] = useState(0);

  const rawInputAmount = toRawAmount(inputAmount, token.decimals);

  const handleAmountChange = (amount: string) => {
    setInputAmount(amount);
  };

  const handleResetInitial = () => {
    setInputAmount(initialAmount);
    setInputKey((prev) => prev + 1);
  };

  const formatYieldAmount = (duration: number, yieldBoost: number) => {
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
      (rawInputAmount * yieldBoostScaled * durationBigInt) /
      yearDaysBigInt /
      scale;

    return toDisplayAmountUSD(
      {
        amount: yieldPortion,
        token,
      },
      {
        maximumFractionDigits: 2,
        compact: true,
      },
    );
  };

  const canRefresh = rawInputAmount !== yieldEstimateTokenBalance.amount;

  return (
    <>
      <TokenPriceFormInput
        id="your-yield-estimate"
        name="your-yield-estimate"
        key={inputKey.toString()}
        tokenBalance={yieldEstimateTokenBalance}
        onAmountChange={handleAmountChange}
        sx={(theme) => ({
          marginBottom: theme.spacing(1.75),
        })}
        endAdornment={
          canRefresh && (
            <IconButton
              variant={IconButtonVariant.Borderless}
              size={IconButtonSize.SM}
              onClick={handleResetInitial}
            >
              <RefreshIcon />
            </IconButton>
          )
        }
      />
      <EarnYieldColumnsContainer>
        {DURATION_DAY_OPTIONS.map((duration) => (
          <TitleWithHint
            key={duration}
            title={
              yieldBoost
                ? formatYieldAmount(duration, yieldBoost)
                : t('common.noData')
            }
            titleVariant="bodyLargeStrong"
            hint={t('common.days', { count: duration })}
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
