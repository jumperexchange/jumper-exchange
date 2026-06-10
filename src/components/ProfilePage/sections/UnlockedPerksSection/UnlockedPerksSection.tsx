'use client';
import Typography from '@mui/material/Typography';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'src/components/Button/Button';
import { SectionCard } from 'src/components/Cards/SectionCard/SectionCard';
import { useUnlockedPerks } from 'src/hooks/perks/useUnlockedPerks';
import { ProfileContext } from 'src/providers/ProfileProvider';
import type { PerksDataAttributes } from 'src/types/strapi';
import { PerksCarousel } from './PerksCarousel';
import { UnlockedPerkCard } from './UnlockedPerkCard';
import {
  InfoBottom,
  InfoColumn,
  InfoDivider,
  InfoTop,
  OpenHubWrapper,
  unlockedPerksCardSx,
} from './UnlockedPerksSection.styles';

interface UnlockedPerksSectionProps {
  perks: PerksDataAttributes[];
}

export const UnlockedPerksSection = ({ perks }: UnlockedPerksSectionProps) => {
  const { t } = useTranslation();
  const { isLoading: isWalletLoading } = useContext(ProfileContext);
  const { unlockedPerks, isLoading } = useUnlockedPerks(perks);

  if (isWalletLoading || isLoading || unlockedPerks.length === 0) {
    return null;
  }

  return (
    <SectionCard sx={unlockedPerksCardSx}>
      <InfoColumn>
        <InfoTop>
          <Typography
            variant="urbanistTitleXSmall"
            sx={{ color: 'accent1.main' }}
          >
            {t('profile_page.unlockedPerks.title')}
          </Typography>
          <Typography variant="bodyMediumParagraph" color="textSecondary">
            {t('profile_page.unlockedPerks.description')}
          </Typography>
          <OpenHubWrapper>
            {/* TODO: wire to the Perks hub once the route exists */}
            <Button variant="primary" size="medium">
              {t('profile_page.unlockedPerks.openHub')}
            </Button>
          </OpenHubWrapper>
        </InfoTop>
        <InfoBottom>
          <InfoDivider />
          <Typography variant="bodySmallParagraph" color="textSecondary">
            {t('profile_page.unlockedPerks.count', {
              count: unlockedPerks.length,
            })}
          </Typography>
        </InfoBottom>
      </InfoColumn>

      <PerksCarousel>
        {unlockedPerks.map((perk) => (
          <UnlockedPerkCard key={perk.id} perk={perk} />
        ))}
      </PerksCarousel>
    </SectionCard>
  );
};
