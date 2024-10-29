import { useAccount } from '@lifi/wallet-management';
import { useRouter } from 'next/navigation';
import {
  WashProgressAlertButton,
  WashProgressAlertContainer,
  WashProgressAlertContent,
  WashProgressAlertImage,
  WashProgressAlertTitle,
  WashProgressImageWrapper,
  WashProgressInfo,
} from '.';
import { JUMPER_WASH_PATH } from '../../../const/urls';
import { useGetNFT } from '../../hooks/useGetNFT';
import { DEFAULT_NFT_COLOR } from '../../utils/constants';
import { getPepeImage } from '../../utils/getPepeImage';
import type { TColor } from '../../utils/theme';
import { colors } from '../../utils/theme';

export const WashProgressAlert = () => {
  const data = useGetNFT();
  const router = useRouter();
  const { account } = useAccount();

  const handleWashCta = () => {
    router.push(JUMPER_WASH_PATH);
  };

  return (
    account?.address &&
    data.hasNFT && (
      <WashProgressAlertContainer className={'alert'}>
        <WashProgressAlertTitle>Wash trade</WashProgressAlertTitle>
        <WashProgressAlertContent marginTop={1.5}>
          Trade on Jumper to wash your NFT and win prizes.
        </WashProgressAlertContent>
        <WashProgressAlertButton onClick={handleWashCta}>
          {data.hasNFT ? 'Keep washing' : 'Start washing'}
        </WashProgressAlertButton>
        <WashProgressImageWrapper>
          <WashProgressInfo
            progress={data.nft?.progress || 0}
          >{`${data.nft?.progress || 0}%`}</WashProgressInfo>
          <WashProgressAlertImage
            color={data.nft?.color}
            src={`/wash/cleaning-stage/${getPepeImage(data.nft?.progress || 0, data.nft?.color ?? 'pink')}`}
            alt={'nft-image'}
            border={
              colors[(data?.nft?.color || DEFAULT_NFT_COLOR) as TColor][800]
            }
            width={128}
            height={128}
          />
        </WashProgressImageWrapper>
      </WashProgressAlertContainer>
    )
  );
};
