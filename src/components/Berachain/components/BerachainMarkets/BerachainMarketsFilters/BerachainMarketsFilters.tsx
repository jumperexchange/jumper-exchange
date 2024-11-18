import { BerachainFilterChainsMenu } from './BerachainFilterChainsMenu';
import { BerachainFilterProtocolsMenu } from './BerachainFilterProtocolsMenu';
import { BerachainFilterTokensMenu } from './BerachainFilterTokensMenu';
import {
  BerachainMarketsFiltersContainer,
  BerachainMarketsFiltersInnerContainer,
} from './BerachainMarketsFilters.style';
import { BerachainSearch } from './BerachainSearch';
import { BerachainSortMenu } from './BerachainSortMenu';

export const BerachainMarketsFilters = () => {
  return (
    <BerachainMarketsFiltersContainer>
      <BerachainMarketsFiltersInnerContainer>
        <BerachainFilterTokensMenu />
        <BerachainFilterChainsMenu />
        <BerachainFilterProtocolsMenu />
        <BerachainSearch />
      </BerachainMarketsFiltersInnerContainer>
      <BerachainSortMenu />
    </BerachainMarketsFiltersContainer>
  );
};
