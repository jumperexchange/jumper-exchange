import { Box, type Theme, useMediaQuery } from '@mui/material';
import Image from 'next/image';
import { SoraTypography } from '../../Superfest.style';
import { FlexCenterRowBox } from '../../SuperfestPage/SuperfestMissionPage.style';

export const RewardsAmountBox = ({
  rewardAmount,
  isConfirmed,
}: {
  rewardAmount: number;
  isConfirmed: boolean;
}) => {
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('md'),
  );
  return (
    <FlexCenterRowBox>
      <Box marginLeft="32px">
        <Image
          src={`${process.env.NEXT_PUBLIC_STRAPI_URL}/uploads/op_dddbaa6b32.png`}
          alt="token image"
          width={56}
          height={56}
          style={{
            borderRadius: 16,
          }}
        />
        {isMobile ? undefined : (
          <Image
            src={`${process.env.NEXT_PUBLIC_STRAPI_URL}/uploads/op_dddbaa6b32.png`}
            alt="token image"
            width={24}
            height={24}
            style={{
              borderRadius: 16,
              border: '2px solid',
              borderColor: '#FFFFFF',
              zIndex: 10,
              marginTop: 16,
              marginLeft: -16,
            }}
          />
        )}
      </Box>
      <Box marginLeft={'8px'}>
        <SoraTypography fontSize="40px" fontWeight={700}>
          {isConfirmed ? '0' : rewardAmount ? rewardAmount : '...'}
        </SoraTypography>
      </Box>
    </FlexCenterRowBox>
  );
};
