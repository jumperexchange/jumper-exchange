import {
  BaseTransaction,
  ChainId,
  ChainKey,
  LifiStep,
  MultisigConfig,
  Route,
} from '@lifi/sdk';
import { WidgetConfig } from '@lifi/widget';
import SafeAppsSDK, {
  GatewayTransactionDetails,
  TransactionStatus,
} from '@safe-global/safe-apps-sdk';
import { useWallet } from '../providers/WalletProvider';
import { useMultisigStore } from '../stores';

export const useMultisig = () => {
  const { account } = useWallet();

  const { destinationChain } = useMultisigStore();

  const checkMultisigEnvironment = async () => {
    // in Multisig env, window.parent is not equal to window
    const isIframeEnvironment = window?.parent !== window;

    if (!isIframeEnvironment) {
      return false;
    }

    const sdk = new SafeAppsSDK();
    const accountInfo = await Promise.race([
      sdk.safe.getInfo(),
      new Promise<undefined>((resolve) => setTimeout(resolve, 200)),
    ]);

    return !!accountInfo?.safeAddress;
  };

  const isSafeSigner = !!(account?.signer?.provider as any)?.provider?.safe
    ?.safeAddress || false;

  type StatusType = 'DONE' | 'FAILED' | 'CANCELLED' | 'PENDING';
  interface HandleMultiSigTransactionDetailsProps {
    status: StatusType;
    txHash: string;
    updateIntermediateStatus?: () => void;
  }

  const handleMultiSigTransactionDetails: (
    txHash: string,
    chainId: number,
    updateIntermediateStatus: () => void,
  ) => Promise<HandleMultiSigTransactionDetailsProps> = async (
    txHash,
    chainId,
    updateIntermediateStatus,
  ) => {
    const safeProviderSDK = (account?.signer?.provider as any)?.provider?.sdk;

    const safeTransactionDetails: GatewayTransactionDetails =
      await safeProviderSDK.txs.getBySafeTxHash(txHash);

    const safeTxHash = safeTransactionDetails.txId;

    const safeApiTransactionResponse = await fetch(
      `https://safe-client.safe.global/v1/chains/${chainId}/transactions/${safeTxHash}`,
    );

    const safeApiTransactionDetails = await safeApiTransactionResponse.json();

    const nonTerminalStatus = [
      TransactionStatus.SUCCESS,
      TransactionStatus.CANCELLED,
      TransactionStatus.FAILED,
    ];

    const isSafeStatusPending =
      !nonTerminalStatus.includes(safeTransactionDetails.txStatus) &&
      !nonTerminalStatus.includes(safeApiTransactionDetails.txStatus);

    const isAwaitingExecution = [
      safeTransactionDetails.txStatus,
      safeApiTransactionDetails.txStatus,
    ].includes(TransactionStatus.AWAITING_EXECUTION);

    if (isAwaitingExecution) {
      updateIntermediateStatus();
    }

    if (isSafeStatusPending) {
      await new Promise((resolve) => {
        setTimeout(resolve, 5000);
      });

      return await handleMultiSigTransactionDetails(
        txHash,
        chainId,
        updateIntermediateStatus,
      );
    }

    if (
      [
        safeTransactionDetails.txStatus,
        safeApiTransactionDetails.txStatus,
      ].includes(TransactionStatus.SUCCESS)
    ) {
      return {
        status: 'DONE',
        txHash: safeTransactionDetails.txHash,
      };
    }

    if (
      [
        safeTransactionDetails.txStatus,
        safeApiTransactionDetails.txStatus,
      ].includes(TransactionStatus.FAILED)
    ) {
      return {
        status: 'FAILED',
        txHash: safeTransactionDetails.txHash,
      };
    }

    if (
      [
        safeTransactionDetails.txStatus,
        safeApiTransactionDetails.txStatus,
      ].includes(TransactionStatus.CANCELLED)
    ) {
      return {
        status: 'CANCELLED',
        txHash: safeTransactionDetails.txHash,
      };
    }

    if (isSafeStatusPending) {
      return {
        status: 'PENDING',
        txHash: safeTransactionDetails.txHash,
      };
    }

    return {
      status: safeTransactionDetails.txStatus,
      txHash: safeTransactionDetails.txHash,
    };
  };

  const handleSendingBatchTransaction = async (
    batchTransactions: BaseTransaction[],
  ) => {
    const safeProviderSDK = (account?.signer?.provider as any)?.provider?.sdk;

    try {
      const { safeTxHash } = await safeProviderSDK.txs.send({
        txs: batchTransactions,
      });

      return {
        hash: safeTxHash,
      };
    } catch (error) {
      throw new Error(error as string);
    }
  };

  const getMultisigWidgetConfig = (): Partial<{
    multisigWidget: Partial<WidgetConfig>;
    multisigSdkConfig: MultisigConfig;
  }> => {
    const multisigConfig = {
      isMultisigSigner: isSafeSigner,
      getMultisigTransactionDetails: handleMultiSigTransactionDetails,
      shouldBatchTransactions: isSafeSigner,
      sendBatchTransaction: handleSendingBatchTransaction,
    };

    if (isSafeSigner) {
      const currentChain = account.chainId;

      const fromChain: ChainId = Object.values(ChainId).find(
        (chainId) => chainId !== currentChain,
      ) as ChainId;

      const shouldRequireToAddress = account.chainId !== destinationChain;

      return {
        multisigWidget: {
          fromChain: ChainKey[fromChain],
          requiredUI: shouldRequireToAddress ? ['toAddress'] : [],
        },
        multisigSdkConfig: {
          ...multisigConfig,
        },
      };
    }

    return {};
  };

  const shouldOpenMultisigSignatureModal = (route: Route) => {
    const isRouteDone = route.steps.every(
      (step: LifiStep) =>
        step.execution?.status === 'DONE',
    );

    const isRouteFailed = route.steps.some(
      (step: LifiStep) =>
        step.execution?.status === 'FAILED',
    );

    const multisigRouteStarted = route.steps.some(
      (step: LifiStep) =>
        step.execution?.process.find(
          (process) =>
            !!process.multisigTxHash && process.status === 'ACTION_REQUIRED',
        ),
    );

    return !isRouteDone && !isRouteFailed && multisigRouteStarted;
  };

  return {
    isMultisigSigner: isSafeSigner,
    getMultisigWidgetConfig,
    checkMultisigEnvironment,
    shouldOpenMultisigSignatureModal,
  };
};
