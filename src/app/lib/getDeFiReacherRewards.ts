export interface DeFiReacherApiReward {
  chainId: number;
  tokenAddress: string;
  tokenSymbol: string;
  tokenDecimals: number;
  amount: string;
  amountFormatted: string;
  campaignId: string;
  contractAddress: string;
  status: string;
  creatorAddress: string;
}

export interface DeFiReacherApiResponse {
  data: DeFiReacherApiReward[];
}

export const getDeFiReacherRewards = async (
  userAddress: string,
): Promise<DeFiReacherApiReward[]> => {
  const response = await fetch(
    `/api/rewards/defireacher/${encodeURIComponent(userAddress)}`,
  );

  if (!response.ok) {
    throw new Error('Failed to fetch DeFi Reacher rewards');
  }

  const data: DeFiReacherApiResponse = await response.json();
  return data.data || [];
};
