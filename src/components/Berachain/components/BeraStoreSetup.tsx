import useBerachainFilters from '@/components/Berachain/hooks/useBerachainFilters';
import { useBerachainMarketsFilterStore } from '@/components/Berachain/stores/BerachainMarketsFilterStore';
import { useAccount } from '@lifi/wallet-management';
import { useEffect } from 'react';
import {
  useEnrichedMarkets,
  useEnrichedPositionsRecipe,
  useEnrichedRoycoStats,
  useTokenQuotes,
} from 'royco/hooks';
import { BERA_TOKEN_ID } from '../utils';

function BeraStoreSetup() {
  const { account } = useAccount();
  const { data: roycoStatsData } = useEnrichedRoycoStats();
  const {
    roycoStats,
    beraTokenQuote,
    setRoycoStats,
    setBeraTokenQuote,
    setRoycoMarkets,
    setPositionsData,
  } = useBerachainMarketsFilterStore((state) => state);

  const { data: beraTokenQuotes } = useTokenQuotes({
    token_ids: [BERA_TOKEN_ID],
  });

  useEffect(() => {
    if (!roycoStatsData) {
      return;
    }

    setRoycoStats(roycoStatsData);
  }, [roycoStatsData]);

  useEffect(() => {
    if (!beraTokenQuotes && !beraTokenQuotes?.[0]) {
      return;
    }

    setBeraTokenQuote(beraTokenQuotes[0]);
  }, [beraTokenQuotes]);

  const berachainFilters = useBerachainFilters();
  const { data: roycoDataMarkets } = useEnrichedMarkets({
    is_verified: true,
    sorting: [{ id: 'locked_quantity_usd', desc: true }],
    ...berachainFilters,
  });

  useEffect(() => {
    if (!Array.isArray(roycoDataMarkets) || roycoDataMarkets.length === 0) {
      return;
    }

    setRoycoMarkets(roycoDataMarkets);
  }, [roycoDataMarkets]);

  const { data: positionsRecipe, refetch } = useEnrichedPositionsRecipe({
    account_address: account?.address?.toLowerCase() as string,
    page_index: 0,
    page_size: 500,
    enabled: !!account?.address,
  });

  useEffect(() => {
    if (!account?.address) {
      setPositionsData([]);
    } else {
      refetch();
    }

    if (
      !Array.isArray(positionsRecipe?.data) ||
      positionsRecipe.data.length === 0
    ) {
      return;
    }

    setPositionsData(positionsRecipe.data);
  }, [positionsRecipe, account]);

  return <></>;
}

export default BeraStoreSetup;
