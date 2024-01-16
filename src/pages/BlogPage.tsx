import { Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Layout } from 'src/Layout';
import { BlogHighlights, CustomColor } from 'src/components';

export const BlogPage = () => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Layout hideNavbarTabs={true}>
      <CustomColor
        variant={'lifiBrandHeaderXLarge'}
        sx={{ marginTop: theme.spacing(16), textAlign: 'center' }}
      >
        {t('blog.title')}
      </CustomColor>
      <Typography
        variant={'lifiBodyXLarge'}
        sx={{ marginTop: theme.spacing(2), textAlign: 'center' }}
      >
        {t('blog.subtitle')}
      </Typography>
      <BlogHighlights />
      {/* <AccordionFAQ content={faqData as unknown as FaqMeta[]} /> */}
    </Layout>
  );
};
