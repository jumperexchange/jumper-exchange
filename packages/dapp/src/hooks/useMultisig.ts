import { WidgetConfig } from '@lifi/widget';
import { useWallet } from '../providers/WalletProvider';
import { BaseTransaction, ChainId, ChainKey, MultisigConfig } from '@lifi/sdk';
import {
  GatewayTransactionDetails,
  TransactionStatus,
} from '@safe-global/safe-apps-sdk';
import SafeAppsSDK from '@safe-global/safe-apps-sdk/dist/src/sdk';
import { Route } from '@lifi/sdk';

export const useMultisig = () => {
  const { account } = useWallet();

  const checkMultisigEnvironment = async () => {
    const sdk = new SafeAppsSDK();
    const accountInfo = await sdk.safe.getInfo();

    return !!accountInfo;
  };

  const isSafeSigner = !!(account?.signer?.provider as any)?.provider?.safe
    ?.safeAddress;

  const handleMultiSigTransactionDetails = async (
    txHash: string,
    chainId: number,
    updateIntermediateStatus: () => void,
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
      console.log('Updating intermediate status');
      updateIntermediateStatus();
    }

    console.log({
      isSafeStatusPending,
      sdkStatus: safeTransactionDetails.txStatus,
      apiStatus: safeApiTransactionDetails.txStatus,
    });

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
    console.log('Batching');
    const safeProviderSDK = (account?.signer?.provider as any)?.provider?.sdk;

    try {
      const { safeTxHash } = await safeProviderSDK.txs.send({
        txs: batchTransactions,
      });

      return {
        hash: safeTxHash,
      };
    } catch (error) {
      throw new Error(error);
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

      return {
        multisigWidget: {
          fromChain: ChainKey[fromChain],
          requiredUI: ['toAddress'],
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
      (step) => step.execution?.status === 'DONE',
    );

    const isRouteFailed = route.steps.some(
      (step) => step.execution?.status === 'FAILED',
    );

    const multisigRouteStarted = route.steps.some((step) =>
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
