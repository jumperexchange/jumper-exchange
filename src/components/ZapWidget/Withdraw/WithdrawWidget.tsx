import { type ContractCall, type TokenAmount } from '@lifi/widget';
import { formatUnits } from 'viem';
import { WithdrawWidgetBox } from './WithdrawWidget.style';
import type { AbiFunction } from 'viem';
import { ProjectData } from 'src/types/questDetails';
import { WithdrawForm } from './WithdrawForm';
import { useWithdrawTransaction } from './hooks';
import { useAccount } from '@lifi/wallet-management';
import { useChains } from 'src/hooks/useChains';
import { useMemo } from 'react';
import { TxConfirmation } from '../Confirmation/TxConfirmation';

export interface WithdrawWidgetProps {
  poolName?: string;
  token: TokenAmount;
  contractCalls?: ContractCall[];
  lpTokenDecimals: number;
  projectData: ProjectData;
  depositTokenData: number | bigint | undefined;
  refetchPosition: () => void;
  withdrawAbi?: AbiFunction;
}

export const WithdrawWidget: React.FC<WithdrawWidgetProps> = ({
  poolName,
  token,
  lpTokenDecimals,
  projectData,
  depositTokenData,
  refetchPosition,
  withdrawAbi,
}) => {
  const { account } = useAccount();
  const chains = useChains();
  const chain = useMemo(
    () => chains.getChainById(projectData?.chainId),
    [projectData?.chainId],
  );
  const {
    sendWithdrawTx,
    successDataRef,
    txHash,
    txError,
    isTransactionReceiptLoading,
    isTransactionReceiptSuccess,
    isWriteContractDataError,
    isWriteContractDataPending,
    isWriteContractDataSuccess,
  } = useWithdrawTransaction({
    projectData,
    writeDecimals: lpTokenDecimals,
    withdrawAbi,
    accountAddress: account.address,
  });

  return (
    <WithdrawWidgetBox>
      <WithdrawForm
        submitLabel={'Redeem'} // This belongs to contractCalls[0].label
        errorMessage={txError?.name}
        sendWithdrawTx={sendWithdrawTx}
        successDataRef={successDataRef}
        isSubmitDisabled={isWriteContractDataPending}
        isSubmitLoading={
          isTransactionReceiptLoading || isWriteContractDataPending
        }
        refetchPosition={refetchPosition}
        projectData={projectData}
        token={token}
        poolName={poolName}
        balance={
          depositTokenData
            ? formatUnits(BigInt(depositTokenData), lpTokenDecimals)
            : '0.00'
        }
      />
      {isTransactionReceiptSuccess && (
        <TxConfirmation
          s={'Withdraw successful'}
          link={`${chain?.metamask.blockExplorerUrls?.[0] ?? 'https://etherscan.io/'}tx/${txHash}`}
          success={
            !!isWriteContractDataSuccess && !isWriteContractDataPending
              ? true
              : false
          }
        />
      )}

      {!isTransactionReceiptSuccess && txHash && (
        <TxConfirmation
          s={'Check on explorer'}
          link={`${chain?.metamask.blockExplorerUrls?.[0] ?? 'https://etherscan.io/'}tx/${txHash}`}
          success={false}
        />
      )}
    </WithdrawWidgetBox>
  );
};
