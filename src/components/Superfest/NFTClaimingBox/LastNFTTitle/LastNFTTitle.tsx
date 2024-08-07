import { useCheckNFTAvailability } from 'src/hooks/useCheckNFTAvailability';
import {
  NFTClaimingDescription,
  NFTClaimingHeader,
  NFTClaimingTitle,
} from '../NFTClaimingBox.style';
import { Box } from '@mui/material';

export const LastNFTTitle = () => {
  const { claimInfo, isLoading, isSuccess } = useCheckNFTAvailability({
    chain: 'box',
  });

  const canClaim = claimInfo.isClaimable || claimInfo.isClaimed;

  return (
    <NFTClaimingHeader>
      <NFTClaimingTitle>
        {canClaim
          ? String('Get your superfest ring').toUpperCase()
          : String('unlock the mystery box').toUpperCase()}
      </NFTClaimingTitle>
      <Box marginTop="32px" marginBottom="32px">
        <NFTClaimingDescription>
          {canClaim
            ? 'By minting this NFT, you gain future access to the SuperFest ring in the coming weeks.'
            : 'When you mint all Superchain wristbands, you become eligible to mint a super special NFT within the Superchain Mystery Box.'}
        </NFTClaimingDescription>
      </Box>
    </NFTClaimingHeader>
  );
};
