import type { EarnOpportunityExtended } from '@/stores/depositFlow/DepositFlowStore';
import type { useFormatRedeemClaimData } from '../hooks/useFormatRedeemClaimData';
import type { FC } from 'react';
import { useMemo } from 'react';
import {
  RequestRedeemModalContentContainer,
  RequestRedeemModalFieldsContainer,
  RequestRedeemModalFormContainer,
  RequestRedeemModalHeaderContainer,
  RequestRedeemModalWrapperContainer,
} from '../RequestRedeemModal.styles';
import Typography from '@mui/material/Typography';
import { ProcessingTransactionCard } from '../../cards/ProcessingTransactionCard/ProcessingTransactionCard';
import type { ProcessingTransactionCardStatus } from '../../cards/ProcessingTransactionCard/types';
import { TokenAmountInput } from '../../TokenAmountInput/TokenAmountInput';
import { SelectCardMode } from '@/components/Cards/SelectCard/SelectCard.styles';
import { TokenAmountInputPercentages } from '../../TokenAmountInput/adornments/TokenAmountInputPercentages';
import { SelectCard } from '@/components/Cards/SelectCard/SelectCard';
import { TokenAmountInputAvatar } from '../../TokenAmountInput/adornments/TokenAmountInputAvatar';
import { Button } from '@/components/core/buttons/Button/Button';
import { Variant } from '@/components/core/buttons/types';
import { createExtendedToken, createTokenBalance } from '@/types/tokens';
import { useGetZapInPoolBalance } from '@/hooks/zaps/useGetZapInPoolBalance';
import { useToken } from '@/hooks/useToken';
import type { Address, Hex } from 'viem';
import { useAccountAddress } from '@/hooks/earn/useAccountAddress';
import { useTokenFormatters } from '@/hooks/tokens/useTokenFormatters';
import { useTokenAmountInput } from '@/hooks/tokens/useTokenAmountInput';
import { useChains } from '@/hooks/useChains';
import type { useRedeemTransactionForm } from '../hooks/useRedeemTransactionForm';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';

interface RequestWithdrawViewProps {
  earnOpportunity: EarnOpportunityExtended;
  claims: ReturnType<typeof useFormatRedeemClaimData>;
  onClaimClick: (claimId: string) => void;
  formState: ReturnType<typeof useRedeemTransactionForm>;
}

export const RequestWithdrawView: FC<RequestWithdrawViewProps> = ({
  earnOpportunity,
  claims,
  onClaimClick,
  formState,
}) => {
  const { t } = useTranslation();
  const accountAddress = useAccountAddress();
  const { toDisplayAmount } = useTokenFormatters();
  const { toRawAmount } = useTokenAmountInput();
  const { getChainById } = useChains();

  const { amount, handleAmountChange, handleSubmit, isSubmitting } = formState;

  const { depositTokenData: depositAmount } = useGetZapInPoolBalance(
    accountAddress as Hex,
    earnOpportunity.lpToken.address as Hex,
    earnOpportunity.lpToken.chain.chainId,
  );

  const { token: extendedToken } = useToken(
    earnOpportunity.lpToken.chain.chainId,
    earnOpportunity.lpToken.address as Address,
    { extended: true },
  );

  // Create token balance helper
  const createLpTokenBalance = useMemo(() => {
    const priceUSD = extendedToken?.priceUSD ?? '0';
    const lpToken = createExtendedToken(earnOpportunity.lpToken, priceUSD);

    return (balanceAmount: string | bigint) =>
      createTokenBalance(lpToken, BigInt(balanceAmount));
  }, [earnOpportunity.lpToken, extendedToken?.priceUSD]);

  const depositTokenBalance = createLpTokenBalance(amount ?? 0);
  const maxDepositTokenBalance = createLpTokenBalance(
    BigInt(depositAmount ?? 0),
  );

  const withdrawToken = useMemo(
    () => createExtendedToken(earnOpportunity.asset, '0'),
    [earnOpportunity.asset],
  );

  const withdrawTokenChain = useMemo(
    () => getChainById(earnOpportunity.asset.chain.chainId),
    [earnOpportunity.asset.chain.chainId, getChainById],
  );

  const handleFormattedAmountChange = (formattedAmount: string) => {
    const rawAmount = toRawAmount(
      formattedAmount,
      earnOpportunity.lpToken.decimals,
    );
    handleAmountChange(rawAmount.toString());
  };

  const isSubmitDisabled =
    isSubmitting ||
    !accountAddress ||
    depositTokenBalance.amount === 0n ||
    depositTokenBalance.amount > maxDepositTokenBalance.amount;

  return (
    <RequestRedeemModalFormContainer as="form" onSubmit={handleSubmit}>
      <RequestRedeemModalWrapperContainer>
        <RequestRedeemModalHeaderContainer>
          <Typography variant="titleSmall">
            {t('earn.requestRedeemFlow.title.request')}
          </Typography>
        </RequestRedeemModalHeaderContainer>
        <RequestRedeemModalContentContainer>
          {claims.map((formattedClaim) => (
            <ProcessingTransactionCard
              key={formattedClaim.id}
              status={formattedClaim.status as ProcessingTransactionCardStatus}
              fromToken={depositTokenBalance.token}
              toToken={withdrawToken}
              title={formattedClaim.title}
              description={formattedClaim.description}
              onClick={
                formattedClaim.status === 'success'
                  ? () => onClaimClick(formattedClaim.id)
                  : undefined
              }
            />
          ))}

          <RequestRedeemModalFieldsContainer>
            <TokenAmountInput
              mode={SelectCardMode.Input}
              tokenBalance={depositTokenBalance}
              enableSwapButton
              label={t('form.labels.amount')}
              onAmountChange={handleFormattedAmountChange}
              hintEndAdornment={`/ ${toDisplayAmount(maxDepositTokenBalance, undefined, { maximumFractionDigits: 6 })}`}
              endAdornment={
                <TokenAmountInputPercentages
                  maxAmount={maxDepositTokenBalance.amount}
                  onAmountChange={handleAmountChange}
                />
              }
              sx={(theme) => ({
                background: (theme.vars || theme).palette.surface1.main,
                '& .MuiFormLabel-root': {
                  ...theme.typography.bodySmallStrong,
                },
              })}
            />
            <SelectCard
              mode={SelectCardMode.Display}
              label={t('form.labels.withdrawTo')}
              value={withdrawToken.symbol}
              placeholder={withdrawToken.symbol}
              description={withdrawTokenChain?.name}
              isClickable={false}
              startAdornment={<TokenAmountInputAvatar token={withdrawToken} />}
              sx={(theme) => ({
                background: (theme.vars || theme).palette.surface1.main,
              })}
            />
          </RequestRedeemModalFieldsContainer>

          <Button
            variant={Variant.Primary}
            fullWidth
            type="submit"
            disabled={isSubmitDisabled}
            loading={isSubmitting}
          >
            {t('buttons.requestWithdraw')}
          </Button>
        </RequestRedeemModalContentContainer>
      </RequestRedeemModalWrapperContainer>
    </RequestRedeemModalFormContainer>
  );
};
