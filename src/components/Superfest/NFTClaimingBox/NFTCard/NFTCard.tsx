import { Button } from 'src/components/Button';
import { NFTCardBotomBox, NFTCardMainBox } from './NFTCard.style';
import Image from 'next/image';

const NOT_LIVE = true;

interface NFTCardProps {
  image: string;
  chain: string;
  bgColor: string;
  typoColor: string;
}

export const NFTCard = ({ image, chain, bgColor, typoColor }: NFTCardProps) => {
  return (
    <NFTCardMainBox
      sx={{
        cursor: NOT_LIVE ? 'not-allowed' : undefined,
      }}
    >
      <Image
        style={{
          borderTopRightRadius: '8px',
          borderTopLeftRadius: '8px',
          marginBottom: '0px',
        }}
        src={image}
        alt={chain}
        width="256"
        height="256"
      />
      <NFTCardBotomBox>
        <Button
          size="medium"
          disabled={NOT_LIVE}
          styles={{
            backgroundColor: 'transparent',
            border: '2px dotted',
            borderColor: NOT_LIVE ? '#C5B99C' : '#000000',
            width: '75%',
            '&:hover': {
              backgroundColor: bgColor,
              color: typoColor,
            },
          }}
        >
          Mint Now
        </Button>
      </NFTCardBotomBox>
    </NFTCardMainBox>
  );
};
