'use client';
/** @jsxImportSource @emotion/react */

import styled from '@emotion/styled';

import { useCallback, type ReactElement } from 'react';
import { CollectionNFTItem } from '../../../../wash/common/CollectionNFTItem';
import { WashBackground } from '../../../../wash/common/WashBackground';
import {
  useWashTrading,
  WashTradingContextApp,
} from '../../../../wash/contexts/useWashTrading';
import { MintLayout } from '../../../../wash/layouts/MintLayout';
import { mq, WashH1, colors } from '../../../../wash/utils/theme';
import { Button } from '../../../../wash/common/Button';
import { countExtraXPFromItems } from '../../../../wash/utils/utils';
import { inter } from '../../../../fonts/fonts';
import { useRouter } from 'next/navigation';

const Wrapper = styled.div`
  position: relative;
  z-index: 10;
  display: flex;
  min-height: 100vh;
  width: 100%;
  flex-direction: column;
  justify-content: start;
  overflow: hidden;
  align-items: center;
  background-color: ${colors.violet[100]};
  ${mq[1]} {
    padding-bottom: 2rem;
  }
`;

const CollectionWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  max-width: 1200px;
  height: min-content;
  background-color: ${colors.violet[500]};
  padding: 2rem 2rem 3rem;
  box-shadow: 6px 6px 0px 0px ${colors.violet[800]};
  border-radius: 32px;
  border: 2px solid ${colors.violet[800]};
  margin-bottom: 1rem;
  ${mq[1]} {
    width: 343px;
  }
`;

const CollectionHeader = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const NftsList = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  row-gap: 60px;
  column-gap: 1.5rem;
  margin-top: 2rem;
  ${mq[1]} {
    display: grid;
    grid-template-columns: repeat(1, minmax(0, 1fr));
    align-self: center;
  }
`;

const Container = styled.div`
  display: flex;
  z-index: 0;
  padding-top: 1.5rem;
  margin-top: 5rem;
  gap: 1.5rem;
  justify-content: center;
  width: 100%;
  max-width: 72rem;
  height: min-content;
`;

const SkeletonImage = styled.div`
  border-radius: 4px;
  width: 254px;
  height: 254px;
  border-radius: 16px;
  background-color: ${colors.violet[600]};
  border: 6px solid ${colors.violet[700]};
`;

const SkeletonLabel = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%) skewX(-6deg);
  top: -12px;
  background-color: ${colors.violet[700]};
  width: 100px;
  height: 24px;
  border-radius: 4px;
`;

const SkeletonWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
`;

const SkeletonName = styled.div`
  position: absolute;
  left: 49%;
  transform: translateX(-50%) skewX(-6deg);
  bottom: -23px;
  border-radius: 16px;
  background-color: ${colors.violet[800]};
  height: 56px;
  width: 230px;
  padding: 0 8px;
`;
const MintNext = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 2px solid ${colors.violet[800]};
  width: 254px;
  height: 254px;
  padding: 24px 16px;
  border-radius: 24px;
  justify-content: space-between;
`;
const Percents = styled.p`
  font-size: 40px;
  line-height: 48px;
  font-family: ${inter.style.fontFamily};
  color: white;
  font-weight: 900;
  transform: skewX(-6deg);
`;
const MintNextSubtitle = styled.p`
  font-size: 24px;
  line-height: 32 px;
  font-family: ${inter.style.fontFamily};
  color: white;
  font-weight: 900;
  text-transform: uppercase;
  transform: skewX(-6deg);
`;
const MintNextDescription = styled.p`
  font-weight: 500;
  color: white;
  text-align: center;
  font-size: 14px;
  line-height: 20px;
  font-family: ${inter.style.fontFamily};
`;
const MintNextUpperBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

function NftSkeleton(): ReactElement {
  return (
    <SkeletonWrapper>
      <SkeletonLabel />
      <SkeletonImage />
      <SkeletonName />
    </SkeletonWrapper>
  );
}

function CollectionPage(): ReactElement {
  const router = useRouter();
  const { collection, user, mint } = useWashTrading();
  const currentCollection = collection.collection;
  const hasUnrevealedNFT = (currentCollection || [])?.some(
    (item) => !item.isRevealed,
  );

  /**********************************************************************************************
   * mintAndRedirect
   *
   * Mints a new NFT and redirects user to the wash page.
   * Uses the mint.onMint() function from the WashTrading context to handle minting.
   * After successful mint, redirects to /wash route using Next.js router.
   **********************************************************************************************/
  const mintAndRedirect = useCallback(async () => {
    await mint.onMint();
    router.push('/wash');
  }, [mint, router]);

  return (
    <Wrapper>
      <Container>
        <WashBackground />
        {currentCollection?.length === 0 && !collection.isLoading ? (
          <MintLayout />
        ) : (
          <CollectionWrapper>
            <CollectionHeader>
              <WashH1>{'Your collection'}</WashH1>
              {collection.isLoading ? (
                <NftsList>
                  <NftSkeleton />
                  <NftSkeleton />
                  <NftSkeleton />
                  <NftSkeleton />
                </NftsList>
              ) : (
                <NftsList>
                  {currentCollection &&
                    currentCollection.length > 0 &&
                    currentCollection?.map((nft, index, arr) => (
                      <CollectionNFTItem
                        key={`${nft.name} + ${nft.imageUri}`}
                        nft={{ ...nft, name: 'ser basic Bridgealot' }}
                        label={nft?.isRare ? 'Rare' : 'Common'}
                        index={index}
                      />
                    ))}
                  {!hasUnrevealedNFT && (
                    <MintNext>
                      <MintNextUpperBlock>
                        <Percents>
                          +{countExtraXPFromItems(user?.items)}%
                        </Percents>
                        <MintNextSubtitle>On next nft</MintNextSubtitle>
                        <MintNextDescription>
                          Mint new NFT and wash it with Quest trades!
                        </MintNextDescription>
                      </MintNextUpperBlock>
                      <Button
                        onClick={mintAndRedirect}
                        theme={'pink'}
                        title={'Mint again'}
                        isBusy={mint.isMinting}
                      />
                    </MintNext>
                  )}
                </NftsList>
              )}
            </CollectionHeader>
          </CollectionWrapper>
        )}
      </Container>
    </Wrapper>
  );
}

export default function WithContext(): ReactElement {
  return (
    <WashTradingContextApp>
      <CollectionPage />
    </WashTradingContextApp>
  );
}
