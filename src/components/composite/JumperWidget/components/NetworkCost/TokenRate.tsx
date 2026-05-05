import type { LiFiStep, RouteExtended } from '@lifi/sdk';
import { type TypographyProps } from '@mui/material/Typography';
import { useState, type MouseEventHandler } from 'react';
import { useTokenFormatters } from '@/hooks/tokens/useTokenFormatters';
import { createExtendedToken } from '@/types/tokens';
import { TokenRateTypography } from '../../JumperWidget.style';

type TokenRateProps = TypographyProps &
  ({ route: RouteExtended; step?: never } | { step: LiFiStep; route?: never });

const getTokenRateBalances = (route: RouteExtended) => {
  const lastStep = route.steps.at(-1);
  return {
    fromToken: createExtendedToken(route.fromToken),
    toToken: createExtendedToken(
      lastStep?.execution?.toToken ?? lastStep?.action.toToken ?? route.toToken,
    ),
    fromAmount: BigInt(route.fromAmount),
    toAmount: lastStep?.execution?.toAmount
      ? BigInt(lastStep.execution.toAmount)
      : BigInt(route.toAmount),
  };
};

const getStepRateBalances = (step: LiFiStep) => ({
  fromToken: createExtendedToken(step.action.fromToken),
  toToken: createExtendedToken(step.action.toToken),
  fromAmount: BigInt(step.action.fromAmount),
  toAmount: BigInt(step.estimate.toAmount),
});

export const TokenRate: React.FC<TokenRateProps> = ({
  route,
  step,
  ...props
}) => {
  const [isForward, setIsForward] = useState(true);
  const { toDisplayAmount, toAmount } = useTokenFormatters();

  const toggleRate: MouseEventHandler<HTMLSpanElement> = (e) => {
    e.stopPropagation();
    setIsForward((prev) => !prev);
  };

  const {
    fromToken,
    toToken,
    fromAmount,
    toAmount: toAmountRaw,
  } = route ? getTokenRateBalances(route) : getStepRateBalances(step);

  const totalFrom = parseFloat(
    toAmount({ amount: fromAmount, token: fromToken }),
  );
  const totalTo = parseFloat(toAmount({ amount: toAmountRaw, token: toToken }));

  const hasValidRateInputs =
    Number.isFinite(totalFrom) &&
    Number.isFinite(totalTo) &&
    totalFrom > 0 &&
    totalTo > 0;

  if (!hasValidRateInputs) {
    return null;
  }

  const forwardRate = totalTo / totalFrom;
  const inverseRate = totalFrom / totalTo;

  const rateText = isForward
    ? `1 ${fromToken.symbol} ≈ ${toDisplayAmount({ amount: BigInt(Math.round(forwardRate * 10 ** toToken.decimals)), token: toToken }, toToken.symbol)}`
    : `1 ${toToken.symbol} ≈ ${toDisplayAmount({ amount: BigInt(Math.round(inverseRate * 10 ** fromToken.decimals)), token: fromToken }, fromToken.symbol)}`;

  return (
    <TokenRateTypography onClick={toggleRate} role="button" {...props}>
      {rateText}
    </TokenRateTypography>
  );
};
