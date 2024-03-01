import { Box, Container, Stack, Typography } from '@mui/material';
import { QuestCard } from './QuestCard';
import {
  CompletedQuestContainer,
  CompletedQuestHeader,
  CompletedQuestTitle,
} from './QuestsCompletedList.style';
import { VoidQuestCard } from './VoidQuestCard';
import { QuestCardSkeleton } from './QuestCardSkeleton';

const data = [
  {
    title: 'OP Red Wars',
    img: '',
    points: 50,
  },
  {
    title: 'Arb Red Wars',
    img: '',
    points: 50,
  },
  {
    title: 'Solana Launch Party',
    img: '',
    points: 50,
  },
  {
    title: 'OP Red Wars',
    img: '',
    points: 50,
  },
  {
    title: 'Arb Red Wars',
    img: '',
    points: 50,
  },
  {
    title: 'Solana Launch Party',
    img: '',
    points: 50,
  },
  {
    title: 'OP Red Wars',
    img: '',
    points: 50,
  },
  {
    title: 'Arb Red Wars',
    img: '',
    points: 50,
  },
  {
    title: 'Solana Launch Party',
    img: '',
    points: 50,
  },
];
export const QuestCompletedList = ({ pdas, dataIsFetched }: any) => {
  //   const { t } = useTranslation();
  //   const { trackEvent } = useUserTracking();

  return (
    <CompletedQuestContainer>
      <CompletedQuestHeader>
        <CompletedQuestTitle>Completed Missions</CompletedQuestTitle>
      </CompletedQuestHeader>
      <Stack
        direction={'row'}
        spacing={4}
        sx={{
          marginTop: 5,
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'center',
        }}
        useFlexGap
        flexWrap="wrap"
      >
        {dataIsFetched && pdas
          ? pdas?.map((pda: any, index: number) => {
              return (
                <QuestCard
                  key={`completed-mission-${index}`}
                  active={false}
                  title={pda?.dataAsset.title}
                  image={pda?.dataAsset.image}
                  points={pda?.dataAsset.claim.points}
                />
              );
            })
          : Array.from({ length: 6 }, () => 42).map(
              (el: any, index: number) => <QuestCardSkeleton />,
            )}
        {dataIsFetched && pdas.length < 6
          ? Array.from({ length: 6 - pdas.length }, () => 42).map(
              (el: any, index: number) => <VoidQuestCard />,
            )
          : null}
      </Stack>
    </CompletedQuestContainer>
  );
};
