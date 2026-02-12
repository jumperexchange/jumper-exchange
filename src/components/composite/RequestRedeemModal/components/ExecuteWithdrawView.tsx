import { useChains } from '@/hooks/useChains';
import { useToken } from '@/hooks/useToken';
import type { EarnOpportunityExtended } from '@/stores/depositFlow/DepositFlowStore';
import { type FC, useCallback, useMemo } from 'react';
import type { Address } from 'viem';
import { TokenAmountInput } from '../../TokenAmountInput/TokenAmountInput';
import { SelectCardMode } from '@/components/Cards/SelectCard/SelectCard.styles';
import { createExtendedToken, createTokenBalance } from '@/types/tokens';
import type { useFormatRedeemClaimData } from '../hooks/useFormatRedeemClaimData';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { IconButton } from '@/components/core/buttons/IconButton/IconButton';
import { Variant } from '@/components/core/buttons/types';
import { Size } from '@/components/core/buttons/types';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button } from '@/components/core/buttons/Button/Button';
import Stack from '@mui/material/Stack';
import {
  RequestRedeemModalContentContainer,
  RequestRedeemModalFieldsContainer,
  RequestRedeemModalFormContainer,
  RequestRedeemModalHeaderContainer,
  RequestRedeemModalWrapperContainer,
} from '../RequestRedeemModal.styles';
import type { useRedeemTransactionForm } from '../hooks/useRedeemTransactionForm';
import { useTranslation } from 'react-i18next';
import { claimTokenAmountStyle } from '../constants';

interface ExecuteWithdrawViewProps {
  claim: ReturnType<typeof useFormatRedeemClaimData>[number];
  earnOpportunity: EarnOpportunityExtended;
  onBack: () => void;
  formState: ReturnType<typeof useRedeemTransactionForm>;
}

export const ExecuteWithdrawView: FC<ExecuteWithdrawViewProps> = ({
  claim,
  earnOpportunity,
  onBack,
  formState,
}) => {
  const { t } = useTranslation();
  const { getChainById } = useChains();

  const { token: extendedFromToken } = useToken(
    earnOpportunity.lpToken.chain.chainId,
    earnOpportunity.lpToken.address as Address,
    { extended: true },
  );
  const { token: extendedToToken } = useToken(
    earnOpportunity.asset.chain.chainId,
    earnOpportunity.asset.address as Address,
    { extended: true },
  );

  const toTokenChain = useMemo(
    () => getChainById(earnOpportunity.asset.chain.chainId),
    [earnOpportunity.asset.chain.chainId, getChainById],
  );

  const fromTokenBalance = useMemo(() => {
    return createTokenBalance(
      createExtendedToken(
        earnOpportunity.lpToken,
        extendedFromToken?.priceUSD ?? '0',
      ),
      claim.lpTokenAmount ?? '0',
    );
  }, [
    earnOpportunity.lpToken,
    claim.lpTokenAmount,
    extendedFromToken?.priceUSD,
  ]);

  const toTokenBalance = useMemo(() => {
    return createTokenBalance(
      createExtendedToken(
        earnOpportunity.asset,
        extendedToToken?.priceUSD ?? '0',
      ),
      claim.assetAmount ?? '0',
    );
  }, [earnOpportunity.asset, claim.assetAmount, extendedToToken?.priceUSD]);

  const handleSubmit = useCallback(
    (event: React.SubmitEvent) => {
      event.preventDefault();
      formState.handleSubmit(event);
    },
    [formState],
  );

  return (
    <RequestRedeemModalFormContainer as="form" onSubmit={handleSubmit}>
      <RequestRedeemModalWrapperContainer>
        <RequestRedeemModalHeaderContainer>
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <IconButton
              variant={Variant.Borderless}
              size={Size.SM}
              onClick={onBack}
              sx={{ position: 'absolute', left: 0 }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="titleXSmall" sx={{ textAlign: 'center' }}>
              {t('earn.requestRedeemFlow.title.claim')}
            </Typography>
          </Box>
        </RequestRedeemModalHeaderContainer>
        <RequestRedeemModalContentContainer>
          <RequestRedeemModalFieldsContainer>
            <Stack
              spacing={2}
              sx={(theme) => ({
                backgroundColor: (theme.vars || theme).palette.surface1.main,
                boxShadow: theme.shadows[2],
                borderRadius: `${theme.shape.cardBorderRadiusMedium}px`,
                padding: theme.spacing(2),
              })}
            >
              <Typography variant="title2XSmall">
                {t('form.labels.swap')}
              </Typography>
              <TokenAmountInput
                mode={SelectCardMode.Display}
                tokenBalance={fromTokenBalance}
                sx={claimTokenAmountStyle}
              />
              <TokenAmountInput
                mode={SelectCardMode.Display}
                tokenBalance={toTokenBalance}
                sx={claimTokenAmountStyle}
              />
            </Stack>
            <Button
              type="submit"
              variant={Variant.Primary}
              fullWidth
              loading={formState.isSubmitting}
              disabled={formState.isSubmitting}
            >
              {t('buttons.withdraw')}
            </Button>
          </RequestRedeemModalFieldsContainer>
        </RequestRedeemModalContentContainer>
      </RequestRedeemModalWrapperContainer>
    </RequestRedeemModalFormContainer>
  );
};
