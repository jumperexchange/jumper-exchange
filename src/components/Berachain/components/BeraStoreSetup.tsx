import { useBerachainMarketsFilterStore } from '@/components/Berachain/stores/BerachainMarketsFilterStore';
import { useEffect } from 'react';
import {
  useEnrichedMarkets,
  useEnrichedRoycoStats,
  useTokenQuotes,
} from 'royco/hooks';
import { BERA_TOKEN_ID } from '../utils';
import useBerachainFilters from '@/components/Berachain/hooks/useBerachainFilters';
import { useBerachainMarkets } from '@/components/Berachain/hooks/useBerachainMarkets';

function BeraStoreSetup() {
  const { data: roycoStatsData } = useEnrichedRoycoStats();
  const {
    roycoStats,
    beraTokenQuote,
    setRoycoStats,
    setBeraTokenQuote,
    setRoycoMarkets,
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

  return <></>;
}

export default BeraStoreSetup;
