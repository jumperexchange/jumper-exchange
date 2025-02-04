import {
  BerachainBackground as Background,
  BerachainContentContainer,
} from './Berachain.style';
import { BerachainMarkets } from './components/BerachainMarkets/BerachainMarkets';
import BeraStoreSetup from '@/components/Berachain/components/BeraStoreSetup';
export const BerachainExplore = () => {
  return (
    <BerachainContentContainer>
      <BeraStoreSetup />
      <Background />
      <BerachainMarkets />
    </BerachainContentContainer>
  );
};
