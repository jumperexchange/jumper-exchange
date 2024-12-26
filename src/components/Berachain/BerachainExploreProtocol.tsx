'use client';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link, Typography } from '@mui/material';
import type { Quest } from 'src/types/loyaltyPass';
import {
  BerachainBackground as Background,
  BerachainBackButton,
  BerachainContentContainer as Container,
} from './Berachain.style';
import { BerachainProtocolAction } from './components/BerachainProtocolAction/BerachainProtocolAction';
import { useEnrichedMarkets } from 'royco/hooks';
import { notFound } from 'next/navigation';
import { useBerachainMarkets } from '@/components/Berachain/hooks/useBerachainMarkets';
import { EnrichedMarketDataType } from 'royco/queries';

interface BerachainExploreProtocolProps {
  marketId: string;
}

export const BerachainExploreProtocol = ({
  marketId,
}: BerachainExploreProtocolProps) => {
  const {
    data: roycoData,
    isFetched,
    ...props
  } = useEnrichedMarkets({
    is_verified: false,
    market_id: marketId,
    sorting: [{ id: 'locked_quantity_usd', desc: true }],
  });

  const { data, url, findFromStrapiByUid } = useBerachainMarkets();

  if (!roycoData || !data) {
    return (
      <Container>
        <Background />
        <Link href="/berachain/explore" style={{ textDecoration: 'none' }}>
          <BerachainBackButton>
            <ArrowBackIcon />
            <Typography variant="bodySmallStrong">Explore Berachain</Typography>
          </BerachainBackButton>
        </Link>
        <BerachainProtocolAction />
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
      <Link href="/berachain/explore" style={{ textDecoration: 'none' }}>
        <BerachainBackButton>
          <ArrowBackIcon />
          <Typography variant="bodySmallStrong">Explore Berachain</Typography>
        </BerachainBackButton>
      </Link>
      {card && <BerachainProtocolAction market={roycoDataMarket} card={card} />}
    </Container>
  );
};