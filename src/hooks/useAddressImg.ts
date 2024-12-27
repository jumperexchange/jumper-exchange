'use client';

import { useMercleNft } from '@/hooks/useMercleNft';
import useBlockieImg from '@/hooks/useBlockieImg';
import { useEnsAvatar } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { normalize } from 'viem/ens';
import { DEFAULT_WALLET_ADDRESS } from '@/const/urls';

interface UseWalletAddressImgProps {
  userAddress?: string;
}

export const useWalletAddressImg = ({
  userAddress,
}: UseWalletAddressImgProps) => {
  const { imageLink: merkleNFTImg } = useMercleNft({ userAddress });
  const { data: ensImage } = useEnsAvatar({
    chainId: mainnet.id,
    name: normalize(userAddress ?? DEFAULT_WALLET_ADDRESS),
  });
  const blockieImg = useBlockieImg(userAddress);

  return merkleNFTImg ?? ensImage ?? blockieImg;
};
