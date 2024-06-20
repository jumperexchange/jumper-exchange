import { Box, Typography, Divider } from '@mui/material';
import Image from 'next/image';
import { Button } from 'src/components/Button';
import { ProfilePageTypography } from 'src/components/ProfilePage/ProfilePage.style';
import {
  NFTClaimingContainer,
  NFTClaimingDescription,
  NFTClaimingHeader,
  NFTClaimingTitle,
} from './NFTClaimingBox.style';

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

export const NFTClaimingBox = ({}) => {
  async function handleClick() {
    console.log('hello world');
  }

  return (
    <NFTClaimingContainer>
      <NFTClaimingHeader>
        <NFTClaimingTitle>{'Enter the liquidity festival'}</NFTClaimingTitle>
        <NFTClaimingDescription>
          {
            'Explore the Superchain Festival and vibe at the sound of 1.5M OP rewards. Feel the music, complete the tasksand get ready to experience rewards like never before.'
          }
        </NFTClaimingDescription>
      </NFTClaimingHeader>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignContent: 'center',
          marginTop: '16px',
          gap: '32px',
        }}
      >
        {NFT_ARRAY.map((elem) => {
          return (
            <Box
              sx={{
                width: '256px',
                height: '328px',
                justifyContent: 'center',
                alignContent: 'center',
              }}
            >
              <Image
                style={{
                  borderTopRightRadius: '32px',
                  borderTopLeftRadius: '32px',
                  marginBottom: '0px',
                }}
                src={elem.image}
                alt={elem.chain}
                width="256"
                height="256"
              />
              <Box
                sx={{
                  backgroundColor: '#fff0ca',
                  height: '72px',
                  justifyContent: 'center',
                  alignContent: 'center',
                  textAlign: 'center',
                  borderBottomRightRadius: '32px',
                  borderBottomLeftRadius: '32px',
                  marginTop: '-6px',
                }}
              >
                <Button
                  size="medium"
                  styles={{
                    backgroundColor: 'transparent',
                    border: '2px dotted',
                    color: '#000000',
                    borderColor: '#000000',
                    width: '75%',
                    '&:hover': {
                      backgroundColor: elem.bgColor,
                      color: elem.typoColor,
                    },
                  }}
                >
                  Mint Now
                </Button>
              </Box>
            </Box>
          );
        })}
      </Box>
    </NFTClaimingContainer>
  );
};
