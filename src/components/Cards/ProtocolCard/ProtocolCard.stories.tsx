import { Badge } from 'src/components/Badge/Badge';
import { BadgeSize, BadgeVariant } from 'src/components/Badge/Badge.styles';
import { commonArgs } from './fixtures';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ProtocolCard } from './ProtocolCard';
import { JUMPER_STRAPI_URL } from '@/const/urls';

const meta = {
  component: ProtocolCard,
  title: 'Earn/ProtocolCard',
} satisfies Meta<typeof ProtocolCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    ...commonArgs,
    fullWidth: false,
  },
};

export const Loading: Story = {
  args: {
    ...commonArgs,
    isLoading: true,
  },
};

export const WithBadge: Story = {
  args: {
    ...commonArgs,
    fullWidth: false,
    headerBadge: (
      <Badge variant={BadgeVariant.Secondary} size={BadgeSize.LG} label="New" />
    ),
  },
};

export const WithLongTitle: Story = {
  args: {
    ...commonArgs,
    data: {
      ...commonArgs.data,
      protocol: {
        ...commonArgs.data.protocol,
        name: 'this is a very long protocol name that should be truncated',
      },
    },
    fullWidth: false,
  },
};

export const TitleContrastColor: Story = {
  args: {
    ...commonArgs,
    fullWidth: false,
    data: {
      ...commonArgs.data,
      protocol: {
        ...commonArgs.data.protocol,
        logo: `${JUMPER_STRAPI_URL}/uploads/protocols_upshift_0bfc05b045.png`,
      },
    },
  },
};

export const TitleContrastColorMidas: Story = {
  args: {
    ...commonArgs,
    fullWidth: false,
    data: {
      ...commonArgs.data,
      protocol: {
        ...commonArgs.data.protocol,
        logo: `${JUMPER_STRAPI_URL}/uploads/Midas_Logo_Icon_PRIMARY_c280a8c7c9.png`,
      },
    },
  },
};
