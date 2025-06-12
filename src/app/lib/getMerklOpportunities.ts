import { merklApi } from 'src/utils/merkl/merklApi';

// Infer types from the API
type MerklOpportunitesApiResponse = Awaited<
  ReturnType<typeof merklApi.opportunities.get>
>;

type MerklOpportunitiesResponse = NonNullable<
  MerklOpportunitesApiResponse['data']
>;
export type MerklOpportunity = NonNullable<MerklOpportunitiesResponse[0]>;
interface GetMerklOpportunitiesProps {
  campaignId?: string;
  chainIds?: string[];
  searchQueries?: string[];
}

export async function getMerklOpportunities({
  campaignId,
  chainIds,
  searchQueries,
}: GetMerklOpportunitiesProps): Promise<MerklOpportunity[]> {
  if (!chainIds?.length && !searchQueries?.length && !campaignId) {
    return [];
  }

  try {
    const allOpportunities: MerklOpportunity[] = [];

    // If we have multiple chainIds, loop through them first
    if (chainIds?.length) {
      for (const chainIdItem of chainIds) {
        // if search queries are provided, fetch all opportunities for that chain and search query
        if (searchQueries?.length) {
          for (const searchItem of searchQueries) {
            try {
              const response = await merklApi.opportunities.get({
                query: {
                  chainId: chainIdItem,
                  search: searchItem,
                },
              });

              if (response.data && Array.isArray(response.data)) {
                allOpportunities.push(
                  ...(response.data.filter(Boolean) as MerklOpportunity[]),
                );
              }
            } catch (error) {
              console.error(
                `Error fetching opportunities for chain ${chainIdItem} and search ${searchItem}:`,
                error,
              );
            }
          }
        } else {
          // if no search queries, fetch all opportunities for that chain
          try {
            const response = await merklApi.opportunities.get({
              query: {
                chainId: chainIdItem,
              },
            });

            if (response.data && Array.isArray(response.data)) {
              allOpportunities.push(
                ...(response.data.filter(Boolean) as MerklOpportunity[]),
              );
            }
          } catch (error) {
            console.error(
              `Error fetching opportunities for chain ${chainIdItem}:`,
              error,
            );
          }
        }
      }
    } else {
      if (campaignId) {
        // if only campaignId is provided, fetch all opportunities for that campaign
        try {
          const response = await merklApi.opportunities.get({
            query: {
              campaignId,
            },
          });
          if (response.data && Array.isArray(response.data)) {
            allOpportunities.push(
              ...(response.data.filter(Boolean) as MerklOpportunity[]),
            );
          }
        } catch (error) {
          console.error(
            `Error fetching opportunities for campaignId: ${campaignId}:`,
            error,
          );
        }
      }
      if (searchQueries?.length) {
        // if only search queries are provided, fetch all opportunities for that search query
        for (const searchItem of searchQueries) {
          try {
            const response = await merklApi.opportunities.get({
              query: {
                search: searchItem,
              },
            });

            if (response.data && Array.isArray(response.data)) {
              allOpportunities.push(
                ...(response.data.filter(Boolean) as MerklOpportunity[]),
              );
            }
          } catch (error) {
            console.error(
              `Error fetching opportunities for search ${searchItem}:`,
              error,
            );
          }
        }
      }
    }

    return allOpportunities;
  } catch (error) {
    console.error('Error fetching Merkl opportunities:', error);
    return [];
  }
}
