import { useQuery } from '@tanstack/react-query';
import { type ContractFilter, searchContractsQueryOptions } from '../queries';
import { useRoycoClient, type RoycoClient } from '../client';

export const useSearchContracts = ({
  sorting,
  filters,
  searchKey,
  pageIndex = 0,
}: {
  sorting: any;
  filters: ContractFilter[];
  searchKey?: string;
  pageIndex?: number;
}) => {
  let data = [];
  let count = 0;
  let totalPages = 0;

  const client: RoycoClient = useRoycoClient();

  const props = useQuery(
    searchContractsQueryOptions(client, sorting, filters, searchKey, pageIndex),
  );

  if (
    !props.isLoading &&
    !props.isRefetching &&
    !props.isError &&
    !!props.data &&
    !!props.data.data
  ) {
    data = props.data.data;
  } else if (props.data === null) {
    data = [];
  }

  if (props.data && props.data.count) {
    count = props.data.count;
  }

  totalPages = Math.ceil(count / 10);

  return {
    ...props,
    data,
    count,
    totalPages,
  };
};
