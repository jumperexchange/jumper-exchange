'use client';

import type { PDA } from '@/types/loyaltyPass';
import { useAccount } from '@lifi/wallet-management';
import { useTranslation } from 'react-i18next';
// import { CarouselContainer } from 'src/components/Blog/BlogCarousel/CarouselContainer';
import { Carousel } from 'src/components/Carousel/Carousel';
import { Container } from 'src/components/Container/Container';
import { capitalizeString } from 'src/utils/capitalizeString';
import { QuestCard } from '../QuestCard/QuestCard';
import { VoidQuestCard } from '../QuestCard/VoidQuestCard';

const responsive = {
  desktop: {
    breakpoint: {
      max: 3000,
      min: 1328,
    },
    items: 3,
    partialVisibilityGutter: 40,
  },
  mobile: {
    breakpoint: {
      max: 600,
      min: 0,
    },
    items: 1,
    partialVisibilityGutter: 30,
  },
  tablet: {
    breakpoint: {
      max: 1200,
      min: 600,
    },
    items: 1,
    // partialVisibilityGutter: 30
  },
};

interface QuestCompletedListProps {
  pdas?: PDA[];
  loading: boolean;
}

export const QuestsCompletedCarousel = ({
  pdas,
  loading,
}: QuestCompletedListProps) => {
  const { account } = useAccount();
  const { t } = useTranslation();

  const showVoidCardsAsFewPdas =
    (!loading && pdas && pdas?.length < 6 && account?.address) ||
    !account?.address;

  const today = new Date();
  // to do: activate when PDA were not done on time
  // const lastMonth = new Date(
  //   today.getFullYear(),
  //   today.getMonth() - 1,
  //   today.getDate(),
  // );
  const updateDay = new Date(today.getFullYear(), today.getMonth(), 2);

  const carouselContent = [
    // Render quests
    ...(!loading && pdas
      ? pdas
          .filter((pda: PDA) => pda?.reward) // Filter out PDAs without rewards
          .map((pda: PDA, index: number) => {
            const data = {
              id: pda?.id,
              completed: true,
              active: false,
              title: capitalizeString(pda?.reward?.name),
              image: pda?.reward?.image,
              points: pda?.points,
            };
            return <QuestCard key={`completed-mission-${index}`} data={data} />;
          })
      : []),
    // Render void cards
    ...(showVoidCardsAsFewPdas
      ? Array.from(
          { length: pdas && pdas?.length > 0 ? 4 - pdas.length : 4 },
          () => 42,
        ).map((_, idx) => (
          <VoidQuestCard
            key={'void-' + idx}
            // connected={!!account?.address && account?.chainType === 'EVM'}
          />
        ))
      : []),
    // Render loading skeletons
    ...(loading
      ? Array.from({ length: 4 }, () => 42).map((_, idx) => (
          <QuestCard key={'skeleton-' + idx} data={{}} />
        ))
      : []),
  ];

  console.log('carouselContent', carouselContent);

  return (
    <Container>
      <Carousel
        responsive={responsive}
        updateTitle={`Updated: ${t('format.date', { value: updateDay })}`}
      >
        {carouselContent.map((item) => (
          <div style={{ width: '288px', margin: '0 16px' }}>{item}</div>
        ))}
      </Carousel>
    </Container>
  );
};
