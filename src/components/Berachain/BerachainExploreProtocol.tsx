import {
  BeraChainBackground as Background,
  BerachainContainer as Container,
} from './Berachain.style';
import { BerachainAction } from './components/BerachainAction/BerachainAction';
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
      <BerachainAction />
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
