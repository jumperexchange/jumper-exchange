import { Container, Typography } from '@mui/material';
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
      <Typography>Completed Missions</Typography>
      <Container>
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
              //   <BlogArticleCard
              //     id={article.id}
              //     baseUrl={url}
              //     trackingCategory={TrackingCategory.BlogCarousel}
              //     key={`blog-carousel-article-${article.id}-${index}`}
              //     image={article.attributes.Image}
              //     title={article.attributes.Title}
              //     slug={article.attributes.Slug}
              //     content={article.attributes.Content}
              //     publishedAt={article.attributes.publishedAt}
              //     createdAt={article.attributes.createdAt}
              //     tags={article.attributes.tags}
              //   />
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
      </Container>
    </Container>
  );
};
