import {
  BeraChainBackground as Background,
  BerachainContainer as Container,
} from './Berachain.style';
import { BerachainOverview } from './components/BerachainOverview/BerachainOverview';
export const BerachainExploreMarket = () => {
  return (
    <Container>
      <Background />
      <BerachainOverview />
    </Container>
  );
};
