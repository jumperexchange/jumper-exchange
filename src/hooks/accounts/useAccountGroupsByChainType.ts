import { useMemo } from 'react';
import groupBy from 'lodash/groupBy';
import type { Account } from '@lifi/widget-provider';
import type { AddressQueryParams } from '@/app/lib/getPositionsForAddress';
import { CHAIN_TYPE_TO_QUERY_PARAM } from '@/app/lib/getPositionsForAddress';

export const useAccountGroupsByChainType = (accounts: Account[]) =>
  useMemo(() => {
    const connected = accounts.filter(
      (acc) =>
        acc.isConnected &&
        acc.address &&
        CHAIN_TYPE_TO_QUERY_PARAM[acc.chainType],
    );

    const grouped = groupBy(
      connected,
      (acc) => CHAIN_TYPE_TO_QUERY_PARAM[acc.chainType],
    );

    return Object.entries(grouped).map(([addressParam, accs]) => ({
      addressParam: addressParam as keyof AddressQueryParams,
      addresses: [...new Set(accs.map((acc) => acc.address!))].sort(),
    }));
  }, [accounts]);
