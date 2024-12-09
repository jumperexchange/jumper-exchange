import { BerachainFilterChainsMenu } from './BerachainFilterChainsMenu';
import { BerachainFilterTokensMenu } from './BerachainFilterTokensMenu';
import {
  BerachainMarketsFiltersContainer,
  BerachainMarketsFiltersInnerContainer,
} from './BerachainMarketsFilters.style';
import { BerachainSearch } from './BerachainSearch';

export const BerachainMarketsFilters = () => {
  return (
    <BerachainMarketsFiltersContainer>
      <BerachainMarketsFiltersInnerContainer>
        <BerachainFilterTokensMenu />
        {/*<BerachainFilterChainsMenu />*/}
        {/* <BerachainFilterProtocolsMenu /> */}
      </BerachainMarketsFiltersInnerContainer>
      <BerachainMarketsFiltersInnerContainer>
        {/*<BerachainSearch />*/}
        {/* <BerachainSortMenu /> */}
      </BerachainMarketsFiltersInnerContainer>
    </BerachainMarketsFiltersContainer>
  );
};
