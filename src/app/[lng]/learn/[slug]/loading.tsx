import { BackgroundGradient } from '@/components/BackgroundGradient';
import { BlogArticle } from '@/components/Blog/BlogArticle/BlogArticle';
import { BlogCarousel } from '@/components/Blog/BlogCarousel';
import { JoinDiscordBanner } from '@/components/JoinDiscordBanner';
import { PoweredBy } from '@/components/PoweredBy';
import type { Breakpoint } from '@mui/material';
import Box from '@mui/material/Box';

const loading = () => {
  return (
    <>
      <BlogArticle
        subtitle={undefined}
        title={undefined}
        content={undefined}
        slug={undefined}
        id={undefined}
        author={undefined}
        publishedAt={undefined}
        createdAt={undefined}
        updatedAt={undefined}
        tags={undefined}
        image={undefined}
        baseUrl={undefined}
      />
      <Box
        position="relative"
        sx={{
          padding: '48px 16px 4px',

          [theme.breakpoints.up('sm' as Breakpoint)]: {
            padding: '48px 16px 4px',
            paddingTop: '56px',
          },
          [theme.breakpoints.up('md' as Breakpoint)]: {
            padding: '64px 0 4px',
            paddingTop: '96px',
          },
        }}
      >
        <BackgroundGradient styles={{ position: 'absolute' }} />
        <BlogCarousel
          title={t('blog.similarPosts')}
          showAllButton={true}
          data={undefined}
          url={undefined}
        />
        <JoinDiscordBanner />
        <PoweredBy />
      </Box>
    </>
  );
};

export default loading;
