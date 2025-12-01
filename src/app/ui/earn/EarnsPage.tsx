import { EarnTopOpportunities } from './EarnTopOpportunities';
import { EarnOpportunitiesAll } from './EarnOpportunitiesAll/EarnOpportunitiesAll';
import type { EarnOpportunityFilter } from '@/app/lib/getOpportunitiesFiltered';
import { getOpportunitiesFiltered } from '@/app/lib/getOpportunitiesFiltered';
import { getOpportunitiesTop } from '@/app/lib/getOpportunitiesTop';
import { OrderOptions, SortByOptions } from './types';
import type { NullableFields } from '@/types/internal';
import { removeNullValuesFromFilter } from './utils';

interface EarnsPageProps {
  searchParams?: NullableFields<EarnOpportunityFilter>;
}

export const EarnsPage = async ({
  searchParams: { sortBy, order, ...rest } = {},
}: EarnsPageProps) => {
  const [allResponse, forYouResponse, filteredResponse, topResponse] =
    await Promise.all([
      getOpportunitiesFiltered({}),
      getOpportunitiesFiltered({
        forYou: true,
      }),
      getOpportunitiesFiltered({
        ...removeNullValuesFromFilter(rest),
        forYou: false,
        sortBy: sortBy || SortByOptions.APY,
        order: order || OrderOptions.ASC,
      }),
      getOpportunitiesTop(),
    ]);

  const allData = allResponse.data;
  const forYouData = forYouResponse.data;
  const filteredData = filteredResponse.data;
  const topData = topResponse.data;

  return (
    <>
      <EarnTopOpportunities initialData={topData} />
      <EarnOpportunitiesAll
        initialData={{
          all: allData,
          filtered: filteredData,
          forYou: forYouData,
        }}
      />
    </>
  );
};
