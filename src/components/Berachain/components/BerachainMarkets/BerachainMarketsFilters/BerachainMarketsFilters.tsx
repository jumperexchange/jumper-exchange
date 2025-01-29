import { BerachainFilterTokensMenu } from './BerachainFilterTokensMenu';
import {
  BerachainMarketsFiltersContainer,
  BerachainMarketsFiltersInnerContainer,
} from './BerachainMarketsFilters.style';
import { BerachainSearch } from './BerachainSearch';
import { BerachainFilterIncentivesMenu } from '@/components/Berachain/components/BerachainMarkets/BerachainMarketsFilters/BerachainFilterIncentivesMenu';
import {
  BerachainFilterBaffleOnly
} from '@/components/Berachain/components/BerachainMarkets/BerachainMarketsFilters/BerachainFilterBaffleOnly';

export const BerachainMarketsFilters = () => {
  return (
    <BerachainMarketsFiltersContainer>
      <BerachainMarketsFiltersInnerContainer>
        {/*TODO: refactorize tokens and incentives menu*/}
        <BerachainFilterTokensMenu />
        <BerachainFilterIncentivesMenu />
        <BerachainFilterBaffleOnly />
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
