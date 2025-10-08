import { Meta, StoryObj } from '@storybook/nextjs-vite';
import { RichBlocks } from './RichBlocks';
import { RichBlocksVariant } from './types';

const meta: Meta<typeof RichBlocks> = {
  title: 'Components/RichBlocks',
  component: RichBlocks,
  parameters: {
    layout: 'padded',
    nextjs: {
      appDirectory: true,
    },
  },
};

export default meta;
type Story = StoryObj<typeof RichBlocks>;

export const Paragraphs: Story = {
  args: {
    content: [
      {
        type: 'paragraph',
        children: [
          {
            type: 'text',
            text: 'This is the first paragraph with some sample text. It demonstrates how the RichBlocks component renders paragraph content.',
            bold: false,
            italic: false,
            underline: false,
            strikethrough: false,
          },
        ],
      },
      {
        type: 'paragraph',
        children: [
          {
            type: 'text',
            text: 'This is the second paragraph. It shows that multiple paragraphs can be rendered sequentially. The component handles each paragraph block separately.',
            bold: false,
            italic: false,
            underline: false,
            strikethrough: false,
          },
        ],
      },
    ],
  },
};

export const ParagraphsMixedStyling: Story = {
  args: {
    content: [
      {
        type: 'paragraph',
        children: [
          {
            type: 'text',
            text: 'This is normal text, ',
            bold: false,
            italic: false,
            underline: false,
            strikethrough: false,
          },
          {
            type: 'text',
            text: 'this is bold text, ',
            bold: true,
            italic: false,
            underline: false,
            strikethrough: false,
          },
          {
            type: 'text',
            text: 'this is italic text, ',
            bold: false,
            italic: true,
            underline: false,
            strikethrough: false,
          },
          {
            type: 'text',
            text: 'and this is <span style="color: purple; fontSize: 12px">styled</span> text',
            bold: false,
            italic: false,
          },
        ],
      },
    ],
  },
};

export const Headings: Story = {
  args: {
    content: [
      {
        type: 'heading',
        level: 1,
        children: [
          {
            type: 'text',
            text: 'This is the first heading',
          },
        ],
      },
      {
        type: 'heading',
        level: 2,
        children: [
          {
            type: 'text',
            text: 'This is the second heading',
          },
        ],
      },
      {
        type: 'heading',
        level: 3,
        children: [
          {
            type: 'text',
            text: 'This is the third heading',
          },
        ],
      },
      {
        type: 'heading',
        level: 4,
        children: [
          {
            type: 'text',
            text: 'This is the fourth heading',
          },
        ],
      },
      {
        type: 'heading',
        level: 5,
        children: [
          {
            type: 'text',
            text: 'This is the fifth heading',
          },
        ],
      },
      {
        type: 'heading',
        level: 6,
        children: [
          {
            type: 'text',
            text: 'This is the sixth heading',
          },
        ],
      },
    ],
  },
};

export const HeadingWithLink: Story = {
  args: {
    content: [
      {
        type: 'heading',
        level: 1,
        children: [
          {
            type: 'text',
            text: 'This is the first heading ',
          },
          {
            type: 'link',
            url: 'https://www.google.com',
            children: [
              {
                type: 'text',
                text: 'with a link',
              },
            ],
          },
          {
            type: 'text',
            text: ' and more text',
          },
        ],
      },
    ],
  },
};

export const HeadingWithCustomStyling: Story = {
  args: {
    content: [
      {
        type: 'heading',
        level: 1,
        children: [
          {
            type: 'text',
            text: 'This is the first heading ',
          },
          {
            type: 'link',
            url: 'https://www.google.com',
            children: [
              {
                type: 'text',
                text: 'with a link',
              },
            ],
          },
          {
            type: 'text',
            text: ' and more text',
          },
        ],
      },
    ],
    blockSx: {
      heading: {
        a: { textDecoration: 'none' },
      },
    },
  },
};

export const Quotes: Story = {
  args: {
    content: [
      {
        type: 'quote',
        children: [
          {
            type: 'text',
            text: 'This is a quote',
          },
        ],
      },
    ],
  },
};

