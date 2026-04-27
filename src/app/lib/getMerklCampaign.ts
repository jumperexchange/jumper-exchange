import * as Sentry from '@sentry/nextjs';
import { MERKL_API } from 'src/utils/merkl/merklApi';

export interface MerklCampaignResponse {
  id: string;
  campaignId: string;
  apr: number;
  opportunityId: string;
  [key: string]: unknown;
}

export async function getMerklCampaign(
  campaignId: string,
): Promise<MerklCampaignResponse | null> {
  try {
    const res = await fetch(
      `${MERKL_API}/v4/campaigns/${encodeURIComponent(campaignId)}`,
      {
        next: { revalidate: 60 * 5 },
      },
    );
    if (!res.ok) {
      return null;
    }
    const data: MerklCampaignResponse = await res.json();
    return data;
  } catch (error) {
    Sentry.withScope((scope) => {
      scope.setExtra('campaignId', campaignId);
      Sentry.captureException(error);
    });
    console.error(`Error fetching Merkl campaign ${campaignId}:`, error);
    return null;
  }
}
