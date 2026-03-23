import type { FC } from 'react';
import { FieldWrapper, Label } from '../JumperWidget.style';
import type { SxProps, Theme } from '@mui/material/styles';
import { TokenAmountInput } from '../../TokenAmountInput/TokenAmountInput';
import { SelectCardMode } from '@/components/Cards/SelectCard/SelectCard.styles';
import type { Balance, ExtendedToken, PricedToken } from '@/types/tokens';
import { DisplayTokensAmount } from './DisplayTokensAmount';

interface BaseProps {
  label?: string;
  fieldSx?: SxProps<Theme>;
  to: Balance<PricedToken>;
}

interface SingleFromBalance extends BaseProps {
  from: Balance<PricedToken>;
  amountUSD?: never;
}

interface MultipleFromBalances extends BaseProps {
  from: Balance<PricedToken>[];
  amountUSD: number;
}

type SummaryProps = SingleFromBalance | MultipleFromBalances;

const isSingleBalance = (
  balance: Balance<PricedToken> | Balance<PricedToken>[],
): balance is Balance<PricedToken> => {
  return !Array.isArray(balance);
};

export const Summary: FC<SummaryProps> = ({
  label,
  fieldSx,
  from,
  to,
  amountUSD,
}) => {
  if (isSingleBalance(from)) {
    return (
      <FieldWrapper
        sx={(theme) => ({
          gap: theme.spacing(2),
        })}
      >
        {label && <Label>{label}</Label>}
        <TokenAmountInput
          mode={SelectCardMode.Display}
          tokenBalance={from}
          sx={fieldSx}
        />
        <TokenAmountInput
          mode={SelectCardMode.Display}
          tokenBalance={to}
          sx={fieldSx}
        />
      </FieldWrapper>
    );
  }

  if (from.length === 0) {
    return null;
  }

  if (from.length === 1) {
    return (
      <FieldWrapper
        sx={(theme) => ({
          gap: theme.spacing(2),
        })}
      >
        {label && <Label>{label}</Label>}
        <TokenAmountInput
          mode={SelectCardMode.Display}
          tokenBalance={from[0]}
          sx={fieldSx}
        />
        <TokenAmountInput
          mode={SelectCardMode.Display}
          tokenBalance={to}
          sx={fieldSx}
        />
      </FieldWrapper>
    );
  }

  return (
    <FieldWrapper
      sx={(theme) => ({
        gap: theme.spacing(2),
      })}
    >
      {label && <Label>{label}</Label>}
      <DisplayTokensAmount
        noTokens={from.length}
        chainId={from[0].token.chainId}
        amountUSD={amountUSD!}
        sx={fieldSx}
      />
      <TokenAmountInput
        mode={SelectCardMode.Display}
        tokenBalance={to}
        sx={fieldSx}
      />
    </FieldWrapper>
  );
};
