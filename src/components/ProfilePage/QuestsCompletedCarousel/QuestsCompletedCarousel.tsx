'use client';

import type { PDA } from '@/types/loyaltyPass';
import { useAccount } from '@lifi/wallet-management';
import { useTranslation } from 'react-i18next';
// import { CarouselContainer } from 'src/components/Blog/BlogCarousel/CarouselContainer';
import { Box } from '@mui/material';
import { useMemo } from 'react';
import { Carousel } from 'src/components/Carousel/Carousel';
import { CarouselNavigation } from 'src/components/Carousel/Navigation';
import { capitalizeString } from 'src/utils/capitalizeString';
import IconHeader from '../Common/IconHeader';
import { QuestCard } from '../QuestCard/QuestCard';
import { VoidQuestCard } from '../QuestCard/VoidQuestCard';
import { CompletedQuestContainer } from './QuestsCompletedCarousel.style';

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

  const today = new Date();
  // to do: activate when PDA were not done on time
  // const lastMonth = new Date(
  //   today.getFullYear(),
  //   today.getMonth() - 1,
  //   today.getDate(),
  // );
  const updateDay = new Date(today.getFullYear(), today.getMonth(), 2);

  const carouselContent = useMemo(() => {
    const showVoidCardsAsFewPdas =
      (!loading && pdas && pdas?.length < 6 && account?.address) ||
      !account?.address;

    return [
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
              return (
                <QuestCard key={`completed-mission-${index}`} data={data} />
              );
            })
        : []),
      // Render void cards
      ...(showVoidCardsAsFewPdas
        ? Array.from({ length: 10 }, () => 42).map((_, idx) => (
            <VoidQuestCard
              key={'void-' + idx}
              // connected={!!account?.address && account?.chainType === 'EVM'}
            />
          ))
        : []),
      // Render loading skeletons
      ...(loading
        ? Array.from({ length: 8 }, () => 42).map((_, idx) => (
            <QuestCard key={'skeleton-' + idx} data={{ title: 'test' + idx }} />
          ))
        : []),
    ];
  }, [pdas, loading]);

  const headerInfo = (
    <Box
      sx={(theme) => ({ [theme.breakpoints.down('sm')]: { display: 'none' } })}
    >
      <IconHeader
        title={`Updated: ${t('format.date', { value: updateDay })}`}
        tooltip={t('completedMissionsInformation.description')}
      />
    </Box>
  );

  return (
    <CompletedQuestContainer sx={{ position: 'relative' }}>
      <Carousel
        headerInfo={headerInfo}
        CarouselNavigation={CarouselNavigation}
        fixedSlideWidth={true}
        title={t('missions.completed')}
      >
        {carouselContent}
      </Carousel>
    </CompletedQuestContainer>
  );
};
