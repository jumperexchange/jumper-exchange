import { Meta, StoryObj } from '@storybook/nextjs-vite';
import { BlogArticleCard } from './BlogArticleCard';
import { blogArticle } from './fixtures';

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
    highlight: 'APY',
  },
};
