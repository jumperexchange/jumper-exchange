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
import {
  isClaimedPerk,
  useGetClaimedPerks,
} from '@/hooks/perks/useGetClaimedPerks';
import { useUnlockedPerks } from '@/hooks/perks/useUnlockedPerks';
import { ProfileContext } from '@/providers/ProfileProvider';
import type { PerksDataAttributes } from '@/types/strapi';
import { PerkCard } from '@/components/composite/cards/PerkCard/PerkCard';
import { UnlockedPerksEmpty } from './UnlockedPerksEmpty';
import {
  InfoBottom,
  InfoColumn,
  InfoDivider,
  InfoTop,
  openHubButtonSx,
  unlockedPerksCardSx,
} from './UnlockedPerksSection.styles';
import { sortBy } from 'lodash';

interface UnlockedPerksSectionProps {
  perks: PerksDataAttributes[];
}

export const UnlockedPerksSection = ({ perks }: UnlockedPerksSectionProps) => {
  const { t } = useTranslation();
  const { walletAddress, isLoading: isWalletLoading } =
    useContext(ProfileContext);
  const { unlockedPerks, isLoading: isPerksLoading } = useUnlockedPerks(perks);
  const { data: claimedPerks, isLoading: isClaimedLoading } =
    useGetClaimedPerks(walletAddress);

  if (
    isWalletLoading ||
    isPerksLoading ||
    (!!walletAddress && isClaimedLoading)
  ) {
    return null;
  }

  const claimedIds = new Set((claimedPerks ?? []).map((claim) => claim.perkId));

  // Show every unlocked perk so the count here matches the Jumper Pass stat.
  // Still-claimable perks come first; already-claimed ones follow, rendered
  // dimmed with a "Claimed" badge (same card as the Perks Hub).
  const orderedPerks = sortBy(unlockedPerks, (perk) =>
    Number(isClaimedPerk(perk, claimedIds)),
  );

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
            {orderedPerks.map((perk) => (
              <PerkCard
                key={perk.id}
                perk={perk}
                status={
                  isClaimedPerk(perk, claimedIds) ? 'claimed' : 'unlocked'
                }
              />
            ))}
          </SectionCarousel>
        )}
      </SectionCard>
    </PerkClaimModalProvider>
  );
};
