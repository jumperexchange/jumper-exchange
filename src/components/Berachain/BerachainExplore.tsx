import {
  BerachainBackground as Background,
  BerachainContentContainer,
} from './Berachain.style';
import { BerachainMarkets } from './components/BerachainMarkets/BerachainMarkets';
export const BerachainExplore = () => {
  return (
    <BerachainContentContainer>
      <Background />
      <BerachainMarkets />
    </BerachainContentContainer>
  );
};
