import type { FC } from 'react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useChains } from '@/hooks/useChains';
import { AvatarSize } from '@/components/core/AvatarStack/AvatarStack.types';
import { EntityStackWithBadge } from '@/components/composite/EntityStackWithBadge/EntityStackWithBadge';
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
  const { getChainById } = useChains();
  const { toAggregatedAmountUSD } = usePortfolioFormatters();

  const chainId =
    failedBalances[0]?.token.chainId ?? successfulBalances[0]?.token.chainId;
  const chain = useMemo(
    () => (chainId ? getChainById(chainId) : undefined),
    [chainId, getChainById],
  );
  const badgeEntities = useMemo(() => (chain ? [chain] : []), [chain]);
  const failedTokens = useMemo(
    () => failedBalances.map((b) => b.token),
    [failedBalances],
  );
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
      <Label>
        {t('portfolio.dustConversion.partialError.excludedTokens', {
          count: failedTokens.length,
        })}
      </Label>
      <EntityStackWithBadge
        entities={failedTokens}
        badgeEntities={badgeEntities}
        isContentVisible={false}
        size={AvatarSize.MD}
        badgeSize={AvatarSize.XXS}
      />

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