export const BlogArticleImages: Story = {
  args: {
    content: [
      {
        type: 'image',
        image: {
          name: 'AI_Memecoins_and_Crypto',
          alternativeText: 'AI Memecoins and Crypto illustration',
          caption: 'AI-powered cryptocurrency and memecoin trading',
          width: 800,
          height: 600,
          formats: {
            small: {
              url: 'https://strapi.jumper.exchange/uploads/small_AI_Memecoins_and_Crypto_f98c61b932.png',
              width: 400,
              height: 300,
              hash: 'small_hash_123',
              ext: '.png',
              mime: 'image/png',
              size: 45.2,
            },
            medium: {
              url: 'https://strapi.jumper.exchange/uploads/medium_AI_Memecoins_and_Crypto_f98c61b932.png',
              width: 600,
              height: 450,
              hash: 'medium_hash_123',
              ext: '.png',
              mime: 'image/png',
              size: 89.7,
            },
            large: {
              url: 'https://strapi.jumper.exchange/uploads/large_AI_Memecoins_and_Crypto_f98c61b932.png',
              width: 800,
              height: 600,
              hash: 'large_hash_123',
              ext: '.png',
              mime: 'image/png',
              size: 156.3,
            },
            thumbnail: {
              url: 'https://strapi.jumper.exchange/uploads/thumb_AI_Memecoins_and_Crypto_f98c61b932.png',
              width: 150,
              height: 150,
              hash: 'thumb_hash_123',
              ext: '.png',
              mime: 'image/png',
              size: 12.8,
            },
          },
          hash: 'AI_Memecoins_and_Crypto_f98c61b932',
          ext: '.png',
          mime: 'image/png',
          size: 156.3,
          url: 'https://strapi.jumper.exchange/uploads/AI_Memecoins_and_Crypto_f98c61b932.png',
          previewUrl:
            'https://strapi.jumper.exchange/uploads/AI_Memecoins_and_Crypto_f98c61b932.png',
          provider: 'local',
          provider_metadata: {},
          createdAt: '2024-11-18T10:00:00.000Z',
          updatedAt: '2024-11-18T10:00:00.000Z',
        },
        children: [
          {
            type: 'text',
            text: '',
          },
        ],
      },
    ],
    variant: RichBlocksVariant.BlogArticle,
  },
};

export const BlogArticleCTA: Story = {
  args: {
    content: [
      {
        type: 'paragraph',
        children: [
          {
            type: 'text',
            text: '<JUMPER_CTA title="Jumper" url="https://jumper.exchange" />',
          },
        ],
      },
    ],
    variant: RichBlocksVariant.BlogArticle,
  },
};

export const BlogArticleWidget: Story = {
  args: {
    content: [
      {
        type: 'paragraph',
        children: [
          {
            type: 'text',
            text: '<WIDGET fromChain="1" fromToken="USDC" toChain="1" toToken="USDC" fromAmount="100" />',
          },
        ],
      },
    ],
    variant: RichBlocksVariant.BlogArticle,
  },
};

const instructionsJSON = [
  {
    title: 'Step 1',
    step: '1',
    link: { label: 'Connect Wallet', url: 'https://jumper.exchange' },
  },
  {
    title: 'Step 2',
    step: '2',
    link: { label: 'Select Token', url: 'https://jumper.exchange' },
  },
  {
    title: 'Step 3',
    step: '3',
    link: { label: 'Select Amount', url: 'https://jumper.exchange' },
  },
  {
    title: 'Step 4',
    step: '4',
    link: { label: 'Review Transaction', url: 'https://jumper.exchange' },
  },
];

export const BlogArticleInstructions: Story = {
  args: {
    content: [
      {
        type: 'paragraph',
        children: [
          {
            type: 'text',
            text: `<INSTRUCTIONS ${JSON.stringify(instructionsJSON)} />`,
          },
        ],
      },
    ],
    variant: RichBlocksVariant.BlogArticle,
  },
};
