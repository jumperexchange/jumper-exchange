'use client';

import { Fragment, useEffect, useMemo, useState } from 'react';
import { RevealNFTItem } from '../common/RevealNFTItem';
import { useWashTrading } from '../contexts/useWashTrading';
import { countExtraXPFromItems } from '../utils/utils';
import styled from '@emotion/styled';

import type { ReactElement } from 'react';
import { CallToActionBox } from '../common/CallToActionBox';
import { titanOne } from '../common/fonts';
import { inter } from '../../fonts/fonts';
import { colors, mq } from '../utils/theme';
import Link from 'next/link';

/**************************************************************************************************
 * Defining the styled components style for the RevealedNFTLayout component
 *************************************************************************************************/
const RevealedNFTLayoutContainer = styled.div<{ mounted: boolean }>`
  position: relative;
  display: flex;
  width: 100%;
  max-width: 100vw;
  flex-direction: column;
  align-items: center;
  transition:
    opacity 300ms ease-in-out,
    scale 300ms ease-in-out;
  opacity: ${({ mounted }) => (mounted ? 1 : 0)};
  scale: ${({ mounted }) => (mounted ? 1 : 0)};
  transform-origin: top center;

  ${mq[0]} {
    padding-left: 16px;
    padding-right: 16px;
  }
  ${mq[1]} {
    padding-top: 0px;
  }
  @media (min-height: 50px) and (max-height: 800px) {
    margin-top: 0px;
  }
`;
const RevealedNFTLayoutTitle = styled.h1`
  text-transform: uppercase;
  color: white;
  font-size: 56px;
  line-height: 56px;
  font-weight: inherit;
  text-align: center;
  margin: 0;
  z-index: 10;
  font-family: ${titanOne.style.fontFamily};
  ${mq[0]} {
    font-size: 32px;
    line-height: 32px;
  }
  ${mq[1]} {
    font-size: 48px;
    line-height: 48px;
  }
`;
const RevealedNFTLayoutSubtitle = styled.span`
  color: white;
  margin-top: 8px;
  margin-bottom: 40px;
  font-weight: 500;
  font-size: 24px;
  line-height: 32px;
  font-family: ${inter.style.fontFamily};
  z-index: 10;
  ${mq[0]} {
    text-align: center;
    font-size: 16px;
    line-height: 20px;
  }
`;
const RevealedNFTLayoutCallToActionBox = styled.div`
  margin-top: 66px;
  ${mq[0]} {
    max-width: 320px;
  }
`;

const RewardWrapper = styled.div<{ maxWidth?: string }>`
  margin-top: 1rem;
  max-width: ${(props) => props.maxWidth ?? '1200px'};
  text-align: center;
  font-weight: 500;
  min-height: 64px;
`;

const RewardName = styled.span`
  margin: 0px;
  color: ${colors.orange[800]};
  text-transform: uppercase;
`;

const CyanText = styled.span`
  color: ${colors.cyan[800]};
`;

/**************************************************************************************************
 * RevealedNFTLayout Component
 *
 * This component is responsible for displaying the NFT reveal screen. It shows the revealed NFT,
 * its rarity, and associated rewards. The component also includes a call-to-action for minting
 * another NFT.
 *
 * The component relies on the useWashTrading hook for accessing NFT and reveal state data.
 ************************************************************************************************/
