import {
  BerachainBackground as Background,
  BerachainContentContainer as Container,
} from './Berachain.style';
import { BerachainMarkets } from './components/BerachainMarkets/BerachainMarkets';
export const BerachainExplore = () => {
  return (
    <Container>
      <Background />
      <BerachainMarkets />
    </Container>
  );
};
