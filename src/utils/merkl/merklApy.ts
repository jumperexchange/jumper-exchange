import { getMerklCampaign } from '@/app/lib/getMerklCampaign';
import type { MerklOpportunity } from '@/app/lib/getMerklOpportunities';
import { getMerklOpportunities } from '@/app/lib/getMerklOpportunities';
import type { RewardApiLink } from '@/types/jumper-backend';
import { flatMap, partition } from 'lodash';

type ApyContext = {
  opportunities: MerklOpportunity[];
  campaigns: Array<Awaited<ReturnType<typeof getMerklCampaign>>>;
};

const getMaxFromArray = (values: (number | undefined)[]): number => {
  const validValues = values.filter((v): v is number => v != null);
  return validValues.length ? Math.max(...validValues) : 0;
};

const getCampaignApy = (criteria: RewardApiLink, ctx: ApyContext): number => {
  const campaigns = ctx.campaigns.filter(
    (c): c is NonNullable<typeof c> => c != null,
  );
  const matchingCampaigns = campaigns.filter(
    (c) => c.id === criteria.identifier,
  );
  return getMaxFromArray(matchingCampaigns.map((c) => c.apr));
};

const getBreakdownApy = (criteria: RewardApiLink, ctx: ApyContext): number => {
  const breakdowns = flatMap(
    ctx.opportunities,
    (opp) => opp.aprRecord?.breakdowns ?? [],
  );
  const matchingBreakdowns = breakdowns.filter(
    (b) => b.identifier === criteria.identifier,
  );
  return getMaxFromArray(matchingBreakdowns.map((b) => b.value));
};

const getOpportunityApy = (
  criteria: RewardApiLink,
  ctx: ApyContext,
): number => {
  const hasMatchingOpportunity = ctx.opportunities.some(
    (o) => o.identifier === criteria.identifier,
  );

  if (!hasMatchingOpportunity) {
    return 0;
  }

  const breakdowns = flatMap(
    ctx.opportunities,
    (opp) => opp.aprRecord?.breakdowns ?? [],
  );
  return getMaxFromArray(breakdowns.map((b) => b.value));
};

const getApyForCriteria = (
  criteria: RewardApiLink,
  ctx: ApyContext,
): number => {
  switch (criteria.type) {
    case 'merkl-campaign':
      return getCampaignApy(criteria, ctx);
    case 'merkl-opportunity-breakdown':
      return getBreakdownApy(criteria, ctx);
    case 'merkl-opportunity':
      return getOpportunityApy(criteria, ctx);
    default:
      return 0;
  }
};

export const maxApyFromCriteria = (
  criteria: RewardApiLink[],
  ctx: ApyContext,
): number => {
  if (!criteria.length) {
    return 0;
  }

  const apyValues = criteria.map((c) => getApyForCriteria(c, ctx));
  return Math.max(0, ...apyValues);
};

export async function fetchOpportunitiesBySearch(
  criteria: RewardApiLink[],
): Promise<MerklOpportunity[]> {
  if (!criteria.length) {
    return [];
  }

  const results = await Promise.all(
    criteria.map((c) =>
      getMerklOpportunities({
        searchQueries: [c.identifier],
        chainIds: c.chain?.chainId ? [String(c.chain.chainId)] : [],
      }),
    ),
  );

  return results.flat();
}

export async function getMerklApy(criteria: RewardApiLink[]) {
  if (!criteria.length) {
    return { opportunities: [], maxApy: 0 };
  }

  const [campaignCriteria, opportunityCriteria] = partition(
    criteria,
    (c) => c.type === 'merkl-campaign',
  );

  const [campaigns, opportunities] = await Promise.all([
    Promise.all(campaignCriteria.map((c) => getMerklCampaign(c.identifier))),
    fetchOpportunitiesBySearch(opportunityCriteria),
  ]);

  const context: ApyContext = { campaigns, opportunities };

  return {
    opportunities,
    maxApy: maxApyFromCriteria(criteria, context),
  };
}
