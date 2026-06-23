'use client';
import Typography from '@mui/material/Typography';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { SectionCard } from '@/components/Cards/SectionCard/SectionCard';
import { Button } from '@/components/core/buttons/Button/Button';
import { Link } from '@/components/Link/Link';
import { PerkClaimModalProvider } from '@/components/ProfilePage/components/ClaimPerkModal/PerkClaimModalProvider';
import { SectionCarousel } from '@/components/ProfilePage/components/SectionCarousel/SectionCarousel';
import { AppPaths } from '@/const/urls';
import { useUnlockedPerks } from '@/hooks/perks/useUnlockedPerks';
import { ProfileContext } from '@/providers/ProfileProvider';
import type { PerksDataAttributes } from '@/types/strapi';
import { PerkCard } from './PerkCard';
import { UnlockedPerksEmpty } from './UnlockedPerksEmpty';
import {
  InfoBottom,
  InfoColumn,
  InfoDivider,
  InfoTop,
  openHubButtonSx,
  unlockedPerksCardSx,
} from './UnlockedPerksSection.styles';

interface UnlockedPerksSectionProps {
  perks: PerksDataAttributes[];
}

export const UnlockedPerksSection = ({ perks }: UnlockedPerksSectionProps) => {
  const { t } = useTranslation();
  const { isLoading: isWalletLoading } = useContext(ProfileContext);
  const { unlockedPerks, isLoading } = useUnlockedPerks(perks);

  if (isWalletLoading || isLoading) {
    return null;
  }

  const isEmpty = unlockedPerks.length === 0;

  return (
    <PerkClaimModalProvider>
      <SectionCard sx={unlockedPerksCardSx}>
        <InfoColumn sx={isEmpty ? { justifyContent: 'center' } : undefined}>
          <InfoTop>
            <Typography variant="titleXSmall" sx={{ color: 'accent1.main' }}>
              {t('profile_page.unlockedPerks.title')}
            </Typography>
            <Typography variant="bodyMediumParagraph" color="textSecondary">
              {t('profile_page.unlockedPerks.description')}
            </Typography>
            <Button component={Link} href={AppPaths.Perks} sx={openHubButtonSx}>
              {t('profile_page.unlockedPerks.openHub')}
            </Button>
          </InfoTop>
          {!isEmpty && (
            <InfoBottom>
              <InfoDivider />
              <Typography variant="bodySmallParagraph" color="textSecondary">
                {t('profile_page.unlockedPerks.count', {
                  count: unlockedPerks.length,
                })}
              </Typography>
            </InfoBottom>
          )}
        </InfoColumn>

        {isEmpty ? (
          <UnlockedPerksEmpty />
        ) : (
          <SectionCarousel>
            {unlockedPerks.map((perk) => (
              <PerkCard key={perk.id} perk={perk} status="unlocked" />
            ))}
          </SectionCarousel>
        )}
      </SectionCard>
    </PerkClaimModalProvider>
  );
};
