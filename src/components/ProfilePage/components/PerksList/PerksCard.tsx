import { FC, useMemo } from 'react';
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

interface PerksCardProps {
  perk: PerksDataAttributes;
}

export const PerksCard: FC<PerksCardProps> = ({ perk }) => {
  const { title, description, imageUrl, href, unlockLevel, perkItems } =
    useFormatDisplayPerkData(perk);
  const activeAccount = useActiveAccountByChainType();
  const { t } = useTranslation();
  const { level, isLoading } = useLoyaltyPass(activeAccount?.address);

  // @TODO show loading badge if isLoading is true
  const levelBadge = useMemo(() => {
    const currentLevel = Number(level ?? 0);
    if (unlockLevel > currentLevel) {
      return (
        <Badge
          startIcon={<LockIcon />}
          label={t('profile_page.levelWithValue', { level: unlockLevel })}
          variant={BadgeVariant.Alpha}
          size={BadgeSize.LG}
        />
      );
    }

    return (
      <Badge
        startIcon={<LockOpenIcon />}
        label={t('profile_page.unlocked')}
        variant={BadgeVariant.Success}
        size={BadgeSize.LG}
      />
    );
  }, [unlockLevel, level, t]);

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
    />
  );

  return href ? (
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
  ) : (
    perkCard
  );
};
