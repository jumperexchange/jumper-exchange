import CheckIcon from '@mui/icons-material/Check';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { FC, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/Badge/Badge';
import { BadgeSize, BadgeVariant } from '@/components/Badge/Badge.styles';
import { useFormatDisplayPerkData } from '@/hooks/perks/useFormatDisplayPerkData';
import type { PerksDataAttributes } from '@/types/strapi';
import { getTextEllipsisStyles } from '@/utils/styles/getTextEllipsisStyles';
import {
  PerkCardBadges,
  PerkCardContainer,
  PerkCardContent,
  PerkCardHeader,
  PerkCardImage,
  PerkCardImagePlaceholder,
} from './UnlockedPerksSection.styles';

export type PerkCardStatus = 'unlocked' | 'locked' | 'claimed';

interface PerkCardProps {
  perk: PerksDataAttributes;
  status?: PerkCardStatus;
}

const dimmedImageSx = { filter: 'brightness(0.65)' } as const;

export const PerkCard: FC<PerkCardProps> = ({ perk, status = 'unlocked' }) => {
  const { t } = useTranslation();
  const { title, description, imageUrl, perkItems } =
    useFormatDisplayPerkData(perk);

  const isDimmed = status !== 'unlocked';

  const statusBadge: Record<
    PerkCardStatus,
    { icon: ReactElement; label: string; variant: BadgeVariant }
  > = {
    unlocked: {
      icon: <LockOpenIcon />,
      label: t('profile_page.unlocked'),
      variant: BadgeVariant.Success,
    },
    locked: {
      icon: <LockIcon />,
      label: t('profile_page.levelWithValue', { level: perk.UnlockLevel }),
      variant: BadgeVariant.Alpha,
    },
    claimed: {
      icon: <CheckIcon />,
      label: t('profile_page.claimed'),
      variant: BadgeVariant.Success,
    },
  };

  const badge = statusBadge[status];

  return (
    <PerkCardContainer>
      {imageUrl ? (
        <PerkCardImage
          src={imageUrl}
          alt={title}
          sx={isDimmed ? dimmedImageSx : undefined}
        />
      ) : (
        <PerkCardImagePlaceholder sx={isDimmed ? dimmedImageSx : undefined} />
      )}
      <PerkCardContent>
        <PerkCardHeader>
          <Typography variant="bodyMediumStrong" color="textPrimary" noWrap>
            {title}
          </Typography>
          <Typography
            variant="bodyXSmall"
            color="textSecondary"
            sx={getTextEllipsisStyles(2, 32)}
          >
            {description}
          </Typography>
        </PerkCardHeader>
        <PerkCardBadges>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {perkItems.map((perkItem, index) => (
              <Badge
                key={`${perkItem}-${index}`}
                label={perkItem}
                variant={BadgeVariant.Alpha}
                size={BadgeSize.MD}
              />
            ))}
          </Box>
          <Badge
            startIcon={badge.icon}
            label={badge.label}
            variant={badge.variant}
            size={BadgeSize.MD}
          />
        </PerkCardBadges>
      </PerkCardContent>
    </PerkCardContainer>
  );
};
