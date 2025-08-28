import { FC, ReactNode } from 'react';
import {
  MissionHeroStatsBox,
  MissionHeroStatsText,
  MissionHeroStatsCardVariant,
} from './MissionHeroStatsCard.style';

interface InfoCardProps {
  title: string;
  description: ReactNode;
  variant?: MissionHeroStatsCardVariant;
}
export const MissionHeroStatsCard: FC<InfoCardProps> = ({
  title,
  description,
  variant = MissionHeroStatsCardVariant.Default,
}) => {
  return (
    <MissionHeroStatsBox variant={variant}>
      <MissionHeroStatsText
        sx={{
          typography: {
            xs: 'bodyXXSmallStrong',
            sm: 'bodyXSmallStrong',
          },
        }}
      >
        {title}
      </MissionHeroStatsText>
      {typeof description === 'string' || typeof description === 'number' ? (
        <MissionHeroStatsText
          typography={{
            xs: 'titleXSmall',
            sm: 'titleSmall',
          }}
        >
          {description}
        </MissionHeroStatsText>
      ) : (
        description
      )}
    </MissionHeroStatsBox>
  );
};
