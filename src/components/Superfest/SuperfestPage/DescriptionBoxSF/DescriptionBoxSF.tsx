import { SoraTypography } from '../../Superfest.style';
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
        <SoraTypography fontSize={'18px'} fontWeight={500} lineHeight={'32px'}>
          {description}
        </SoraTypography>
      </LeftTextBox>
    </SuperfestPageElementContainer>
  );
};
