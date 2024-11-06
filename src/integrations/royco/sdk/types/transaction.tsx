import type { SupportedToken } from '../constants';
import type { TypedRoycoMarketType } from '../market';

export type TransactionOptionsType = {
  contractId: string;
  chainId: number;
  id: string;
  label: string;
  address: string;
  abi: any;
  functionName: string;
  marketType: TypedRoycoMarketType;
  args: any[];
  txStatus: string;
  txHash: string | null;
  tokensOut?: Array<
    SupportedToken & {
      raw_amount: string;
      token_amount: number;
    }
  >;
  tokensIn?: Array<
    SupportedToken & {
      raw_amount: string;
      token_amount: number;
    }
  >;
  requiredApprovalAmount?: string;
};