export function RevealedNFTLayout(): ReactElement {
  const { reveal, nft, user, collection } = useWashTrading();
  const [isMounted, set_isMounted] = useState<boolean>(false);

  useEffect(() => {
    setTimeout(() => set_isMounted(true), 0); // 0 to make sure the animation is played after a smooth delay
  }, []);

  /**********************************************************************************************
   * currentNFT: Extracts the NFT object from the nft state
   * hasNFT: Extracts the hasNFT boolean from the nft state
   *
   * These lines assign the NFT object and hasNFT boolean from the nft state to local variables
   * for easier access.
   *********************************************************************************************/
  const currentNFT = nft.nft;
  const currentCollection = collection.collection;

  /**********************************************************************************************
   * Determine the title to display based on the reveal state and NFT rarity
   *
   * This useMemo hook calculates the appropriate title for the NFT reveal screen.
   * It considers two factors:
   * 1. Whether the NFT is currently being revealed (isRevealing)
   * 2. The rarity of the NFT (nft?.isRare)
   *********************************************************************************************/
  const title = useMemo(() => {
    if (reveal.isRevealing) {
      return 'Let’s see what you got!';
    }
    return currentNFT?.isRare ? 'Wtf, no way!' : 'Common chad dub';
  }, [reveal.isRevealing, currentNFT?.isRare]);

  /**********************************************************************************************
   * Determine the subtitle to display based on the reveal state and NFT rarity
   *
   * This useMemo hook calculates the appropriate subtitle for the NFT reveal screen.
   * It considers two factors:
   * 1. Whether the NFT is currently being revealed (isRevealing)
   * 2. The rarity of the NFT (nft?.isRare)
   *********************************************************************************************/
  const subtitle = useMemo(() => {
    if (reveal.isRevealing) {
      return (
        <RewardWrapper maxWidth={'760px'}>
          {'Loading your NFT, fingers crossed anon!'}
        </RewardWrapper>
      );
    }
    const isSingleNFT = (currentCollection || [])?.length === 1;
    const { isRare, rewardName } = currentNFT || {};
    const jumperRole = 'Jumper OG roles';
    const jumperDiscordRole = 'Jumper OG discord role';
    const jumperMerch = 'Jumper merch';

    if (!isRare) {
      return (
        <RewardWrapper>
          Congrats, Chad! You've earned&nbsp;
          {isSingleNFT && (
            <>
              <CyanText>+10XP</CyanText>&nbsp;plus&nbsp;
            </>
          )}
          a raffle entry with a chance to win&nbsp;
          <CyanText>{jumperMerch}</CyanText>
          &nbsp;and a&nbsp;
          <CyanText>{jumperRole}</CyanText>. Join in to participate{' '}
          <Link
            href={'https://jumper.exchange/profile'}
            target={'_blank'}
            style={{ color: 'white' }}
          >
            here
          </Link>
          . Jump more & wash more for a chance to win the legendary NFT!
        </RewardWrapper>
      );
    }
    return (
      <RewardWrapper maxWidth={'760px'}>
        {isSingleNFT ? (
          <>
            What a pull! You've won <CyanText>+10XP</CyanText>&nbsp;plus a&nbsp;
            <RewardName>{rewardName ?? 'reward'}</RewardName>, and a chance to
            win&nbsp;
            <CyanText>{jumperMerch}</CyanText>
            &nbsp;and a&nbsp;
            <CyanText>{jumperDiscordRole}</CyanText>.
          </>
        ) : (
          <>
            Insane luck! You've won a&nbsp;
            <RewardName>{rewardName ?? 'reward'}</RewardName>, and a chance to
            win&nbsp;
            <CyanText>{jumperMerch}</CyanText>&nbsp;and a&nbsp;
            <CyanText>{jumperDiscordRole}</CyanText>.
          </>
        )}
      </RewardWrapper>
    );
  }, [reveal.isRevealing, currentCollection, currentNFT]);

  if (!currentNFT) {
    return <Fragment />;
  }

  /**********************************************************************************************
   * Render the RevealNFTLayout component
   *********************************************************************************************/
  return (
    <RevealedNFTLayoutContainer mounted={isMounted}>
      <RevealedNFTLayoutTitle>{title}</RevealedNFTLayoutTitle>
      <RevealedNFTLayoutSubtitle>{subtitle}</RevealedNFTLayoutSubtitle>

      <RevealNFTItem
        nft={currentNFT}
        label={currentNFT?.isRare ? 'Legendary' : 'Common'}
        isRevealing={reveal.isRevealing || reveal.hasCanceledReveal}
      />

      <RevealedNFTLayoutCallToActionBox>
        {!reveal.isRevealing && (
          <CallToActionBox
            title={
              countExtraXPFromItems(user?.items) === 0
                ? `Keep washing anon!`
                : `GET +${countExtraXPFromItems(user?.items)}% BOOST on next nft`
            }
            subtitle={
              countExtraXPFromItems(user?.items) === 0
                ? 'Mint new NFT and wash it clean for another chance to win valuable NFTs and blue chip memecoins.'
                : 'You’ve still got power ups in your inventory. Mint another NFT and put them to good use!'
            }
          />
        )}
      </RevealedNFTLayoutCallToActionBox>
    </RevealedNFTLayoutContainer>
  );
}
