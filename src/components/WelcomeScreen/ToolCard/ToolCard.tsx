import { useCountUpAnimation } from '@/hooks/useCountUpAnimation';
import {
  ToolCardContainer,
  ToolCardCounter,
  ToolCardTitle,
} from './ToolCard.style';

interface ToolCardProps {
  id: string;
  number: string;
  title: string;
  handleClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const ToolCard = ({ id, number, title, handleClick }: ToolCardProps) => {
  const counter = useCountUpAnimation({ children: number, duration: 1000 });
  return (
    <ToolCardContainer className={'stats-card'} onClick={handleClick}>
      <ToolCardCounter
        data-testid={`homepage-stat-${id}-count`}
        variant={'headerMedium'}
      >
        {counter}
      </ToolCardCounter>
      <ToolCardTitle variant={'bodySmall'}>{title}</ToolCardTitle>
    </ToolCardContainer>
  );
};
