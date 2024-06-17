import { useCountUpAnimation } from '@/hooks/useCountUpAnimation';
import {
  ToolCardContainer,
  ToolCardCounter,
  ToolCardTitle,
} from './ToolCard.style';

interface ToolCardProps {
  number: string;
  title: string;
  handleClick: () => void;
}

export const ToolCard = ({ number, title, handleClick }: ToolCardProps) => {
  const counter = useCountUpAnimation({ children: number, duration: 1000 });
  return (
    <ToolCardContainer className={'stats-card'} onClick={handleClick}>
      <ToolCardCounter variant={'lifiHeaderMedium'}>{counter}</ToolCardCounter>
      <ToolCardTitle variant={'lifiBodySmall'}>{title}</ToolCardTitle>
    </ToolCardContainer>
  );
};
