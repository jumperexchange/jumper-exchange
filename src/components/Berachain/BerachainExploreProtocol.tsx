import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link, Typography } from '@mui/material';
import {
  BerachainBackground as Background,
  BerachainBackButton,
  BerachainContentContainer as Container,
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
        <BerachainBackButton>
          <ArrowBackIcon />
          <Typography variant="bodySmallStrong">Explore Berachain</Typography>
        </BerachainBackButton>
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
