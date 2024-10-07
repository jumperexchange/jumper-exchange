import { Typography } from '@mui/material';
import {
  LeftTextBox,
  SuperfestPageElementContainer,
} from '../SuperfestMissionPage.style';
import { DescriptionTitleTypography } from './DescriptionBoxSF.style';

interface DescriptionBox {
  longTitle?: string;
  description?: string;
}

export const DescriptionBoxSF = ({
  longTitle,
  description,
}: DescriptionBox) => {
  return (
    <SuperfestPageElementContainer>
      <DescriptionTitleTypography>{longTitle}</DescriptionTitleTypography>
      <LeftTextBox marginTop={'32px'}>
        {
          //* todo: check typography (sora) *//
        }
        <Typography variant="bodyLarge" lineHeight={'32px'}>
          {description}
        </Typography>
      </LeftTextBox>
    </SuperfestPageElementContainer>
  );
};
