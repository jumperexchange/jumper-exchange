import type { FC } from 'react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { DisplayTokensAmount } from '@/components/composite/JumperWidget/components/DisplayTokensAmount';
import type { PortfolioBalance, WalletToken } from '@/types/tokens';
import { usePortfolioFormatters } from '@/hooks/tokens/usePortfolioFormatters';
import { summaryFieldSx } from '../../JumperWidget/JumperWidget.stories';
import { FieldWrapper, Label } from '../../JumperWidget/JumperWidget.style';

interface PartialQuoteErrorSheetContentProps {
  failedBalances: PortfolioBalance<WalletToken>[];
  successfulBalances: PortfolioBalance<WalletToken>[];
}

export const PartialQuoteErrorSheetContent: FC<
  PartialQuoteErrorSheetContentProps
> = ({ failedBalances, successfulBalances }) => {
  const { t } = useTranslation();
  const { toAggregatedAmountUSD } = usePortfolioFormatters();

  const chainId =
    failedBalances[0]?.token.chainId ?? successfulBalances[0]?.token.chainId;
  const proceedableAmountUSD = useMemo(
    () => toAggregatedAmountUSD(successfulBalances),
    [successfulBalances, toAggregatedAmountUSD],
  );

  return (
    <FieldWrapper
      sx={(theme) => ({
        gap: theme.spacing(1),
        width: '100%',
      })}
    >
      {successfulBalances.length > 0 && chainId && (
        <>
          <Label>
            {t('portfolio.dustConversion.partialError.convertibleDust')}
          </Label>
          <DisplayTokensAmount
            chainId={chainId}
            noTokens={successfulBalances.length}
            amountUSD={proceedableAmountUSD}
            sx={summaryFieldSx}
          />
        </>
      )}
    </FieldWrapper>
  );
};
