import { FC, useMemo, useRef } from 'react';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';

import { Badge } from 'src/components/Badge/Badge';
import { BadgeSize, BadgeVariant } from 'src/components/Badge/Badge.styles';
import { PerksCard as PerksCardComponent } from 'src/components/Cards/PerksCard/PerksCard';
import { Link } from 'src/components/Link';
import { useFormatDisplayPerkData } from 'src/hooks/perks/useFormatDisplayPerkData';
import { PerksDataAttributes } from 'src/types/strapi';
import { useActiveAccountByChainType } from 'src/hooks/useActiveAccountByChainType';
import { useLoyaltyPass } from 'src/hooks/useLoyaltyPass';
import { useTranslation } from 'react-i18next';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';

interface PerksCardProps {
  perk: PerksDataAttributes;
}

export const PerksCard: FC<PerksCardProps> = ({ perk }) => {
  const { title, description, imageUrl, href, unlockLevel, perkItems } =
    useFormatDisplayPerkData(perk);
  const activeAccount = useActiveAccountByChainType();
  const { t } = useTranslation();
  const { level, isLoading } = useLoyaltyPass(activeAccount?.address);
  const levelBadgeRef = useRef<HTMLElement>(null);

  const isLocked = useMemo(() => {
    const currentLevel = Number(level ?? 0);
    return unlockLevel > currentLevel;
  }, [unlockLevel, level]);

  const levelBadgeProps = useMemo(() => {
    if (isLocked) {
      return {
        startIcon: <LockIcon />,
        label: t('profile_page.levelWithValue', { level: unlockLevel }),
        variant: BadgeVariant.Alpha,
      };
    }

    return {
      startIcon: <LockOpenIcon />,
      label: t('profile_page.unlocked'),
      variant: BadgeVariant.Success,
    };
  }, [unlockLevel, isLocked, t]);

  // @TODO show loading badge if isLoading is true
  const levelBadge = useMemo(() => {
    return (
      <span ref={levelBadgeRef}>
        <Badge
          startIcon={levelBadgeProps.startIcon}
          label={levelBadgeProps.label}
          variant={levelBadgeProps.variant}
          size={BadgeSize.LG}
        />
      </span>
    );
  }, [levelBadgeProps]);

  const perksBadge = useMemo(() => {
    return perkItems.map((perkItem, index) => (
      <Badge
        key={`${perkItem}-${index}`}
        label={
          <Typography component="span" variant="bodySmallStrong">
            {perkItem}
          </Typography>
        }
        variant={BadgeVariant.Alpha}
        size={BadgeSize.LG}
      />
    ));
  }, [perkItems]);

  const perkCard = (
    <PerksCardComponent
      title={title}
      description={description}
      imageUrl={imageUrl}
      levelBadge={levelBadge}
      perksBadge={perksBadge}
      fullWidth
      isDisabled={isLocked}
    />
  );

  if (href && !isLocked) {
    return (
      <Link
        href={href}
        target="_blank"
        sx={{
          textDecoration: 'none',
          width: 'auto',
        }}
      >
        {perkCard}
      </Link>
    );
  }

  // @Note if it's a recurring use case of having the tooltip on disabled state, we can move it to the PerksCard component
  return (
    <Tooltip
      title={t('profile_page.tooltips.unlockAtLevel', {
        level: unlockLevel,
      })}
      arrow
      placement="top"
      enterDelay={100}
      disableTouchListener={false}
      enterTouchDelay={0}
      leaveTouchDelay={2000}
      slotProps={{
        popper: {
          disablePortal: true,
          anchorEl: levelBadgeRef.current,
        },
        tooltip: {
          sx: {
            color: (theme) => (theme.vars || theme).palette.textPrimaryInverted,
            backgroundColor: (theme) => (theme.vars || theme).palette.grey[900],
            '& .MuiTooltip-arrow': {
              color: (theme) => (theme.vars || theme).palette.grey[900],
            },
          },
        },
      }}
    >
      <span>{perkCard}</span>
    </Tooltip>
  );
};
