import { FC, ReactNode } from 'react';
import {
  MissionTaskTitle,
  MissionTaskContainer,
  MissionTaskDescription,
  MissionTaskHeaderContainer,
} from './MissionTaskCard.style';
import { Badge } from 'src/components/Badge/Badge';

interface MissionTaskCardProps {
  title: string;
  description: string;
  isActive?: boolean;
  type?: string;
  statusBadge?: ReactNode;
}

export const MissionTaskCard: FC<MissionTaskCardProps> = ({
  title,
  description,
  isActive,
  type = 'Bridge task',
  statusBadge,
}) => {
  return (
    <MissionTaskContainer isActive={isActive}>
      <MissionTaskHeaderContainer>
        <Badge label={type} variant="alpha" />
        {statusBadge}
      </MissionTaskHeaderContainer>
      <MissionTaskTitle>{title}</MissionTaskTitle>
      <MissionTaskDescription>{description}</MissionTaskDescription>
    </MissionTaskContainer>
  );
};
