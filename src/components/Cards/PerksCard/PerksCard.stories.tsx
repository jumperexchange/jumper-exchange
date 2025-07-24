import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { Typography } from '@mui/material';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Badge } from '../../Badge/Badge';
import { BadgeSize, BadgeVariant } from '../../Badge/Badge.styles';
import { PerksCard } from './PerksCard';
import { PerksCardSkeleton } from './PerksCardSkeleton';
const meta = {
  title: 'Components/Cards/PerksCard',
  component: PerksCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PerksCard>;

export default meta;
type Story = StoryObj<typeof PerksCard>;

export const NansenPerksCard: Story = {
  args: {
    title: 'Nansen',
    description:
      'Save 20% on all Nansen plans regardless of whether you pay monthly, 6 monthly or yearly.',
    imageUrl:
      'https://strapi.jumper.exchange/uploads/perks_example_card_3d452f1424.png',
    perksBadge: (
      <Badge
        label={
          <Typography component="span" variant="bodySmallStrong">
            20% off
          </Typography>
        }
        variant={BadgeVariant.Alpha}
        size={BadgeSize.LG}
      />
    ),
    levelBadge: (
      <Badge
        startIcon={<LockIcon />}
        label={
          <Typography component="span" variant="bodySmallStrong">
            Level 14
          </Typography>
        }
        variant={BadgeVariant.Alpha}
        size={BadgeSize.LG}
      />
    ),
  },
};

export const NansenPerksCardWithUnlockedBadge: Story = {
  args: {
    title: 'Nansen',
    description:
      'Save 20% on all Nansen plans regardless of whether you pay monthly, 6 monthly or yearly.',
    imageUrl:
      'https://strapi.jumper.exchange/uploads/perks_example_card_3d452f1424.png',
    perksBadge: (
      <Badge
        label={
          <Typography component="span" variant="bodySmallStrong">
            20% off
          </Typography>
        }
        variant={BadgeVariant.Alpha}
        size={BadgeSize.LG}
      />
    ),
    levelBadge: (
      <Badge
        startIcon={<LockOpenIcon />}
        label={
          <Typography component="span" variant="bodySmallStrong">
            Unlocked
          </Typography>
        }
        variant={BadgeVariant.Success}
        size={BadgeSize.LG}
      />
    ),
  },
};

export const PerksCardWithLargeTitleAndDescription: Story = {
  args: {
    title: 'This is a very long title that should be truncated',
    description:
      'This is a very long description that should be truncated [lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.]',
    imageUrl:
      'https://strapi.jumper.exchange/uploads/perks_example_card_3d452f1424.png',
    perksBadge: (
      <Badge
        label={
          <Typography component="span" variant="bodySmallStrong">
            20% off
          </Typography>
        }
        variant={BadgeVariant.Alpha}
        size={BadgeSize.LG}
      />
    ),
    levelBadge: (
      <Badge
        startIcon={<LockIcon />}
        label={
          <Typography component="span" variant="bodySmallStrong">
            Level 14
          </Typography>
        }
        variant={BadgeVariant.Alpha}
        size={BadgeSize.LG}
      />
    ),
  },
};

export const PerksCardWithTransparentImageBackground: Story = {
  args: {
    title: 'Perk with transparent img background',
    description:
      'This is a perk with transparent image background and only level badge',
    imageUrl: 'https://strapi.jumper.exchange/uploads/galxe_d62ffaaad1.png',
    levelBadge: (
      <Badge
        startIcon={<LockIcon />}
        label={
          <Typography component="span" variant="bodySmallStrong">
            Level 14
          </Typography>
        }
        variant={BadgeVariant.Alpha}
        size={BadgeSize.LG}
      />
    ),
  },
};

export const PerksCardWithMissingImage: Story = {
  args: {
    title: 'Perk with missing img',
    description: 'This is a perk with missing image and only level badge',
    imageUrl: '',
    levelBadge: (
      <Badge
        startIcon={<LockIcon />}
        label={
          <Typography component="span" variant="bodySmallStrong">
            Level 14
          </Typography>
        }
        variant={BadgeVariant.Alpha}
        size={BadgeSize.LG}
      />
    ),
  },
};

export const Loading = () => <PerksCardSkeleton />;
