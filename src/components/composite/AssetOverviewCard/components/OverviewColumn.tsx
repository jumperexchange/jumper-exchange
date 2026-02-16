import type { FC, ReactNode } from 'react';
import { TitleWithHint } from '@/components/composite/TitleWithHint/TitleWithHint';
import { formatPortfolioValueInDollar } from '@/utils/numbers/portfolioValueInDollar';
import { OverviewColumnContainer } from '../AssetOverviewCard.styles';
import { THRESHOLD_MIN_AMOUNT } from '../constants';

interface OverviewColumnProps {
  hint: string;
  totalUsd: number;
  children: ReactNode;
  dataTestId: string;
}

export const OverviewColumn: FC<OverviewColumnProps> = ({
  hint,
  totalUsd,
  children,
  dataTestId,
}) => {
  const isBelowThreshold = totalUsd > 0 && totalUsd < THRESHOLD_MIN_AMOUNT;
  const formattedActualAmount = formatPortfolioValueInDollar(totalUsd);
  const formattedAmount = isBelowThreshold
    ? `<$${THRESHOLD_MIN_AMOUNT}`
    : formattedActualAmount;

  return (
    <OverviewColumnContainer
      data-testid={dataTestId}
      aria-label={`Total value: ${totalUsd}`}
    >
      <TitleWithHint
        titleVariant="titleMedium"
        title={formattedAmount}
        titleTooltip={isBelowThreshold ? formattedActualAmount : undefined}
        hintVariant="bodyXSmall"
        hint={hint}
        sx={{ flexDirection: 'column-reverse', gap: 1 }}
      />
      {children}
    </OverviewColumnContainer>
  );
};
