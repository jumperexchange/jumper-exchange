import { Typography } from '@mui/material';
import { Card, Container } from './StatsCard.style';

interface StatsCardProps {
  number: number;
  title: string;
}

export const StatsCard = ({ number, title }: StatsCardProps) => {
  return (
    <Card>
      <Typography
        variant={'lifiBrandHeaderXLarge'}
        style={{ fontSize: '32px', lineHeight: '40px' }}
      >
        {number}
      </Typography>
      <Typography
        variant={'lifiBrandHeaderLarge'}
        style={{ fontSize: '18px', lineHeight: '24px' }}
      >
        {title}
      </Typography>
    </Card>
  );
};

export const StatsCards = () => {
  const data = [
    {
      title: 'Chains',
      number: 17,
    },
    {
      title: 'Bridges',
      number: 14,
    },
    {
      title: 'DEXs',
      number: 34,
    },
  ];
  return (
    <Container>
      {data.map((el, index) => {
        return (
          <StatsCard
            key={`stats-card-${index}`}
            title={el.title}
            number={el.number}
          />
        );
      })}
    </Container>
  );
};
