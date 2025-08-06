import { Typography } from '@mui/material';
import {
  LeftTextBox,
  QuestsPageElementContainer,
} from '../QuestsMissionPage.style';
import { DescriptionTitleTypography } from './DescriptionBox.style';

interface DescriptionBox {
  longTitle?: string;
  description?: string;
}

export const DescriptionBox = ({ longTitle, description }: DescriptionBox) => {
  return (
    <QuestsPageElementContainer>
      <DescriptionTitleTypography>{longTitle}</DescriptionTitleTypography>
      <LeftTextBox marginTop={'32px'}>
        <Typography fontSize={'18px'} fontWeight={500} lineHeight={'32px'}>
          {description}
        </Typography>
      </LeftTextBox>
    </QuestsPageElementContainer>
  );
};
