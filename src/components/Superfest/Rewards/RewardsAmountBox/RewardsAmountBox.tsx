import { Box } from '@mui/material';
import Image from 'next/image';
import { FlexCenterRowBox } from '../../SuperfestPage/SuperfestMissionPage.style';
import { SoraTypography } from '../../Superfest.style';

export const RewardsAmountBox = ({
  rewardAmount,
}: {
  rewardAmount: number;
}) => {
  return (
    <FlexCenterRowBox>
      <Box marginLeft="32px">
        <Image
          src={'https://strapi.li.finance/uploads/op_dddbaa6b32.png'}
          alt="token image"
          width={40}
          height={40}
          style={{
            borderRadius: 16,
          }}
        />
        <Image
          src={'https://strapi.li.finance/uploads/op_dddbaa6b32.png'}
          alt="token image"
          width={15}
          height={15}
          style={{
            borderRadius: 16,
            border: '2px solid',
            borderColor: '#FFFFFF',
            zIndex: 10,
            marginTop: 16,
            marginLeft: -8,
          }}
        />
      </Box>
      <Box marginLeft={'8px'}>
        <SoraTypography fontSize="40px" fontWeight={700}>
          {rewardAmount ?? '...'}
        </SoraTypography>
      </Box>
    </FlexCenterRowBox>
  );
};
