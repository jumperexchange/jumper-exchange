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

interface BerachainExploreProtocolProps {
  marketId: string;
}

export const BerachainExploreProtocol = ({
  marketId,
}: BerachainExploreProtocolProps) => {
  const searchParam = useSearchParams();
  const {
    data: roycoData,
    isSuccess,
    ...props
  } = useEnrichedMarkets({
    market_id: marketId,
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
