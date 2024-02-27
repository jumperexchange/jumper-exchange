import { useTranslation } from 'react-i18next';
import { CarouselContainer } from 'src/components';
import { BlogCarouselContainer } from './BlogCarousel.style';
import { QuestCard } from './QuestCard';
import { useOngoingQuests } from 'src/hooks/useOngoingQuests';

interface BlogCarouselProps {
  showAllButton?: boolean;
  url?: URL;
  title?: string;
  //   data: BlogArticleData[];
}

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

export const QuestCarousel = ({ quests }: any) => {
  const { t } = useTranslation();
  const { url } = useOngoingQuests();
  //   const { trackEvent } = useUserTracking();

  return (
    <BlogCarouselContainer>
      <CarouselContainer
        title={'Ongoing Missions'}
        // trackingCategory={TrackingCategory.BlogCarousel}
      >
        {quests ? (
          quests?.map((quest: any, index: number) => {
            return (
              <QuestCard
                active={true}
                title={quest?.attributes.Title}
                image={
                  new URL(
                    quest.attributes.Image?.data?.attributes?.url,
                    url.origin,
                  )
                }
                points={quest?.attributes.Points}
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
      </CarouselContainer>
    </BlogCarouselContainer>
  );
};
