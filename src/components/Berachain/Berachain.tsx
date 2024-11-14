import {
  BeraChainBackground as Background,
  BerachainContainer as Container,
} from './Berachain.style';
import { BerachainAction } from './components/BerachainAction/BerachainAction';
import { BerachainFAQ } from './components/BerachainFAQ';
import { BerachainIntroduction } from './components/BerachainIntroduction/BerachainIntroduction';
import { BerachainOverview } from './components/BerachainOverview/BerachainOverview';
import { BerachainWelcome } from './components/BerachainWelcome/BerachainWelcome';
export const Berachain = () => {
  return (
    <Container>
      <Background />
      <BerachainWelcome />
      <BerachainIntroduction />
      <BerachainAction />
      <BerachainFAQ />
      <BerachainOverview />
    </Container>
  );
};
