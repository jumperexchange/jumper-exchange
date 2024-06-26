import { Box, Typography, Divider } from '@mui/material';
import Image from 'next/image';
import { Button } from 'src/components/Button';
import { ProfilePageTypography } from 'src/components/ProfilePage/ProfilePage.style';
import {
  NFTClaimingContainer,
  NFTClaimingDescription,
  NFTClaimingHeader,
  NFTClaimingTitle,
  NFTDisplayBox,
} from './NFTClaimingBox.style';
import { NFTCard } from './NFTCard/NFTCard';

const NFT_ARRAY = [
  {
    chain: 'mode',
    image: 'https://strapi.li.finance/uploads/mode_a66678926d.png',
    contractAddress: '',
    bgColor: '#dffe00',
    typoColor: '#000000',
  },
  {
    chain: 'base',
    image: 'https://strapi.li.finance/uploads/nft_f4eee6bf7b.png',
    contractAddress: '',
    bgColor: '#2151f5',
    typoColor: '#ffffff',
  },
  {
    chain: 'optimism',
    image: 'https://strapi.li.finance/uploads/nft_632580b867.png',
    contractAddress: '',
    bgColor: '#ff0000',
    typoColor: '#ffffff',
  },
  {
    chain: 'fraxtal',
    image: 'https://strapi.li.finance/uploads/nft_c1c8975aa4.png',
    contractAddress: '',
    bgColor: '#000000',
    typoColor: '#ffffff',
  },
];

const ClaimInfo = {
  mode: {
    isClaimable: false,
    isClaimed: false,
  },
  optimism: {
    isClaimable: false,
    isClaimed: false,
  },
  base: {
    isClaimable: false,
    isClaimed: false,
  },
  fraxtal: {
    isClaimable: false,
    isClaimed: false,
  },
};

export const NFTClaimingBox = ({}) => {
  async function handleClick() {}

  return (
    <NFTClaimingContainer>
      <NFTClaimingHeader>
        <NFTClaimingTitle>
          {String('Enter the liquidity festival').toUpperCase()}
        </NFTClaimingTitle>
        <Box marginTop="32px" marginBottom="32px">
          <NFTClaimingDescription>
            {
              'Explore the Superchain Festival and vibe at the sound of 1.5M OP rewards. Feel the music, complete the tasksand get ready to experience rewards like never before.'
            }
          </NFTClaimingDescription>
        </Box>
      </NFTClaimingHeader>
      <NFTDisplayBox>
        {NFT_ARRAY.map((elem) => {
          return (
            <NFTCard
              image={elem.image}
              chain={elem.chain}
              bgColor={elem.bgColor}
              typoColor={elem.typoColor}
            />
          );
        })}
      </NFTDisplayBox>
    </NFTClaimingContainer>
  );
};
