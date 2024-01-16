import { Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Layout } from 'src/Layout';
import { AccordionFAQ, BlogHighlights, CustomColor } from 'src/components';
import { useStrapi } from 'src/hooks';
import type { FaqData, FaqMeta } from 'src/types';

export const BlogPage = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { data: faqData } = useStrapi<FaqData>({
    contentType: 'faq-items',
    filterDisplayed: true,
    queryKey: 'faq',
  });

  console.log('FAQDATA', faqData);
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
      <AccordionFAQ content={faqData as unknown as FaqMeta[]} />
    </Layout>
  );
};
