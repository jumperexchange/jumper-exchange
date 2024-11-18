import {
  BeraChainBackground as Background,
  BerachainContainer as Container,
} from './Berachain.style';
import { BerachainFAQ } from './components/BerachainFAQ';
import { BerachainIntroduction } from './components/BerachainIntroduction/BerachainIntroduction';
import { BerachainWelcome } from './components/BerachainWelcome/BerachainWelcome';
export const Berachain = () => {
  return (
    <Container>
      <Background />
      <BerachainWelcome />
      <BerachainIntroduction />
      <BerachainFAQ />
    </Container>
  );
};
