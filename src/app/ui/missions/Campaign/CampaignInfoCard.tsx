import { FC, ReactNode } from 'react';
import {
  CampaignInfoCardContainer,
  CampaignInfoText,
  InfoCardVariant,
} from './Campaign.style';

interface CampaignInfoCardProps {
  title: string;
  description: ReactNode;
  variant?: InfoCardVariant;
}
export const CampaignInfoCard: FC<CampaignInfoCardProps> = ({
  title,
  description,
  variant = InfoCardVariant.Default,
}) => {
  return (
    <CampaignInfoCardContainer variant={variant}>
      <CampaignInfoText variant="bodyXSmallStrong">{title}</CampaignInfoText>
      {typeof description === 'string' ? (
        <CampaignInfoText variant="titleSmall">{description}</CampaignInfoText>
      ) : (
        description
      )}
    </CampaignInfoCardContainer>
  );
};
