'use client';
import {
  BerachainBackground as Background,
  BerachainContentContainer as Container,
} from './Berachain.style';
import { useEnrichedMarkets } from 'royco/hooks';
import { notFound, useSearchParams } from 'next/navigation';
import { useBerachainMarkets } from '@/components/Berachain/hooks/useBerachainMarkets';
import { BerachainProtocolInformation } from './components/BerachainProtocolInformation/BerachainProtocolInformation';
import useBerachainFilters from '@/components/Berachain/hooks/useBerachainFilters';
import { useBerachainMarketsFilterStore } from '@/components/Berachain/stores/BerachainMarketsFilterStore';
import { useEffect, useMemo } from 'react';
import BeraStoreSetup from '@/components/Berachain/components/BeraStoreSetup';
import { calculateBeraYield } from '@/components/Berachain/utils';

interface BerachainExploreProtocolProps {
  marketId: string;
}

export const BerachainExploreProtocol = ({
  marketId,
}: BerachainExploreProtocolProps) => {
  const searchParam = useSearchParams();
  const berachainFilters = useBerachainFilters();
  const {
    data: roycoData,
    isSuccess,
    ...props
  } = useEnrichedMarkets({
    market_id: marketId,
    ...berachainFilters,
  });
  const { data, url, findFromStrapiByUid } = useBerachainMarkets();

  if (!isSuccess || !roycoData || !data) {
    return (
      <Container>
        <Background />
        <BerachainProtocolInformation />
      </Container>
    );
  }

  if (!Array.isArray(roycoData) || roycoData.length === 0) {
    return notFound();
  }

  const roycoDataMarket = roycoData[0];

  const card = findFromStrapiByUid(roycoDataMarket.market_id!);

  return (
    <Container>
      <BeraStoreSetup />
      <Background />
      {/* {card &&  */}
      <BerachainProtocolInformation
        market={roycoDataMarket}
        card={card ?? undefined}
      />
      {/* } */}
    </Container>
  );
};
