import CheckIcon from '@mui/icons-material/Check';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import Box from '@mui/material/Box';
import type { FC, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/Badge/Badge';
import { BadgeSize, BadgeVariant } from '@/components/Badge/Badge.styles';
import { CarouselCard } from '@/components/Cards/CarouselCard/CarouselCard';
import { usePerkClaimModal } from '@/components/ProfilePage/components/ClaimPerkModal/PerkClaimModalProvider';
import { useFormatDisplayPerkData } from '@/hooks/perks/useFormatDisplayPerkData';
import type { PerksDataAttributes } from '@/types/strapi';

export type PerkCardStatus = 'unlocked' | 'locked' | 'claimed';

interface PerkCardProps {
  perk: PerksDataAttributes;
  status?: PerkCardStatus;
}

export const PerkCard: FC<PerkCardProps> = ({ perk, status = 'unlocked' }) => {
  const { t } = useTranslation();
  const { openClaimModal } = usePerkClaimModal();
  const { title, description, imageUrl, perkItems } =
    useFormatDisplayPerkData(perk);

  // Unlocked perks open the claim flow; claimed perks re-open it to view the
  // "Perk claimed!" details. Locked perks stay inert.
  const isActionable = status === 'unlocked' || status === 'claimed';

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

  const card = (
    <CarouselCard
      title={title}
      description={description}
      imageUrl={imageUrl}
      dimmed={status !== 'unlocked'}
      badges={
        <>
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
            data-testid={
              status === 'claimed' ? 'perks-card-claimed-badge' : undefined
            }
            startIcon={badge.icon}
            label={badge.label}
            variant={badge.variant}
            size={BadgeSize.MD}
          />
        </>
      }
    />
  );

  if (!isActionable) {
    return card;
  }

  return (
    <Box
      role="button"
      tabIndex={0}
      onClick={() => openClaimModal(perk)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openClaimModal(perk);
        }
      }}
      sx={(theme) => ({
        display: 'block',
        width: '100%',
        cursor: 'pointer',
        borderRadius: `${theme.shape.radius12}px`,
        '&:focus-visible': {
          outline: `2px solid ${(theme.vars || theme).palette.primary.main}`,
          outlineOffset: 2,
        },
      })}
    >
      {card}
    </Box>
  );
};
