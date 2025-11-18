import type { ContractCall, TokenAmount } from '@lifi/widget';
import { WithdrawWidgetBox } from './WithdrawWidget.style';
import type { AbiFunction } from 'viem';
import type { ProjectData } from 'src/types/questDetails';
import { WithdrawForm } from './WithdrawForm';
import {
  useWithdrawTransactionState,
  useWithdrawTransactionExecution,
  useWithdrawTracking,
} from './hooks';
import { useAccount } from '@lifi/wallet-management';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { SectionCardContainer } from 'src/components/Cards/SectionCard/SectionCard.style';
import type { Theme, SxProps } from '@mui/material/styles';
import { HeightAnimatedContainer } from '@/components/core/HeightAnimatedContainer/HeightAnimatedContainer';
import { motion } from 'motion/react';
import { WithdrawStatusSheetController } from './WithdrawStatusSheetController';
import { useToken } from '@/hooks/useToken';
import { getButtonLabel } from './utils';
import { useTranslation } from 'react-i18next';
import {
  BOTTOM_SHEET_TOP_OFFSET,
  MODAL_BOTTOM_SHEET_MIN_HEIGHT,
  ANIMATION_DURATION_SECONDS,
  CONTAINER_ID,
  WITHDRAW_SHEET_STATES,
} from './constants';

export interface WithdrawWidgetProps {
  poolName?: string;
  token: TokenAmount;
  contractCalls?: ContractCall[];
  lpTokenDecimals: number;
  projectData: ProjectData;
  depositTokenData: number | bigint | undefined;
  refetchPosition: () => void;
  withdrawAbi?: AbiFunction;
  sx?: SxProps<Theme>;
}

export const WithdrawWidget: React.FC<WithdrawWidgetProps> = ({
  poolName,
  token,
  lpTokenDecimals,
  projectData,
  depositTokenData,
  refetchPosition,
  withdrawAbi,
  sx,
}) => {
  const { t } = useTranslation();
  const { account } = useAccount();
  const { token: tokenInfo } = useToken(token.chainId, token.address);

  const enhancedToken = useMemo(() => {
    return tokenInfo || token;
  }, [tokenInfo, token]);

  const [sheetState, setSheetState] = useState<string>(
    WITHDRAW_SHEET_STATES.HIDDEN,
  );

  const transactionState = useWithdrawTransactionState({
    accountAddress: account.address,
    projectData,
  });

  const { sendWithdrawTx } = useWithdrawTransactionExecution({
    withdrawAbi,
    projectData,
    writeDecimals: lpTokenDecimals,
    accountAddress: account.address,
    enhancedToken,
    state: transactionState,
  });

  useWithdrawTracking({
    projectData,
    enhancedToken,
    withdrawValue: transactionState.value,
    isTransactionReceiptSuccess: transactionState.isTransactionReceiptSuccess,
    withdrawStep: transactionState.withdrawStep,
    refetchPosition,
  });

  useEffect(() => {
    if (transactionState.withdrawErrorType) {
      setSheetState(WITHDRAW_SHEET_STATES.ERROR);
    }
  }, [transactionState.withdrawErrorType]);

  useEffect(() => {
    if (
      !transactionState.isTransactionReceiptLoading &&
      transactionState.isTransactionReceiptSuccess &&
      !!transactionState.txHash
    ) {
      setSheetState(WITHDRAW_SHEET_STATES.SUCCESS);
    }
  }, [
    transactionState.isTransactionReceiptLoading,
    transactionState.isTransactionReceiptSuccess,
    transactionState.txHash,
  ]);

  const handleCloseErrorBottomSheet = useCallback(() => {
    setSheetState(WITHDRAW_SHEET_STATES.HIDDEN);
  }, []);

  const handleCloseSuccessBottomSheet = useCallback(() => {
    transactionState.resetState();
    transactionState.setValue('');
    setSheetState(WITHDRAW_SHEET_STATES.HIDDEN);
  }, [transactionState]);

  const handleSubmit = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();

      setSheetState(WITHDRAW_SHEET_STATES.HIDDEN);

      const form = event.currentTarget as unknown as HTMLFormElement;
      const formData = new FormData(form);
      const values = Object.fromEntries(formData.entries());
      const value = values['withdrawValue'].toString();

      try {
        sendWithdrawTx(value);
      } catch (e) {
        console.error(e);
      }
    },
    [sendWithdrawTx],
  );

  const buttonLabel = getButtonLabel(transactionState.withdrawStep, t);
  const isSheetOpen = sheetState !== WITHDRAW_SHEET_STATES.HIDDEN;

  return (
    <HeightAnimatedContainer
      isOpen={isSheetOpen}
      offsetHeight={BOTTOM_SHEET_TOP_OFFSET}
      minHeight={MODAL_BOTTOM_SHEET_MIN_HEIGHT}
      animationDuration={ANIMATION_DURATION_SECONDS}
    >
      {({ motionProps, onHeightChange }) => (
        <motion.div {...motionProps}>
          <SectionCardContainer
            id={CONTAINER_ID}
            as="form"
            onSubmit={handleSubmit}
            sx={{
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              height: '100%',
              ...sx,
            }}
          >
            <WithdrawWidgetBox>
              <WithdrawForm
                submitLabel={buttonLabel}
                isSubmitDisabled={transactionState.isPending}
                isSubmitLoading={
                  transactionState.isTransactionReceiptLoading ||
                  transactionState.isPending
                }
                projectData={projectData}
                token={enhancedToken}
                poolName={poolName}
                balance={depositTokenData?.toString() ?? '0'}
                lpTokenDecimals={lpTokenDecimals}
                setWithdrawValue={transactionState.setValue}
                withdrawValue={transactionState.value}
              />
            </WithdrawWidgetBox>
            <WithdrawStatusSheetController
              sheetState={sheetState}
              containerId={CONTAINER_ID}
              token={enhancedToken}
              txHash={transactionState.txHash}
              value={transactionState.value}
              chainId={projectData?.chainId}
              withdrawErrorType={transactionState.withdrawErrorType}
              onCloseError={handleCloseErrorBottomSheet}
              onCloseSuccess={handleCloseSuccessBottomSheet}
              onHeightChange={onHeightChange}
            />
          </SectionCardContainer>
        </motion.div>
      )}
    </HeightAnimatedContainer>
  );
};
