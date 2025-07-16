import { ProjectData } from 'src/types/questDetails';
import { type TokenAmount } from '@lifi/widget';
import { RefObject } from 'react';

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

export interface SuccessDataRef {
  token?: TokenAmount;
  tokenPriceUSD?: string;
  value?: string;
  callback?: () => void;
}

export interface WithdrawFormProps {
  errorMessage?: string;
  projectData: ProjectData;
  balance: string;
  token: TokenAmount;
  poolName?: string;
  overrideStyle?: {
    mainColor?: string;
  };
  refetchPosition: () => void;
  sendWithdrawTx: (value: string) => void;
  successDataRef: RefObject<SuccessDataRef>;
  isSubmitDisabled?: boolean;
  isSubmitLoading?: boolean;
  submitLabel?: string;
}
