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
    image:
      'https://strapi.jumper.exchange/uploads/perks_example_card_3d452f1424.png',
    badge: (
      <>
        <Badge
          label={
            <Typography component="span" variant="bodySmallStrong">
              20% off
            </Typography>
          }
          variant={BadgeVariant.Alpha}
          size={BadgeSize.LG}
        />
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
      </>
    ),
  },
};

export const NansenPerksCardWithUnlockedBadge: Story = {
  args: {
    title: 'Nansen',
    description:
      'Save 20% on all Nansen plans regardless of whether you pay monthly, 6 monthly or yearly.',
    image:
      'https://strapi.jumper.exchange/uploads/perks_example_card_3d452f1424.png',
    badge: (
      <>
        <Badge
          label={
            <Typography component="span" variant="bodySmallStrong">
              20% off
            </Typography>
          }
          variant={BadgeVariant.Alpha}
          size={BadgeSize.LG}
        />
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
      </>
    ),
  },
};

export const PerksCardWithLargeTitleAndDescription: Story = {
  args: {
    title: 'NansenNansenNansenNansenNansenNansenNansenNansenNansenNansen',
    description:
      'Save 20% on all Nansen plans regardless of whether you pay monthly, 6 monthly or yearly.Save 20% on all Nansen plans regardless of whether you pay monthly, 6 monthly or yearly.Save 20% on all Nansen plans regardless of whether you pay monthly, 6 monthly or yearly.Save 20% on all Nansen plans regardless of whether you pay monthly, 6 monthly or yearly.Save 20% on all Nansen plans regardless of whether you pay monthly, 6 monthly or yearly.Save 20% on all Nansen plans regardless of whether you pay monthly, 6 monthly or yearly.',
    image:
      'https://strapi.jumper.exchange/uploads/perks_example_card_3d452f1424.png',
    badge: (
      <>
        <Badge
          label={
            <Typography component="span" variant="bodySmallStrong">
              20% off
            </Typography>
          }
          variant={BadgeVariant.Alpha}
          size={BadgeSize.LG}
        />
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
      </>
    ),
  },
};

export const Skeleton = () => <PerksCardSkeleton />;
