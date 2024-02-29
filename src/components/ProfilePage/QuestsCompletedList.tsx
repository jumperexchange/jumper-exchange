import { Container, Stack, Typography } from '@mui/material';
import { QuestCard } from './QuestCard';

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
export const QuestCompletedList = ({ pdas }: any) => {
  //   const { t } = useTranslation();
  //   const { trackEvent } = useUserTracking();

  return (
    <Container sx={{ backgroundColor: '#f9f5ff', borderRadius: '24px' }}>
      <Typography sx={{ marginTop: 5 }}>Completed Missions</Typography>

      <Stack
        direction={'row'}
        spacing={4}
        sx={{ marginTop: 5 }}
        useFlexGap
        flexWrap="wrap"
      >
        {pdas ? (
          pdas?.map((pda: any, index: number) => {
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
        ) : (
          <>
            {/* <BlogArticleCardSkeleton />
            <BlogArticleCardSkeleton />
            <BlogArticleCardSkeleton />
            <BlogArticleCardSkeleton /> */}
          </>
        )}
      </Stack>
    </Container>
  );
};
