interface DeFiReacherClaimArgs {
  index: string;
  account: string;
  amount: string;
  merkleProof: string[];
}

export interface DeFiReacherClaimCalldata {
  calldata: string;
  contractAddress: string;
  chainId: number;
  functionName: string;
  args: DeFiReacherClaimArgs;
}
export const getDeFiReacherRewardClaimCalldata = async (
  userAddress: string,
  campaignId: string,
): Promise<DeFiReacherClaimCalldata> => {
  const response = await fetch(
    `/api/rewards/defireacher/${encodeURIComponent(
      userAddress,
    )}/${encodeURIComponent(campaignId)}/calldata`,
  );

  if (!response.ok) {
    throw new Error('Failed to fetch DeFi Reacher calldata');
  }

  return response.json();
};
