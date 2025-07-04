import { FC, ReactNode } from 'react';
import {
  MissionTaskTitle,
  MissionTaskContainer,
  MissionTaskDescription,
  MissionTaskHeaderContainer,
} from './MissionTaskCard.style';
import { Badge } from 'src/components/Badge/Badge';
import { MissionTaskCardSkeleton } from './MissionTaskCardSkeleton';

interface MissionTaskCardProps {
  title?: string;
  description?: string;
  isActive?: boolean;
  type?: string;
  statusBadge?: ReactNode;
  onClick?: () => void;
  isLoading?: boolean;
}

export const MissionTaskCard: FC<MissionTaskCardProps> = ({
  title,
  description,
  isActive,
  type = 'Bridge task',
  statusBadge,
  onClick,
  isLoading,
}) => {
  if (isLoading) {
    return <MissionTaskCardSkeleton />;
  }

  return (
    <MissionTaskContainer isActive={isActive} onClick={onClick}>
      <MissionTaskHeaderContainer>
        <Badge label={type} variant="alpha" />
        {statusBadge}
      </MissionTaskHeaderContainer>
      <MissionTaskTitle>{title}</MissionTaskTitle>
      <MissionTaskDescription>{description}</MissionTaskDescription>
    </MissionTaskContainer>
  );
};
