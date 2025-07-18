'use client';

import type { PDA } from '@/types/loyaltyPass';
import { useAccount } from '@lifi/wallet-management';
import { Box, Typography } from '@mui/material';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { AchievementCard } from 'src/components/AchievementCard/AchievementCard';
import { AchievementCardSkeleton } from 'src/components/AchievementCard/AchievementCardSkeleton';
import { Badge } from 'src/components/Badge/Badge';
import { BadgeSize, BadgeVariant } from 'src/components/Badge/Badge.styles';
import { Carousel } from 'src/components/Carousel/Carousel';
import { CarouselNavigation } from 'src/components/Carousel/Navigation';
import { capitalizeString } from 'src/utils/capitalizeString';
import IconHeader from '../Common/IconHeader';
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
                title: capitalizeString(pda?.reward?.name),
                image: pda?.reward?.image,
                points: pda?.points,
              };
              const [rawTitle] = pda?.reward?.name
                .replaceAll(' ', '')
                .split('-');
              if (!rawTitle) {
                return null;
              }
              const title = capitalizeString(rawTitle);
              const date = new Date(pda?.timestamp);
              const year = date.getFullYear();
              const month = date.toLocaleString('default', { month: 'long' });
              const description = `${capitalizeString(month)} ${year}`;
              return (
                <AchievementCard
                  key={`completed-mission-${index}-${pda?.id}`}
                  title={title}
                  description={description}
                  image={data.image}
                  badge={
                    pda?.points && (
                      <Badge
                        size={BadgeSize.LG}
                        label={
                          <Typography
                            component="span"
                            variant="bodySmallStrong"
                          >{`${pda?.points.toString()} XP`}</Typography>
                        }
                        variant={BadgeVariant.Alpha}
                      />
                    )
                  }
                />
              );
            })
        : []),
      // Render void cards
      ...(showVoidCardsAsFewPdas
        ? Array.from({ length: 10 }, () => 42).map((_, idx) => (
            <AchievementCardSkeleton
              isVoidCard={true}
              key={'void-' + idx}
              // connected={!!account?.address && account?.chainType === 'EVM'}
            />
          ))
        : []),
      // Render loading skeletons
      ...(loading
        ? Array.from({ length: 8 }, () => 42).map((_, idx) => (
            <AchievementCardSkeleton key={`achievement-card-skeleton-${idx}`} />
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
        spaceBetween={0} // spacing set via margin to display box-shadow
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
