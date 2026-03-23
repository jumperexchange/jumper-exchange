import { Meta, StoryObj } from '@storybook/nextjs-vite';
import { BlogArticleCard } from './BlogArticleCard';
import { blogArticle } from './fixtures';
import { JUMPER_STRAPI_URL } from '@/const/urls';

const meta: Meta<typeof BlogArticleCard> = {
  title: 'components/composite/BlogArticleCard',
  component: BlogArticleCard,
  parameters: {
    layout: 'padded',
    nextjs: {
      appDirectory: true,
    },
  },
};

export default meta;
type Story = StoryObj<typeof BlogArticleCard>;

export const BlogArticleSearchPreview: Story = {
  args: {
    variant: 'preview',
    data: blogArticle,
    baseUrl: JUMPER_STRAPI_URL,
    highlight: 'APY',
  },
};
