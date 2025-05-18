import { ChainType, Route } from '@lifi/sdk';
import { Account } from '@lifi/wallet-management';
import { TransferResponse } from 'src/types/transfers';
import { MIN_CONTRIBUTION_USD } from './constants';
import {
  checkContributionByTxHistory,
  getContributionFeeAddress,
} from './utils';

export const hasValidTransferData = (
  data: TransferResponse | null | undefined,
  completedRoute?: Route,
): boolean => {
  return !!data?.transfers && !!completedRoute?.toAmountUSD;
};

export const hasValidAccountData = (account?: Account): boolean => {
  return !!account?.chainType;
};

export const isTransactionAmountEligible = (amountUSD?: string): boolean => {
  return Number(amountUSD) >= MIN_CONTRIBUTION_USD;
};

export const isSameWalletTransfer = (
  fromAddress?: string,
  toAddress?: string,
): boolean => {
  return fromAddress === toAddress;
};

export const isWalletAccessValid = (
  accountAddress?: string,
  fromAddress?: string,
): boolean => {
  return accountAddress === fromAddress;
};

export const isEvmChainType = (chainType?: ChainType): boolean => {
  return chainType === ChainType.EVM;
};

export const hasValidContributionFeeAddress = (chainId: number): boolean => {
  const contributionFeeAddress = getContributionFeeAddress(chainId);
  return !!contributionFeeAddress;
};

export const isEligibleForContribution = (
  data: TransferResponse | null | undefined,
  completedRoute: Route | undefined,
  account: Account | undefined,
  isContributionAbEnabled: boolean,
): boolean => {
  if (
    !hasValidTransferData(data, completedRoute) ||
    !hasValidAccountData(account)
  ) {
    return false;
  }

  const isContributionEnabledByTxHistory = checkContributionByTxHistory(
    data?.transfers,
  );

  if (!completedRoute?.toChainId) {
    return false;
  }

  return (
    isTransactionAmountEligible(completedRoute.toAmountUSD) &&
    isSameWalletTransfer(
      completedRoute.fromAddress,
      completedRoute.toAddress,
    ) &&
    isWalletAccessValid(account?.address, completedRoute.fromAddress) &&
    isContributionAbEnabled &&
    isContributionEnabledByTxHistory &&
    isEvmChainType(account?.chainType) &&
    hasValidContributionFeeAddress(completedRoute.toChainId)
  );
};
