import { FC, ReactNode } from 'react';
import {
  TaskTitle,
  TaskContainer,
  TaskDescription,
  TaskHeaderContainer,
} from './TaskCard.styles';
import { Badge } from 'src/components/Badge/Badge';
import { TaskCardSkeleton } from './TaskCardSkeleton';

interface TaskCardProps {
  title?: string;
  description?: string;
  isActive?: boolean;
  type?: string;
  statusBadge?: ReactNode;
  onClick?: () => void;
  isLoading?: boolean;
}

export const TaskCard: FC<TaskCardProps> = ({
  title,
  description,
  isActive = true,
  type = 'Bridge task',
  statusBadge,
  onClick,
  isLoading,
}) => {
  if (isLoading) {
    return <TaskCardSkeleton />;
  }

  return (
    <TaskContainer isActive={isActive} onClick={onClick}>
      <TaskHeaderContainer>
        <Badge label={type} variant="alpha" />
        {statusBadge}
      </TaskHeaderContainer>
      <TaskTitle>{title}</TaskTitle>
      <TaskDescription>{description}</TaskDescription>
    </TaskContainer>
  );
};
