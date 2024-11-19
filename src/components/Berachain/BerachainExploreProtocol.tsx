import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link, Typography } from '@mui/material';
import {
  BeraChainBackground as Background,
  BeraChainBackButton,
  BerachainContainer as Container,
} from './Berachain.style';
import { BerachainProtocolAction } from './components/BerachainProtocolAction/BerachainProtocolAction';
import type { BerachainMarketType } from './const/berachainExampleData';

interface BerachainExploreProtocolProps {
  market?: BerachainMarketType;
}

export const BerachainExploreProtocol = ({
  market,
}: BerachainExploreProtocolProps) => {
  return (
    <Container>
      <Background />
      <Link href="/berachain/explore" style={{ textDecoration: 'none' }}>
        <BeraChainBackButton>
          <ArrowBackIcon />
          <Typography variant="bodySmallStrong">Explore Berachain</Typography>
        </BeraChainBackButton>
      </Link>
      <BerachainProtocolAction
        image={market?.protocol.image}
        socials={market?.protocol.socials}
        description={market?.protocol.description}
        title={market?.protocol.name}
        slug={market?.protocol.slug}
      />
    </Container>
  );
};
