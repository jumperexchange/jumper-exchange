import {
  LeftTextBox,
  SuperfestPageElementContainer,
} from '../SuperfestMissionPage.style';
import { Typography } from '@mui/material';
import { sequel85, sora } from 'src/fonts/fonts';
import { Sequel85Typography, SoraTypography } from '../../Superfest.style';

interface DescriptionBox {
  longTitle?: string;
  description?: string;
}

export const DescriptionBox = ({ longTitle, description }: DescriptionBox) => {
  return (
    <SuperfestPageElementContainer>
      <Sequel85Typography fontSize={'48px'} fontWeight={700}>
        {longTitle}
      </Sequel85Typography>
      <LeftTextBox marginTop={'32px'}>
        <SoraTypography fontSize={'18px'} fontWeight={500} lineHeight={'32px'}>
          {description}
        </SoraTypography>
      </LeftTextBox>
    </SuperfestPageElementContainer>
  );
};
