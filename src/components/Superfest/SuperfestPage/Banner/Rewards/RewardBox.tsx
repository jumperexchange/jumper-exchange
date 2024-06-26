import { Box, Breakpoint, Stack, Typography, useTheme } from '@mui/material';
import { sequel85, sora } from 'src/fonts/fonts';
import Image from 'next/image';
import { RewardLeftBox } from '../Banner.style';
import { FlexCenterRowBox } from '../../SuperfestMissionPage.style';

interface RewardBoxProps {
  logo: string;
  title: string;
  value: string;
}

export const RewardBox = ({ logo, title, value }: RewardBoxProps) => {
  return (
    <FlexCenterRowBox>
      <Image src={logo} style={{}} alt="base" width="48" height="48" />
      <RewardLeftBox>
        <Typography
          sx={{
            fontSize: '16px',
            typography: sora.style.fontFamily,
            fontWeight: 700,
            color: '#525252',
          }}
        >
          {title}
        </Typography>
        <Typography
          sx={{
            fontSize: '18px',
            typography: sora.style.fontFamily,
            fontWeight: 800,
          }}
        >
          {value}
        </Typography>
      </RewardLeftBox>
    </FlexCenterRowBox>
  );
};
