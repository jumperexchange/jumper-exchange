import { Box } from '@mui/material';
import {
  NFTClaimingContainer,
  NFTClaimingDescription,
  NFTClaimingHeader,
  NFTClaimingTitle,
  NFTDisplayBox,
} from './NFTClaimingBox.style';
import { NFTCard } from './NFTCard/NFTCard';
import { LastNFTTitle } from './LastNFTTitle/LastNFTTitle';

const NFT_ARRAY = [
  {
    chain: 'mode',
    image: `${process.env.NEXT_PUBLIC_STRAPI_URL}/uploads/mode_a66678926d.png`,
    contractAddress: '',
    bgColor: '#dffe00',
    typoColor: '#000000',
  },
  {
    chain: 'base',
    image: `${process.env.NEXT_PUBLIC_STRAPI_URL}/uploads/nft_f4eee6bf7b.png`,
    contractAddress: '',
    bgColor: '#2151f5',
    typoColor: '#ffffff',
  },
  {
    chain: 'optimism',
    image: `${process.env.NEXT_PUBLIC_STRAPI_URL}/uploads/nft_632580b867.png`,
    contractAddress: '',
    bgColor: '#ff0000',
    typoColor: '#ffffff',
  },
  {
    chain: 'fraxtal',
    image: `${process.env.NEXT_PUBLIC_STRAPI_URL}/uploads/nft_c1c8975aa4.png`,
    contractAddress: '',
    bgColor: '#000000',
    typoColor: '#ffffff',
  },
];

export const NFTClaimingBox = () => {
  return (
    <NFTClaimingContainer>
      <NFTClaimingHeader>
        <NFTClaimingTitle>
          {String('Enter the DeFi festival').toUpperCase()}
        </NFTClaimingTitle>
        <Box marginTop="32px" marginBottom="32px">
          <NFTClaimingDescription>
            Explore the Superchain Festival and vibe at the sound of 1.5M OP
            rewards. When you claim OP rewards from a chain, you are eligible to
            mint a unique Superchain wristband on the OP Mainnet.
          </NFTClaimingDescription>
        </Box>
      </NFTClaimingHeader>
      <NFTDisplayBox>
        {NFT_ARRAY.map((elem, i: number) => {
          return (
            <NFTCard
              key={`nft-card-${i}`}
              image={elem.image}
              chain={elem.chain}
              bgColor={elem.bgColor}
              typoColor={elem.typoColor}
            />
          );
        })}
      </NFTDisplayBox>
      <Box marginTop={'64px'}>
        <LastNFTTitle />
        <NFTDisplayBox>
          <NFTCard
            key={`nft-card-${42}`}
            chain={'box'}
            image={`${process.env.NEXT_PUBLIC_STRAPI_URL}/uploads/nft_7d22cbd21c.png`}
            bgColor={'#B6E9FB'}
            typoColor={'#000000'}
          />
        </NFTDisplayBox>
      </Box>
    </NFTClaimingContainer>
  );
};
