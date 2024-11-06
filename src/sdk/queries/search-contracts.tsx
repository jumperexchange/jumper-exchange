import { type TypedRoycoClient } from "../client";
import { type SortingState } from "@tanstack/react-table";

export const contractsPerPage = 10;

export type TypedContract = {
  id: string;
  chain_id: number;
  adddress: string;
  source: string;
  contract_name: string | null;
  proxy_type: string | null;
  implementation_id: string | null;
};

export type SearchContractsData = {
  count: number;
  data: TypedContract[];
} | null;

export type ContractFilter = {
  id: string;
  value: string | number | boolean;
};

const constructFilterClauses = (filters: ContractFilter[]): string => {
  let idFilter = "";
  let typeFilter = "";
  let sourceFilter = "";
  let chainIdFilter = "";
  let whitelistedContractFilter = "";

  /**
   * @note To filter string: wrap in single quotes
   * @note To filter number: no quotes
   */
  filters.forEach((filter) => {
    switch (filter.id) {
      case "id":
        if (idFilter) idFilter += " OR ";
        idFilter = `id = '${filter.value}'`;
        break;
      case "type":
        if (typeFilter) typeFilter += " OR ";
        typeFilter = `type = '${filter.value}'`;
        break;
      case "source":
        if (sourceFilter) sourceFilter += " OR ";
        sourceFilter = `source = '${filter.value}'`;
        break;
      case "chain_id":
        if (chainIdFilter) chainIdFilter += " OR ";
        chainIdFilter = `chain_id = ${filter.value}`;
        break;
      case "is_whitelisted":
        if (whitelistedContractFilter) whitelistedContractFilter += " OR ";
        whitelistedContractFilter = `is_whitelisted = ${filter.value}`;
        break;
    }
  });

  let filterClauses = "";

  if (idFilter) filterClauses += `(${idFilter}) AND `;
  if (typeFilter) filterClauses += `(${typeFilter}) AND `;
  if (sourceFilter) filterClauses += `(${sourceFilter}) AND `;
  if (chainIdFilter) filterClauses += `(${chainIdFilter}) AND `;
  if (whitelistedContractFilter)
    filterClauses += `(${whitelistedContractFilter}) AND `;
  if (filterClauses) {
    filterClauses = filterClauses.slice(0, -5); // Remove the trailing " AND "
  }

  return filterClauses;
};

const constructSortingClauses = (sorting: SortingState): string => {
  if (sorting.length === 0) {
    return "";
  }

  const sortingClauses = sorting
    .map((sort) => `${sort.id} ${sort.desc ? "DESC" : "ASC"}`)
    .join(", ");

  return sortingClauses;
};

export const searchContractsQueryOptions = (
  client: TypedRoycoClient,
  sorting: SortingState = [
    {
      id: "contract_name",
      desc: false,
    },
  ],
  filters: ContractFilter[] = [],
  searchKey?: string,
  pageIndex: number = 0
) => ({
  queryKey: [
    "search-contracts",
    `searchKey=${searchKey}`,
    ...sorting.map((sort) => `sort=${sort.id}:${sort.desc}`),
    ...filters.map((filter) => `filter=${filter.id}:${filter.value}`),
    `page=${pageIndex}`,
  ],
  queryFn: async () => {
    const filterClauses = constructFilterClauses(filters);
    const sortingClauses = constructSortingClauses(sorting);

    const { data, error } = await client.rpc("search_contracts", {
      search_key: searchKey || "",
      sorting: sortingClauses,
      filters: filterClauses,
      page_index: pageIndex,
      page_size: contractsPerPage,
    });

    return data;
  },
  keepPreviousData: true,
  placeholderData: (previousData: any) => previousData,
  staleTime: 1000 * 60 * 5, // 5 mins
  refetchOnWindowFocus: false,
  refreshInBackground: true,
});
