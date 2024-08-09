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
          ? String('GET the VIP Wristband').toUpperCase()
          : String('unlock the mystery box').toUpperCase()}
      </NFTClaimingTitle>
      <Box marginTop="32px" marginBottom="32px">
        <NFTClaimingDescription>
          {canClaim
            ? 'The VIP wristband represents your status as a Superchain power user. This status can be leveraged as an onchain credential by application developers who choose to set aside special features for users with this NFT in their wallet.'
            : 'When you mint all Superchain wristbands, you become eligible to mint a super special NFT within the Superchain Mystery Box.'}
        </NFTClaimingDescription>
      </Box>
    </NFTClaimingHeader>
  );
};
