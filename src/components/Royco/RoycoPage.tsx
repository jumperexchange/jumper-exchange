import { useEnrichedOffers } from 'src/sdk/hooks';
import { RoycoPageContainer } from './RoycoPage.style';
export const RoycoPage = () => {
  const { data: enrichedOffers } = useEnrichedOffers({
    chain_id: 1,
  });
  console.log('enrichedOffers', enrichedOffers);
  return (
    <>
      <RoycoPageContainer className="royco-page">
        <p>Jumper Jumper</p>
      </RoycoPageContainer>
    </>
  );
};
