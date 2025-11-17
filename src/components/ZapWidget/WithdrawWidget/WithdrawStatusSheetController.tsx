import type { FC } from 'react';
import { useCallback, useMemo } from 'react';
import { StatusBottomSheet } from '@/components/composite/StatusBottomSheet/StatusBottomSheet';
import { WithdrawSuccess } from './WithdrawSuccess';
import type { Token } from '@lifi/widget';
import type { Hex } from 'viem';
import type { WithdrawErrorType } from './WithdrawWidget.types';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { AppPaths } from '@/const/urls';
import { getErrorStatusContent } from './utils';
import { ANIMATION_DURATION_SECONDS, WITHDRAW_SHEET_STATES } from './constants';

interface WithdrawStatusSheetControllerProps {
  sheetState: string;
  containerId: string;
  token: Token;
  txHash?: Hex;
  value: string;
  chainId: number;
  withdrawErrorType: WithdrawErrorType | null;
  onCloseError: () => void;
  onCloseSuccess: () => void;
  onHeightChange: (height: number) => void;
}

export const WithdrawStatusSheetController: FC<
  WithdrawStatusSheetControllerProps
> = ({
  sheetState,
  containerId,
  token,
  txHash,
  value,
  chainId,
  withdrawErrorType,
  onCloseError,
  onCloseSuccess,
  onHeightChange,
}) => {
  const { t } = useTranslation();
  const router = useRouter();

  const handleNavigateToGas = useCallback(() => {
    onCloseError();
    router.push(AppPaths.Gas);
  }, [onCloseError, router]);

  const errorSheetProps = useMemo(() => {
    if (!withdrawErrorType || sheetState !== WITHDRAW_SHEET_STATES.ERROR) {
      return null;
    }

    return getErrorStatusContent(withdrawErrorType, t, handleNavigateToGas);
  }, [withdrawErrorType, sheetState, t, handleNavigateToGas]);

  return (
    <>
      {errorSheetProps && (
        <StatusBottomSheet
          {...errorSheetProps}
          containerId={containerId}
          isOpen={sheetState === WITHDRAW_SHEET_STATES.ERROR}
          onClose={onCloseError}
          onHeightChange={onHeightChange}
          transitionDuration={{
            enter: ANIMATION_DURATION_SECONDS * 1_000,
          }}
        />
      )}
      <StatusBottomSheet
        title={t('widget.withdraw.success.title')}
        status="success"
        containerId={containerId}
        isOpen={sheetState === WITHDRAW_SHEET_STATES.SUCCESS}
        onClose={onCloseSuccess}
        onHeightChange={onHeightChange}
        transitionDuration={{
          enter: ANIMATION_DURATION_SECONDS * 1_000,
        }}
      >
        <WithdrawSuccess
          token={token}
          value={value}
          onClose={onCloseSuccess}
          chainId={chainId}
          txHash={txHash}
        />
      </StatusBottomSheet>
    </>
  );
};
