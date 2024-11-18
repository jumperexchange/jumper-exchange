import {
  BeraChainBackground as Background,
  BerachainContainer as Container,
} from './Berachain.style';
import { BerachainAction } from './components/BerachainAction/BerachainAction';
export const BerachainExplore = () => {
  return (
    <Container>
      <Background />
      <BerachainAction />
    </Container>
  );
};
