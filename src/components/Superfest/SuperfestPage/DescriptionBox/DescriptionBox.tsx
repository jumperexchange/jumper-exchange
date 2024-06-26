import {
  LeftTextBox,
  SuperfestPageElementContainer,
} from '../SuperfestMissionPage.style';
import { Typography } from '@mui/material';
import { sequel85, sora } from 'src/fonts/fonts';

interface DescriptionBox {
  longTitle?: string;
  description?: string;
}

export const DescriptionBox = ({ longTitle, description }: DescriptionBox) => {
  return (
    <SuperfestPageElementContainer>
      <Typography
        sx={{
          typography: sequel85.style.fontFamily,
          fontSize: '48px',
          fontWeight: 700,
        }}
      >
        {longTitle}
      </Typography>
      <LeftTextBox marginTop={'32px'}>
        <Typography
          sx={{
            fontFamily: sora.style.fontFamily,
            fontSize: '18px',
            fontWeight: 500,
            lineHeight: '32px',
          }}
        >
          {description}
        </Typography>
      </LeftTextBox>
    </SuperfestPageElementContainer>
  );
};
