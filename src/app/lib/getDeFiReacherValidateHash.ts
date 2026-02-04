import type { Hex } from 'viem';

export interface DeFiReacherValidateHashResponse {
  success: boolean;
  status: string;
  campaignId?: string;
  transactionHash?: string;
  walletAddress?: string;
}

export const getDeFiReacherValidateHash = async (
  txHash: Hex,
): Promise<DeFiReacherValidateHashResponse> => {
  const response = await fetch(`/api/rewards/defireacher/validate/${txHash}`);
  if (!response.ok) {
    throw new Error('Failed to validate hash');
  }
  return response.json();
};
