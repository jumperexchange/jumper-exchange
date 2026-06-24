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

  // This section is for perks that can still be claimed, so drop any the wallet
  // has already claimed (those live in the Perks Hub's Claimed tab).
  const claimedIds = new Set((claimedPerks ?? []).map((claim) => claim.perkId));
  const claimablePerks = unlockedPerks.filter(
    (perk) => !isClaimedPerk(perk, claimedIds),
  );

  const isEmpty = claimablePerks.length === 0;

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
                  count: claimablePerks.length,
                })}
              </Typography>
            </InfoBottom>
          )}
        </InfoColumn>

        {isEmpty ? (
          <UnlockedPerksEmpty />
        ) : (
          <SectionCarousel>
            {claimablePerks.map((perk) => (
              <PerkCard key={perk.id} perk={perk} status="unlocked" />
            ))}
          </SectionCarousel>
        )}
      </SectionCard>
    </PerkClaimModalProvider>
  );
};
