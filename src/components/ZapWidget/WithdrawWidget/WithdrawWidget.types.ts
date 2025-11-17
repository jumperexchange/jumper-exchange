import type { ProjectData } from 'src/types/questDetails';
import type { Token } from '@lifi/widget';
import { type TokenAmount } from '@lifi/widget';
import type { Dispatch, SetStateAction, RefObject } from 'react';
import type { Hex } from 'viem';

export interface BaseContractCall {
  label: string;
  onVerify: <T>(args: T | unknown) => Promise<boolean>;
}

export interface SignContractCall extends BaseContractCall {
  type: 'sign';
  message: string;
}

export interface SendContractCall extends BaseContractCall {
  type: 'send';
  data: string;
}

export type ContractCall = SignContractCall | SendContractCall;

export interface WithdrawFormProps {
  errorMessage?: string;
  projectData: ProjectData;
  balance: string;
  token: Token;
  poolName?: string;
  overrideStyle?: {
    mainColor?: string;
  };
  isSubmitDisabled?: boolean;
  isSubmitLoading?: boolean;
  submitLabel?: string;
  lpTokenDecimals: number;
  setWithdrawValue: Dispatch<SetStateAction<string>>;
  withdrawValue: string;
}

export interface WithdrawStatusSheetContent {
  title: string;
  description: string;
  callToAction: string;
  callToActionType: 'submit' | 'button';
  onClick?: () => void;
}

export enum WithdrawErrorType {
  ChainSwitchFailed = 'chainSwitchFailed',
  SignatureFailed = 'signatureFailed',
  InsufficientGas = 'insufficientGas',
  TransactionFailed = 'transactionFailed',
}

export interface WithdrawSuccessProps {
  token: Token;
  value: string;
  chainId: number;
  txHash?: Hex;
  onClose: () => void;
}
