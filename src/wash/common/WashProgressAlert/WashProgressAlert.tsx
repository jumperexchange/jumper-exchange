import { getPepeImage } from 'src/wash/utils/getPepeImage';
import {
  WashProgressAlertButton,
  WashProgressAlertContainer,
  WashProgressAlertContent,
  WashProgressAlertImage,
  WashProgressAlertTitle,
  WashProgressImageWrapper,
  WashProgressInfo,
} from '.';

export const WashProgressAlert = () => {
  const imgSrc = getPepeImage(0, 'pink');

  return (
    <WashProgressAlertContainer className="alert">
      <WashProgressAlertTitle>Wash trade</WashProgressAlertTitle>
      <WashProgressAlertContent marginTop={1.5}>
        Trade on Jumper to wash your NFT and win prizes.
      </WashProgressAlertContent>
      <WashProgressAlertButton>Keep washing</WashProgressAlertButton>
      <WashProgressImageWrapper>
        <WashProgressInfo>0%</WashProgressInfo>
        <WashProgressAlertImage
          src={`/wash/${imgSrc}`} //nft?.progress || 0, nft?.color ?? DEFAULT_NFT_COLOR
          alt={'nft-image'}
          isRare={true} //nft?.isRare
          width={128}
          height={128}
        />
      </WashProgressImageWrapper>
    </WashProgressAlertContainer>
  );
};
