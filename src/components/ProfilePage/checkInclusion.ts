export function checkInclusion(
  activeCampaigns: string[],
  claimingIds: string[],
): boolean {
  const lowerActiveCampaigns = activeCampaigns.map((cId) => cId.toLowerCase());
  for (const id of claimingIds) {
    if (lowerActiveCampaigns.includes(id.toLowerCase())) {
      return true;
    }
  }
  return false;
}
