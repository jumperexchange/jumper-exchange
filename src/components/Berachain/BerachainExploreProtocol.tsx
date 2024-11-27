import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link, Typography } from '@mui/material';
import type { Quest } from 'src/types/loyaltyPass';
import {
  BerachainBackground as Background,
  BerachainBackButton,
  BerachainContentContainer as Container,
} from './Berachain.style';
import { BerachainProtocolAction } from './components/BerachainProtocolAction/BerachainProtocolAction';

interface BerachainExploreProtocolProps {
  market?: Quest;
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
        market={market}
        detailInformation={market?.attributes.CustomInformation}
      />
    </Container>
  );
};
