import type { FC } from 'react';
import { AssetOverviewCardOverviewColumnContainer } from '../AssetOverviewCard.styles';
import { TitleWithHint } from '../../TitleWithHint/TitleWithHint';
import { THRESHOLD_MIN_AMOUNT } from '../constants';
import { useTranslation } from 'react-i18next';
import { toCompactValue } from '@/utils/formatNumbers';
import { formatPortfolioValueInDollar } from '@/utils/numbers/portfolioValueInDollar';

interface OverviewCardColumnProps {
  hint: string;
  totalPrice: number;
  children: React.ReactNode;
}

export const OverviewCardColumn: FC<OverviewCardColumnProps> = ({
  hint,
  totalPrice,
  children,
}) => {
  const isBelowThreshold = totalPrice && totalPrice < THRESHOLD_MIN_AMOUNT;
  const formattedActualAmount = formatPortfolioValueInDollar(totalPrice);
  const formattedAmount = isBelowThreshold
    ? `<$${THRESHOLD_MIN_AMOUNT}`
    : formattedActualAmount;
  return (
    <AssetOverviewCardOverviewColumnContainer>
      <TitleWithHint
        titleVariant="titleMedium"
        title={formattedAmount}
        titleTooltip={isBelowThreshold ? formattedActualAmount : undefined}
        hintVariant="bodyXSmall"
        hint={hint}
        sx={{ flexDirection: 'column-reverse', gap: 1 }}
      />
      {children}
    </AssetOverviewCardOverviewColumnContainer>
  );
};
