import { FC, ReactNode } from 'react';
import {
  InfoCardBox,
  InfoCardText,
  InfoCardVariant,
} from './BannerCarousel.style';

interface InfoCardProps {
  title: string;
  description: ReactNode;
  variant?: InfoCardVariant;
}
export const InfoCard: FC<InfoCardProps> = ({
  title,
  description,
  variant = InfoCardVariant.Default,
}) => {
  return (
    <InfoCardBox variant={variant}>
      <InfoCardText variant="bodyXSmallStrong">{title}</InfoCardText>
      {typeof description === 'string' ? (
        <InfoCardText variant="titleSmall">{description}</InfoCardText>
      ) : (
        description
      )}
    </InfoCardBox>
  );
};
