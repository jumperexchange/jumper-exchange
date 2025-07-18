import Typography from '@mui/material/Typography';
import { ReactNode } from 'react';
import {
  AchievementCardActionArea,
  AchievementCardContent,
  AchievementCardImage,
  AchievementCardLabel,
  AchievementCard as AchievementCardStyled,
} from './AchievementCard.style';
interface AchievementCardProps {
  title: string;
  description: string;
  image: string;
  badge?: ReactNode;
}

export const AchievementCard = ({
  title,
  description,
  image,
  badge,
}: AchievementCardProps) => {
  return (
    <AchievementCardStyled>
      <AchievementCardActionArea focusRipple={false}>
        <AchievementCardImage
          src={image}
          alt={`achievement-card-${title}`}
          width={288}
          height={288}
        />
        <AchievementCardContent>
          <AchievementCardLabel>
            <Typography variant="bodyLargeStrong">{title}</Typography>
            <Typography
              variant="bodySmall"
              sx={(theme) => ({
                color: (theme.vars || theme).palette.text.secondary, // @todo: wrong alpha color
              })}
            >
              {description}
            </Typography>
          </AchievementCardLabel>
          {badge}
        </AchievementCardContent>
      </AchievementCardActionArea>
    </AchievementCardStyled>
  );
};
