import { BerachainFilterTokensMenu } from './BerachainFilterTokensMenu';
import {
  BerachainMarketsFiltersContainer,
  BerachainMarketsFiltersInnerContainer,
} from './BerachainMarketsFilters.style';
import { BerachainSearch } from './BerachainSearch';
import { BerachainFilterIncentivesMenu } from '@/components/Berachain/components/BerachainMarkets/BerachainMarketsFilters/BerachainFilterIncentivesMenu';

export const BerachainMarketsFilters = () => {
  return (
    <BerachainMarketsFiltersContainer>
      <BerachainMarketsFiltersInnerContainer>
        {/*TODO: refactorize tokens and incentives menu*/}
        <BerachainFilterTokensMenu />
        <BerachainFilterIncentivesMenu />
        {/*<BerachainFilterChainsMenu />*/}
        {/* <BerachainFilterProtocolsMenu /> */}
      </BerachainMarketsFiltersInnerContainer>
      <BerachainMarketsFiltersInnerContainer>
        <BerachainSearch />
        {/* <BerachainSortMenu /> */}
      </BerachainMarketsFiltersInnerContainer>
    </BerachainMarketsFiltersContainer>
  );
};
