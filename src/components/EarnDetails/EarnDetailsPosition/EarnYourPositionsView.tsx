import type { FC } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Tooltip } from '@/components/core/Tooltip/Tooltip';
import type { TooltipProps } from '@mui/material/Tooltip';
import { TokenAmountInput } from '@/components/composite/TokenAmountInput/TokenAmountInput';
import { SelectCardMode } from '@/components/Cards/SelectCard/SelectCard.styles';
import { DepositFlowButton } from '@/components/composite/DepositFlow/DepositFlow';
import { WithdrawFlowButton } from '@/components/composite/WithdrawFlow/WithdrawFlow';
import { ConnectButton } from '@/components/ConnectButton';
import { EmptyComponent } from '@/components/core/EmptyComponent/EmptyComponent';
import { ExternalLink } from '@/components/Link/ExternalLink';
import { BaseSurfaceSkeleton } from '@/components/core/skeletons/BaseSurfaceSkeleton/BaseSurfaceSkeleton.style';
import {
  EarnDetailsActionsButtonsContainer,
  EarnDetailsActionsButtonsFallbackContainer,
} from '../EarnDetails.styles';
import { DepositButtonDisplayMode } from '@/components/composite/DepositButton/DepositButton.types';
import type { EarnOpportunityExtended } from '@/stores/depositFlow/DepositFlowStore';
import type { Balance, ExtendedToken } from '@/types/tokens';
import { selectCardStyles } from './constants';
import { RequestRedeemFlowButton } from '@/components/composite/RequestRedeemFlow/RequestRedeemFlow';

interface EarnYourPositionsViewProps {
  earnOpportunity: EarnOpportunityExtended;
  depositTokenBalance: Balance<ExtendedToken>;
  isConnected: boolean;
  isLoading: boolean;
  hasDeposited: boolean;
  areActionsDisabled: boolean;
  onRefreshBalances: () => void;
}

const tooltipSlotProps: TooltipProps['slotProps'] = {
  popper: {
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [0, -12],
        },
      },
    ],
  },
} as const;

export const EarnYourPositionsView: FC<EarnYourPositionsViewProps> = ({
  earnOpportunity,
  depositTokenBalance,
  isConnected,
  isLoading,
  hasDeposited,
  areActionsDisabled,
  onRefreshBalances,
}) => {
  const { t } = useTranslation();

  const renderFooter = () => {
    if (!isConnected) {
      return (
        <EarnDetailsActionsButtonsFallbackContainer>
          <ConnectButton />
        </EarnDetailsActionsButtonsFallbackContainer>
      );
    }

    if (isLoading) {
      return (
        <EarnDetailsActionsButtonsContainer>
          <BaseSurfaceSkeleton
            variant="rounded"
            sx={(theme) => ({
              height: 48,
              width: '100%',
              borderRadius: theme.shape.buttonBorderRadius,
            })}
          />
        </EarnDetailsActionsButtonsContainer>
      );
    }

    if (areActionsDisabled) {
      return (
        <EarnDetailsActionsButtonsFallbackContainer>
          <Typography variant="bodyMediumParagraph" color="text.secondary">
            <Trans
              i18nKey="earn.position.disabled"
              values={{ protocolName: earnOpportunity.protocol.name }}
              components={[
                earnOpportunity.protocol.url ? (
                  <ExternalLink href={earnOpportunity.protocol.url} />
                ) : (
                  <EmptyComponent />
                ),
              ]}
            />
          </Typography>
        </EarnDetailsActionsButtonsFallbackContainer>
      );
    }

    return (
      <EarnDetailsActionsButtonsContainer>
        <DepositFlowButton
          earnOpportunity={earnOpportunity}
          displayMode={DepositButtonDisplayMode.LabelOnly}
          size="large"
          label={t(hasDeposited ? 'buttons.deposit' : 'buttons.depositNow')}
          refetchCallback={onRefreshBalances}
          data-testid="quick-deposit-button"
          sx={{ flex: 1 }}
        />
        {hasDeposited && earnOpportunity.isRedeemable && (
          <WithdrawFlowButton
            earnOpportunity={earnOpportunity}
            size="large"
            label={t('buttons.withdrawButtonLabel')}
            refetchCallback={onRefreshBalances}
            data-testid="withdraw-button"
            sx={{ flex: 1 }}
          />
        )}
        {hasDeposited && !earnOpportunity.isRedeemable && (
          <RequestRedeemFlowButton
            earnOpportunity={earnOpportunity}
            size="large"
            label={t('buttons.withdrawButtonLabel')}
            refetchCallback={onRefreshBalances}
            data-testid="request-redeem-button"
            sx={{ flex: 1 }}
          />
        )}
      </EarnDetailsActionsButtonsContainer>
    );
  };

  return (
    <>
      <Tooltip
        title={
          depositTokenBalance.amount === 0n
            ? t('tooltips.noPositionsToManage')
            : undefined
        }
        placement="top"
        enterTouchDelay={0}
        arrow
        slotProps={tooltipSlotProps}
      >
        <Box>
          <TokenAmountInput
            tokenBalance={depositTokenBalance}
            mode={SelectCardMode.Display}
            sx={
              depositTokenBalance.amount > 0n
                ? selectCardStyles
                : { ...selectCardStyles, cursor: 'not-allowed' }
            }
          />
        </Box>
      </Tooltip>
      {renderFooter()}
    </>
  );
};
