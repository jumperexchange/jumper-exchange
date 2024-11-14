import { BerachainFilterChainsMenu } from './BerachainFilterChainsMenu';
import { BerachainFilterProtocolsMenu } from './BerachainFilterProtocolsMenu';
import { BerachainFilterSearchMenu } from './BerachainFilterSearch';
import { BerachainFilterTokensMenu } from './BerachainFilterTokensMenu';
import {
  BerachainMarketsFiltersContainer,
  BerachainMarketsFiltersInnerContainer,
} from './BerachainMarketsFilters.style';
import { BerachainSortMenu } from './BerachainSortMenu';

export const BerachainMarketsFilters = () => {
  return (
    <BerachainMarketsFiltersContainer>
      <BerachainMarketsFiltersInnerContainer>
        <BerachainFilterTokensMenu />
        <BerachainFilterChainsMenu />
        <BerachainFilterProtocolsMenu />
        <BerachainFilterSearchMenu />
      </BerachainMarketsFiltersInnerContainer>
      <BerachainSortMenu />
    </BerachainMarketsFiltersContainer>
  );
};
