import LockOpenIcon from '@mui/icons-material/LockOpen';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from 'src/components/Badge/Badge';
import { BadgeSize, BadgeVariant } from 'src/components/Badge/Badge.styles';
import { useFormatDisplayPerkData } from 'src/hooks/perks/useFormatDisplayPerkData';
import type { PerksDataAttributes } from 'src/types/strapi';
import { getTextEllipsisStyles } from 'src/utils/styles/getTextEllipsisStyles';
import {
  PerkCardBadges,
  PerkCardContainer,
  PerkCardContent,
  PerkCardHeader,
  PerkCardImage,
  PerkCardImagePlaceholder,
} from './UnlockedPerksSection.styles';

interface UnlockedPerkCardProps {
  perk: PerksDataAttributes;
}

export const UnlockedPerkCard: FC<UnlockedPerkCardProps> = ({ perk }) => {
  const { t } = useTranslation();
  const { title, description, imageUrl, perkItems } =
    useFormatDisplayPerkData(perk);

  return (
    <PerkCardContainer>
      {imageUrl ? (
        <PerkCardImage src={imageUrl} alt={title} />
      ) : (
        <PerkCardImagePlaceholder />
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
                label={
                  <Typography component="span" variant="bodySmallStrong">
                    {perkItem}
                  </Typography>
                }
                variant={BadgeVariant.Alpha}
                size={BadgeSize.LG}
              />
            ))}
          </Box>
          <Badge
            startIcon={<LockOpenIcon />}
            label={t('profile_page.unlocked')}
            variant={BadgeVariant.Success}
            size={BadgeSize.LG}
          />
        </PerkCardBadges>
      </PerkCardContent>
    </PerkCardContainer>
  );
};
