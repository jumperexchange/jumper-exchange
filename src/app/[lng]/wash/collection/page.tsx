'use client';
/** @jsxImportSource @emotion/react */

import { WashBackground } from 'src/wash/common/WashBackground';
import {
  useWashTrading,
  WashTradingContextApp,
} from 'src/wash/contexts/useWashTrading';
import { EmptyScreenLayout } from 'src/wash/layouts/EmptyScreenLayout';
import { titanOne } from 'src/wash/utils/fonts';
import styled from '@emotion/styled';

import { colors } from 'src/wash/utils/theme';

import type { ReactElement } from 'react';
import { CollectionNFTItem } from 'src/wash/common/CollectionNFTItem';

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
`;

const CollectionWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  max-width: 1200px;
  height: min-content;
  background-color: ${colors.violet[500]};
  padding: 2rem;
  box-shadow: 6px 6px 0px 0px #8000ff;
  border-radius: 32px;
  border: 2px solid ${colors.violet[800]};
`;

const CollectionHeader = styled.div`
  width: 100%;
`;

const Title = styled.h1`
  font-size: 2rem;
  line-height: 40px;
  ${titanOne.style}
`;

const NftsList = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  row-gap: 60px;
  column-gap: 1.5rem;
  margin-top: 2rem;
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
  left: 48%;
  transform: translateX(-50%) skewX(-6deg);
  bottom: -23px;
  border-radius: 16px;
  background-color: ${colors.violet[800]};
  height: 56px;
  width: 230px;
  padding: 0 8px;
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
  const { collection } = useWashTrading();

  const currentCollection = collection.collection;

  return (
    <Wrapper>
      <Container>
        <WashBackground />
        {currentCollection?.length === 0 && !collection.isLoading ? (
          <EmptyScreenLayout />
        ) : (
          <CollectionWrapper>
            <CollectionHeader>
              <Title>{'Your collection'}</Title>
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
                    currentCollection?.map((nft) => (
                      <CollectionNFTItem
                        key={`${nft.name} + ${nft.imageUri}`}
                        nft={{ ...nft, name: 'ser basic Bridgealot' }}
                        label={nft?.isRare ? 'Rare' : 'Common'}
                      />
                    ))}
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
