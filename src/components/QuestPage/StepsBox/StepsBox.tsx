import { type RootNode } from 'node_modules/@strapi/blocks-react-renderer/dist/BlocksRenderer';
import { CustomRichBlocks } from 'src/components/Blog';
import { getStrapiBaseUrl } from 'src/utils/strapi/strapiHelper';
import { DescriptionTitleTypography } from '../DescriptionBox/DescriptionBox.style';
import {
  LeftTextBox,
  QuestsPageElementContainer,
} from '../QuestsMissionPage.style';

interface StepsBoxProps {
  steps?: RootNode[];
}

export const StepsBox = ({ steps }: StepsBoxProps) => {
  const baseUrl = getStrapiBaseUrl();
  return (
    <QuestsPageElementContainer>
      <LeftTextBox>
        <DescriptionTitleTypography>
          Steps to complete the mission
        </DescriptionTitleTypography>
      </LeftTextBox>
      <CustomRichBlocks id={1} baseUrl={baseUrl} content={steps} />
    </QuestsPageElementContainer>
  );
};
