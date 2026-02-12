import { ModalContainer } from '@/components/core/modals/ModalContainer/ModalContainer';
import type { ModalContainerProps } from '@/components/core/modals/ModalContainer/ModalContainer';
import type { EarnOpportunityExtended } from '@/stores/depositFlow/DepositFlowStore';
import { useMemo, useState, type FC } from 'react';
import { motion } from 'motion/react';
import { SectionCard } from '@/components/Cards/SectionCard/SectionCard';
import { useRedeemableClaims } from '@/hooks/earn/useRedeemableClaims';
import { useFormatRedeemClaimData } from './hooks/useFormatRedeemClaimData';
import type { RequestRedeemModalView } from './types';
import { RequestWithdrawView } from './components/RequestWithdrawView';
import { ExecuteWithdrawView } from './components/ExecuteWithdrawView';
import {
  ANIMATION_DURATION_MS,
  ANIMATION_DURATION_SECONDS,
  BOTTOM_SHEET_TOP_OFFSET,
  MODAL_CONTAINER_ID,
} from './constants';
import { HeightAnimatedContainer } from '@/components/core/HeightAnimatedContainer/HeightAnimatedContainer';
import { StatusBottomSheet } from '@/components/composite/StatusBottomSheet/StatusBottomSheet';
import { useRedeemTransactionForm } from './hooks/useRedeemTransactionForm';
import { useRedeemTransactionStatusContent } from './hooks/useRedeemTransactionStatusContent';
import { TokenAmountInput } from '@/components/composite/TokenAmountInput/TokenAmountInput';
import { SelectCardMode } from '@/components/Cards/SelectCard/SelectCard.styles';
import { createExtendedToken, createTokenBalance } from '@/types/tokens';
import { useToken } from '@/hooks/useToken';
import type { Address } from 'viem';
import { useTranslation } from 'react-i18next';

interface RequestRedeemModalProps extends ModalContainerProps {
  earnOpportunity: EarnOpportunityExtended;
  refetchCallback?: () => void;
}

