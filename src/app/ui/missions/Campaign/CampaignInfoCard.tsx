import { FC, ReactNode } from 'react';
import { CampaignInfoCardContainer, CampaignInfoText } from './Campaign.style';

interface CampaignInfoCardProps {
  title: string;
  description: ReactNode;
}
export const CampaignInfoCard: FC<CampaignInfoCardProps> = ({
  title,
  description,
}) => {
  return (
    <CampaignInfoCardContainer>
      <CampaignInfoText variant="bodyXSmallStrong">{title}</CampaignInfoText>
      {typeof description === 'string' ? (
        <CampaignInfoText variant="titleSmall">{description}</CampaignInfoText>
      ) : (
        description
      )}
    </CampaignInfoCardContainer>
  );
};
