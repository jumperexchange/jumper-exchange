import type { FC } from 'react';
import { AssetOverviewCardOverviewColumnContainer } from '../AssetOverviewCard.styles';
import { TitleWithHint } from '../../TitleWithHint/TitleWithHint';
import { THRESHOLD_MIN_AMOUNT } from '../constants';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  const isBelowThreshold = totalPrice && totalPrice < THRESHOLD_MIN_AMOUNT;
  const formattedActualAmount = t('format.currency', { value: totalPrice });
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