export const RequestRedeemModal: FC<RequestRedeemModalProps> = ({
  onClose,
  isOpen,
  earnOpportunity,
  refetchCallback,
}) => {
  const { t } = useTranslation();
  const [currentView, setCurrentView] =
    useState<RequestRedeemModalView>('requestWithdraw');
  const [selectedClaimId, setSelectedClaimId] = useState<string | null>(null);

  const { data: redeemableClaims, refetch: refetchClaims } =
    useRedeemableClaims(earnOpportunity, true);
  const formattedRedeemableClaims = useFormatRedeemClaimData(redeemableClaims);

  const selectedClaim = useMemo(
    () =>
      selectedClaimId
        ? formattedRedeemableClaims.find(
            (claim) => claim.id === selectedClaimId,
          )
        : null,
    [formattedRedeemableClaims, selectedClaimId],
  );

  // Initialize the unified form hook based on current view
  const transactionForm = useRedeemTransactionForm({
    earnOpportunity,
    onSuccess: () => {
      refetchClaims();
      refetchCallback?.();
      if (currentView === 'claimRedeem') {
        handleBackToRequest();
      }
    },
    config:
      currentView === 'claimRedeem' && selectedClaim
        ? {
            type: 'claim',
            claimId: selectedClaim.id,
            claimAmount: selectedClaim.assetAmount ?? '0',
          }
        : {
            type: 'request',
            initialAmount: '0',
          },
  });

  // Get tokens for success sheet content
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

  // Generate status content based on transaction type
  const statusContent = useRedeemTransactionStatusContent({
    transactionType: transactionForm.transactionType,
    errorType: transactionForm.errorType,
    handlers: {
      onCloseError: transactionForm.handleCloseError,
      onCloseSuccess: transactionForm.handleCloseSuccess,
      onRetry: transactionForm.handleRetry,
      onViewTransaction: transactionForm.handleViewTransaction,
      onConfirm: transactionForm.handleConfirm,
    },
  });

  const handleClaimClick = (claimId: string) => {
    setSelectedClaimId(claimId);
    setCurrentView('claimRedeem');
  };

  const handleBackToRequest = () => {
    setCurrentView('requestWithdraw');
    setSelectedClaimId(null);
    transactionForm.resetForm();
  };

  const handleModalClose = () => {
    setCurrentView('requestWithdraw');
    setSelectedClaimId(null);
    transactionForm.resetForm();
    onClose?.();
  };

  // Track if any status sheet is open
  const isAnySheetOpen =
    transactionForm.showConfirmationSheet ||
    transactionForm.showErrorBottomSheet ||
    transactionForm.showSuccessSheet;

  // Create token balances for success sheet
  const successSheetTokenBalance = useMemo(() => {
    if (currentView === 'requestWithdraw') {
      // Request flow: show LP token amount
      const priceUSD = extendedFromToken?.priceUSD ?? '0';
      const lpToken = createExtendedToken(earnOpportunity.lpToken, priceUSD);
      return createTokenBalance(lpToken, BigInt(transactionForm.amount ?? 0));
    } else if (selectedClaim) {
      // Claim flow: show asset token amount
      const priceUSD = extendedToToken?.priceUSD ?? '0';
      const assetToken = createExtendedToken(earnOpportunity.asset, priceUSD);
      return createTokenBalance(
        assetToken,
        BigInt(selectedClaim.assetAmount ?? 0),
      );
    }
    return null;
  }, [
    currentView,
    earnOpportunity,
    extendedFromToken,
    extendedToToken,
    transactionForm.amount,
    selectedClaim,
  ]);

  return (
    <ModalContainer isOpen={isOpen} onClose={handleModalClose}>
      <SectionCard
        id={MODAL_CONTAINER_ID}
        sx={(theme) => ({
          maxHeight: 'calc(100vh - 6rem)',
          width: 'calc(100vw - 2rem)',
          maxWidth: 400,
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: `${theme.shape.cardBorderRadiusLarge}px`,
          padding: 0,
          [theme.breakpoints.up('sm')]: {
            width: 400,
          },
        })}
      >
        <HeightAnimatedContainer
          isOpen={isAnySheetOpen}
          offsetHeight={BOTTOM_SHEET_TOP_OFFSET}
          animationDuration={ANIMATION_DURATION_SECONDS}
          defaultHeight="100%"
        >
          {({ onHeightChange, motionProps }) => (
            <motion.div {...motionProps}>
              {currentView === 'requestWithdraw' && (
                <RequestWithdrawView
                  earnOpportunity={earnOpportunity}
                  claims={formattedRedeemableClaims}
                  onClaimClick={handleClaimClick}
                  formState={transactionForm}
                />
              )}
              {currentView === 'claimRedeem' && selectedClaim && (
                <ExecuteWithdrawView
                  claim={selectedClaim}
                  earnOpportunity={earnOpportunity}
                  onBack={handleBackToRequest}
                  formState={transactionForm}
                />
              )}

              {/* Single Confirmation Sheet - Only for request flow */}
              {transactionForm.transactionType === 'request' && (
                <StatusBottomSheet
                  {...statusContent.confirmationSheetContent}
                  containerId={MODAL_CONTAINER_ID}
                  isOpen={transactionForm.showConfirmationSheet}
                  onClose={transactionForm.handleCloseSheet}
                  onHeightChange={onHeightChange}
                  transitionDuration={{
                    enter: ANIMATION_DURATION_MS,
                  }}
                />
              )}

              {/* Single Error Sheet - Shared by both flows */}
              <StatusBottomSheet
                {...statusContent.errorSheetContent}
                containerId={MODAL_CONTAINER_ID}
                isOpen={transactionForm.showErrorBottomSheet}
                onClose={transactionForm.handleCloseSheet}
                onHeightChange={onHeightChange}
                transitionDuration={{
                  enter: ANIMATION_DURATION_MS,
                }}
              />

              {/* Single Success Sheet - Shared by both flows with dynamic content */}
              <StatusBottomSheet
                {...statusContent.successSheetContent}
                containerId={MODAL_CONTAINER_ID}
                isOpen={transactionForm.showSuccessSheet}
                onClose={transactionForm.handleCloseSheet}
                onHeightChange={onHeightChange}
                sx={(theme) => ({
                  gap: theme.spacing(2),
                })}
                transitionDuration={{
                  enter: ANIMATION_DURATION_MS,
                }}
              >
                {successSheetTokenBalance && (
                  <TokenAmountInput
                    label={t(
                      `form.labels.${currentView === 'requestWithdraw' ? 'requested' : 'received'}`,
                    )}
                    tokenBalance={successSheetTokenBalance}
                    mode={SelectCardMode.Display}
                    sx={(theme) => ({
                      backgroundColor: (theme.vars || theme).palette.surface1
                        .main,
                      boxShadow: theme.shadows[2],
                      '& .MuiInputLabel-root': {
                        ...theme.typography.title2XSmall,
                      },
                    })}
                  />
                )}
              </StatusBottomSheet>
            </motion.div>
          )}
        </HeightAnimatedContainer>
      </SectionCard>
    </ModalContainer>
  );
};
