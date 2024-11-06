import { useEnrichedMarkets } from 'src/integrations/royco/sdk/hooks';
import { RoycoPageContainer } from './RoycoPage.style';
export const RoycoPage = () => {
  const { data: enrichedMarkets } = useEnrichedMarkets({
    chain_id: 11155111,
  });
  console.log('enrichedMarkets', enrichedMarkets);
  return (
    <>
      <RoycoPageContainer className="royco-page">
        <p>Jumper Jumper</p>
      </RoycoPageContainer>
    </>
  );
};

// 1. usePrepareMarketAction: gives transactions to be executed and all its corresponding incentive info.
// 2. useEnrichedMarkets: gives all the corresponding market info.
// 3. useEnrichedOffers: gives all the current offers, can be sorted, filtered by market/user.
// 4. useTokenQuotes: gives the quote for all supported tokens.
