import { Box, Typography, useTheme } from '@mui/material';
import Image from 'next/image';
import { EarnedTypography } from '../../Rewards/RewardsCarousel.style';
import { FlexCenterRowBox } from 'src/components/Superfest/SuperfestPage/SuperfestMissionPage.style';

const LOGO =
  'https://strapi.li.finance/uploads/Sei_Symbol_Gradient_2b107fa812.svg';

export const TempTitle = () => {
  const theme = useTheme();

  return (
    <FlexCenterRowBox marginBottom={'16px'}>
      <Box marginRight="8px">
        <Image
          src={LOGO}
          alt="token image"
          width={48}
          height={44}
          style={{
            borderRadius: 16,
          }}
        />
      </Box>
      <EarnedTypography
        color={theme.palette.mode === 'dark' ? '#FFF4DC' : '#9E1E1A'}
      >
        SEI Rewards Week
      </EarnedTypography>
    </FlexCenterRowBox>
  );
};
