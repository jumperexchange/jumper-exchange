import { Typography } from '@mui/material';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Badge } from '../../Badge/Badge';
import { BadgeSize, BadgeVariant } from '../../Badge/Badge.styles';
import { AchievementCard } from './AchievementCard';
import { AchievementCardSkeleton } from './AchievementCardSkeleton';

const meta = {
  title: 'Components/Cards/AchievementCard',
  component: AchievementCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AchievementCard>;

export default meta;
type Story = StoryObj<typeof AchievementCard>;

export const ChainoorWithBadge: Story = {
  args: {
    title: 'Chain_oor',
    description: 'November 2024',
    imageUrl:
      'https://storage.googleapis.com/jumper-static-assets/upload/chainoor.png',
    badge: (
      <Badge
        label={
          <Typography component="span" variant="bodySmallStrong">
            30 XP
          </Typography>
        }
        variant={BadgeVariant.Alpha}
        size={BadgeSize.MD}
      />
    ),
  },
};

export const SwapoorWithBadge: Story = {
  args: {
    title: 'Swap_oor',
    description: 'October 2024',
    imageUrl:
      'https://storage.googleapis.com/jumper-static-assets/upload/swapoor.png',
    badge: (
      <Badge
        label={
          <Typography component="span" variant="bodySmallStrong">
            10 XP
          </Typography>
        }
        variant={BadgeVariant.Alpha}
        size={BadgeSize.MD}
      />
    ),
  },
};

export const CampaignWithMissingImageUrl: Story = {
  args: {
    title: 'Swap_oor',
    description: 'October 2024',
    badge: (
      <Badge
        label={
          <Typography component="span" variant="bodySmallStrong">
            10 XP
          </Typography>
        }
        variant={BadgeVariant.Alpha}
        size={BadgeSize.MD}
      />
    ),
  },
};

export const CampaignWithDisabledBadge: Story = {
  args: {
    title: 'SuperSeiyan Week',
    description: 'September 2024',
    imageUrl:
      'https://storage.googleapis.com/jumper-static-assets/upload/superseiyan_week.jpg',
    badge: (
      <Badge
        label={
          <Typography component="span" variant="bodySmallStrong">
            9 XP
          </Typography>
        }
        variant={BadgeVariant.Disabled}
        size={BadgeSize.MD}
      />
    ),
  },
};

export const CampaignWithLargeTitle: Story = {
  args: {
    title: 'MerryJumperChristmas',
    description: 'December 2024',
    imageUrl:
      'https://storage.googleapis.com/jumper-static-assets/upload/superseiyan_week.jpg',
    badge: (
      <Badge
        label={
          <Typography component="span" variant="bodySmallStrong">
            7 XP
          </Typography>
        }
        variant={BadgeVariant.Disabled}
        size={BadgeSize.MD}
      />
    ),
  },
};

export const Loading = () => <AchievementCardSkeleton />;
