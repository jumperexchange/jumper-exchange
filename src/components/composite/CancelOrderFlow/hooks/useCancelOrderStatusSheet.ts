'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { StatusBottomSheetProps } from '@/components/composite/StatusBottomSheet/StatusBottomSheet';
import { useGetAddressExplorerUrl } from '@/hooks/useBlockchainExplorerURL';
import { openInNewTab } from '@/utils/openInNewTab';
import type { CancelOrderResult } from './useCancelOrder';

type StatusSheetContent = Pick<
  StatusBottomSheetProps,
  | 'title'
  | 'description'
  | 'callToAction'
  | 'callToActionType'
  | 'secondaryCallToAction'
  | 'status'
  | 'onClick'
  | 'onSecondaryClick'
>;

interface UseCancelOrderStatusSheetOptions {
  isSuccess: boolean;
  isError: boolean;
  result?: CancelOrderResult;
  onRetry: () => void;
  onDone: () => void;
  onCloseError: () => void;
}

const EMPTY_CONTENT: StatusSheetContent = {
  title: '',
  callToAction: '',
  callToActionType: 'button',
};

/** Mirrors useDustConversionStatusSheet: keep the last content around while
 * the sheet plays its closing transition, instead of clearing it mid-animation. */
export const useCancelOrderStatusSheet = ({
  isSuccess,
  isError,
  result,
  onRetry,
  onDone,
  onCloseError,
}: UseCancelOrderStatusSheetOptions) => {
  const { t } = useTranslation();
  const getTxExplorerUrl = useGetAddressExplorerUrl('tx');
  const lastContentRef = useRef<StatusSheetContent | null>(null);

  // `StatusBottomSheet.onClose` fires both for a manual swipe-dismiss and for
  // the sheet auto-hiding whenever `isOpen` flips false (e.g. `isError`
  // clearing the instant a retry starts). Track dismissal locally instead of
  // treating either as "close the whole modal" — only a fresh success/error
  // (the rising edge below) is allowed to clear it and show the sheet again.
  const [isDismissed, setIsDismissed] = useState(false);
  const isTerminal = isSuccess || isError;
  const wasTerminalRef = useRef(false);

  useEffect(() => {
    if (isTerminal && !wasTerminalRef.current) {
      setIsDismissed(false);
    }
    wasTerminalRef.current = isTerminal;
  }, [isTerminal]);

  const explorerLink =
    result?.txLink ??
    (result?.txHash
      ? getTxExplorerUrl(result.chainId, result.txHash)
      : undefined);

  const content = useMemo((): StatusSheetContent | null => {
    if (isSuccess) {
      return {
        status: 'success',
        title: t('limitOrders.cancelModal.successTitle'),
        description: t('limitOrders.cancelModal.successDescription'),
        callToAction: t('limitOrders.cancelModal.done'),
        callToActionType: 'button',
        secondaryCallToAction: explorerLink
          ? t('limitOrders.cancelModal.viewOnExplorer')
          : undefined,
        onClick: onDone,
        onSecondaryClick: explorerLink
          ? () => openInNewTab(explorerLink)
          : undefined,
      };
    }
    if (isError) {
      return {
        status: 'error',
        title: t('limitOrders.cancelModal.errorTitle'),
        description: t('limitOrders.cancelModal.error'),
        callToAction: t('limitOrders.cancelModal.tryAgain'),
        callToActionType: 'button',
        secondaryCallToAction: t('limitOrders.cancelModal.close'),
        onClick: onRetry,
        onSecondaryClick: onCloseError,
      };
    }
    return null;
  }, [isSuccess, isError, explorerLink, onDone, onRetry, onCloseError, t]);

  useEffect(() => {
    if (content) {
      lastContentRef.current = content;
    }
  }, [content]);

  return {
    isOpen: isTerminal && !isDismissed,
    content: content ?? lastContentRef.current ?? EMPTY_CONTENT,
    onClose: () => setIsDismissed(true),
  };
};
